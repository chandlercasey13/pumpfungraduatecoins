import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import WebSocket from "ws";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getXPostCount } from "./tokenUtilis.mjs";
import { publicKey, u64, bool } from "@solana/buffer-layout-utils";
import { u32, u8, struct } from "@solana/buffer-layout";

import { VersionedTransaction, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import dotenv from "dotenv";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const SOLANA_WS_URL = `${process.env.SOL_WS_URL}`;
const SOLANA_HTTP_URL = `${process.env.HTTP_RPC_URL}`;
const RAYDIUM_PUBLIC_KEY = new PublicKey(`${process.env.PUMPFUN_KEY}`);
const connection = new Connection(SOLANA_HTTP_URL, {
  wsEndpoint: SOLANA_WS_URL,
  commitment: "processed",
});

const sendCachedCoins = (socket) => {
  if (coinCache.size > 0) {
    console.log(coinCache.size);
    for (const coinMint of coinCache.keys()) {
      const cachedCoin = coinCache.get(coinMint);
      if (cachedCoin.ownerHoldings || cachedCoin.bundleSupply) {
        socket.emit("holdings", {
          coinMint: cachedCoin.coinMint,
          devHoldings: cachedCoin.ownerHoldings,
          bundleSupply: cachedCoin.bundleSupply,
        });

        console.log(cachedCoin.ownerHoldings);
        console.log(cachedCoin.bundleSupply);
        console.log(cachedCoin.coinMint);
      }
    }
  } else {
    console.log("CoinCache is empty, nothing to emit.");
  }
};

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Socket connected");

    setTimeout(() => {
      sendCachedCoins(socket);
    }, 2000);

    const solanaWs = new WebSocket(SOLANA_WS_URL);

    solanaWs.on("open", (solSocket) => {
      console.log("Connected to Solana WebSocket");

      const intervalTime = 3000;

      const startFetching = (socket, solSocket) => {
        aboutToGraduateCoins(socket, solSocket);

        //getXPostCount('9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump')
        const intervalId = setInterval(() => {
          aboutToGraduateCoins(socket, solSocket);
        }, intervalTime);

        return intervalId;
      };

      startFetching(socket, solSocket);
      aboutToGraduateCoins(socket, solSocket);
    });

    socket.on("disconnect", () => {
      console.log(" Solana Socket disconnected");

      solanaWs.close();
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

const aboutToGraduateCoins = async (socket, solSocket) => {
  const url = "https://advanced-api.pump.fun/coins/about-to-graduate";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    socket.emit("data", data);

    await cacheCoins(data, socket, solSocket);
  } catch (error) {
    console.error("Error fetching coins:", error);
  }
};

const findOwnerHoldings = async (coinDev, coinMint) => {
  const url = `https://frontend-api-v2.pump.fun/balances/${coinDev}?limit=50&offset=0&minBalance=-1`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      const matchingItem = data.find((item) => item.mint === coinMint);
      if (matchingItem) {
        return Math.round(matchingItem.balance / 1e6);
        //console.log(`Dev: ${coinDev} supply of ${coinMint}:`, Math.round(matchingItem.balance / 1e6));
      } else {
        console.log(`No match found for coinMint ${coinMint}.`);
      }
    } else {
      console.error("Response data is not an array:", data);
    }
  } catch (err) {
    console.error("Error in findOwnerHoldings:", err);
  }
};

