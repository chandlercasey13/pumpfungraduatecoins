import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import dotenv from "dotenv";
import { sendCachedCoins, aboutToGraduateCoins } from "./pumpfun.mjs";
dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();


app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Socket connected");

    setTimeout(() => {
      sendCachedCoins(socket);
    }, 2000);



    let intervalId; 



      const intervalTime = 3000;

      const startFetching = (socket ) => {
        aboutToGraduateCoins(socket);
        intervalId = setInterval(() => {
          aboutToGraduateCoins(socket, );
        }, intervalTime);

        
      }

      startFetching(socket );
      aboutToGraduateCoins(socket);


      socket.on("disconnect", () => {
        console.log(" Solana Socket disconnected");
        clearInterval(intervalId);
       
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