const findBundleHoldings = async (coinMint) => {
  const url = `https://trench.bot/api/bundle_advanced/${coinMint}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.total_percentage_bundled) {
      return data.total_percentage_bundled;
    } else {
      console.log(`No bundled supply for ${coinMint}.`);
    }
  } catch (err) {
    console.error("Error in findOwnerHoldings:", err);
  }
};

let coinCache = new Map();
const inProgress = new Set();

const cacheCoins = async (data, socket, solSocket) => {
  if (!Array.isArray(data)) {
    console.error("cacheCoins: Input data must be an array.");
    return;
  }

  for (const coin of data) {
    if (
      coin &&
      coin.coinMint &&
      !coinCache.has(coin.coinMint) &&
      !inProgress.has(coin.coinMint)
    ) {
      inProgress.add(coin.coinMint);
      // console.log(coin)

      (async () => {
        try {
          const bundleSupply = await findBundleHoldings(coin.coinMint);
          const ownerHoldings = await findOwnerHoldings(
            coin.dev,
            coin.coinMint
          );

          coin.bundleSupply = bundleSupply;
          coin.ownerHoldings = ownerHoldings;

          coinCache.set(coin.coinMint, coin);

          socket.emit("holdings", {
            coinMint: coin.coinMint,
            devHoldings: ownerHoldings,
            bundleSupply: bundleSupply,
          });

          // console.log(`Processed and cached ${coin.coinMint}`);
        } catch (error) {
          console.error(`Error processing coin ${coin.coinMint}:`, error);
        } finally {
          inProgress.delete(coin.coinMint); // Remove from in-progress
        }
      })();
    } else if (coin && coin.coinMint && coinCache.has(coin.coinMint)) {
      const cachedCoin = coinCache.get(coin.coinMint);

      if (cachedCoin.ownerHoldings || cachedCoin.bundleSupply) {
        socket.emit("holdings", {
          coinMint: cachedCoin.coinMint,
          devHoldings: cachedCoin.ownerHoldings,
          bundleSupply: cachedCoin.bundleSupply,
        });

        console.log(`Emitted cached data for ${cachedCoin.coinMint}`);
      }
    }
  }
};

// function connectSolanaWs(socket) {

// const subscriptionMessage = {
//   "jsonrpc": "2.0",
//   "id": 1, // Unique ID for this subscription
//   "method": "programSubscribe",
//   "params": [
//   "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P", // Program ID to monitor
//    {
//     "encoding": "base64",
//     "commitment": "confirmed"
//   },
//   ],
// };

// {
//   jsonrpc: "2.0",
//   id: 1,
//   method: "logsSubscribe",
//   params: [
//     {
//       mentions: [RAYDIUM_PUBLIC_KEY.toBase58()],
//     },
//     {
//       commitment: "confirmed",
//     },
//   ],
// };

// solanaWs.send(JSON.stringify(subscriptionMessage));
// console.log("Subscribed to Raydium logs");

//   solanaWs.onmessage = async (event) => {
//     try {
//       const data = JSON.parse(event.data);
//       // console.log("Received WebSocket message:", data);

//       if (data.method === "programNotification") {
//         console.log("Program Notification:", data.params.result);
//        const accountData = data.params.result.value.account.data[0]

//         const decodedAccountData = Buffer.from(accountData, "base64")

//       }

//       if (data.method === "logsNotification") {
//         const { result } = data.params;
//         const { value } = result; // { err, logs, signature }

//         // Filter for specific logs
//         const initializeAccountLogs = value.logs?.filter((log) =>
//           log.includes("Program log: Instruction: InitializeAccount")
//         );

//         if (initializeAccountLogs && initializeAccountLogs.length === 2) {
//           console.log(
//             "Detected exactly 2 'Program log: Instruction: InitializeAccount' logs for transaction:",
//             value.signature
//           );

//           await parseSPLInstructions(value.signature, socket);
//         }
//       }
//     } catch (error) {
//       console.error("Error processing WebSocket message:", error);
//     }
//   };

//   solanaWs.onerror = (error) => {
//     console.error("WebSocket error:", error);
//   };

//   solanaWs.onclose = (code, reason) => {
//     console.log(`WebSocket closed: Code ${code}, Reason ${reason}`);
//     if (code === 1006) {
//       console.log("Reconnecting after 3 seconds...");
//       setTimeout(() => {
//         connectSolanaWs(socket); // Assuming `connectSolanaWs` is the wrapper function
//       }, 3000);
//     }
//   };

// }

let contract = null;

async function sendPortalTransaction(orderType, contract, amountSol) {
  // if (contract != null) return;

  console.log(`Attempting ${orderType}...`);

  const fixedSolAmount = 0.03;

  console.log(
    "--------------------------------------------------------------------------------------------"
  );
  console.log(
    `[${new Date()
      .toISOString()
      .replace("T", " ")
      .replace("Z", "")}] Mint Address: ${contract}`
  );

  console.log(
    "--------------------------------------------------------------------------------------------"
  );
  // try {
  //   const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       publicKey: `${process.env.PUBLIC_WALLET_KEY}`,
  //       action: `${orderType}`,
  //       mint: `${contract}`,
  //       denominatedInSol: "true",
  //       amount: .02,
  //       slippage: 20,
  //       priorityFee: 0.00004,
  //       pool: "raydium",
  //     }),
  //   });

  //   if (response.status === 200) {

  //     const data = await response.arrayBuffer();
  //     const tx = VersionedTransaction.deserialize(new Uint8Array(data));
  //     const signerKeyPair = Keypair.fromSecretKey(
  //       bs58.decode(
  //         `${process.env.PRIVATE_WALLET_KEY}`
  //       )
  //     );
  //     tx.sign([signerKeyPair]);

  //     try {
  //       const signature = await connection.sendTransaction(tx);
  //       console.log("Transaction: https://solscan.io/tx/" + signature);
  //     } catch (sendError) {
  //       if (sendError.logs) {
  //         console.error("Transaction simulation logs:", sendError.logs);
  //       }
  //       throw new Error(
  //         `SendTransactionError: ${sendError.message}, Logs: ${sendError.logs}`
  //       );
  //     }
  //   } else {
  //     console.error("Failed to generate transaction:", response.statusText);
  //   }
  // } catch (err) {

  //   if (err.logs) {
  //     console.error("Transaction simulation failed with logs:", err.logs);
  //   } else {
  //     console.error("An unexpected error occurred:", err.message);
  //   }
  // }
}

async function parseSPLInstructions(txId, socket) {
  try {
    const tx = await connection.getParsedTransaction(txId, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    });

    if (!tx || !tx.transaction?.message?.instructions?.length) {
      console.log(`No transaction or instructions found for: ${txId}`);
      return null;
    }

    const { instructions } = tx.transaction.message;

    const splIx = instructions.filter(
      (ix) => ix.programId?.toBase58() === TOKEN_PROGRAM_ID.toBase58()
    );

    if (!splIx.length) {
      console.log(`No SPL Token instructions found in transaction: ${txId}`);
      return null;
    }

    if (splIx.length < 2) {
      console.log(`Less than 2 SPL instructions found in transaction: ${txId}`);
      return null;
    }

    const secondInstruction = splIx[1];
    const parsedInfo = secondInstruction?.parsed?.info;

    if (parsedInfo?.mint) {
      console.log("txID:=====================", txId);
      console.log(`Mint from SPL Instruction #2: ${parsedInfo.mint}`);

      socket.emit("data", { mint: parsedInfo.mint });

      contract = parsedInfo.mint;
      sendPortalTransaction("buy", contract);
      return parsedInfo.mint;
    } else {
      console.log(
        `No 'mint' found in SPL Instruction #2 for transaction: ${txId}`
      );
      return null;
    }
  } catch (error) {
    console.error("Error parsing SPL instructions:", error);
    return null;
  }
}
