import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import WebSocket from "ws";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";




import { VersionedTransaction,  Keypair } from '@solana/web3.js';
import bs58 from "bs58";
import dotenv from "dotenv";

dotenv.config();


const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

//const SOLANA_WS_URL = "wss://api.mainnet-beta.solana.com"; // WebSocket for logs
const SOLANA_WS_URL = `${process.env.SOL_WS_URL}`
// const SOLANA_HTTP_URL = "https://api.mainnet-beta.solana.com"; // HTTP for transaction lookups
const SOLANA_HTTP_URL = `${process.env.HTTP_RPC_URL}`; // HTTP for transaction lookups
const RAYDIUM_PUBLIC_KEY = new PublicKey(`${process.env.PUMPFUN_KEY}`);
//const RAYDIUM_PUBLIC_KEY = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");
const connection = new Connection(SOLANA_HTTP_URL, {
  wsEndpoint: SOLANA_WS_URL,
  commitment: "processed", // Optional, but included for clarity
});






let contract = null;

async function sendPortalTransaction(orderType, contract, amountSol) {
console.log('contract equals', contract)
  // if (contract != null) return;

  console.log(`Attempting ${orderType}...`);

  const fixedSolAmount = 0.03;
  console.log('--------------------------------------------------------------------------------------------')
  console.log(orderType);
  console.log(contract);
console.log('--------------------------------------------------------------------------------------------')
  try {
    const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicKey: `${process.env.PUBLIC_WALLET_KEY}`, 
        action: `${orderType}`, 
        mint: `${contract}`,
        denominatedInSol: "true", 
        amount: .03, 
        slippage: 20,
        priorityFee: 0.00002, 
        pool: "raydium", 
      }),
    });

    if (response.status === 200) {
     
      const data = await response.arrayBuffer();
      const tx = VersionedTransaction.deserialize(new Uint8Array(data));
      const signerKeyPair = Keypair.fromSecretKey(
        bs58.decode(
          `${process.env.PRIVATE_WALLET_KEY}`
        )
      );
      tx.sign([signerKeyPair]);

      try {
        const signature = await connection.sendTransaction(tx);
        console.log("Transaction: https://solscan.io/tx/" + signature);
      } catch (sendError) {
        if (sendError.logs) {
          console.error("Transaction simulation logs:", sendError.logs);
        }
        throw new Error(
          `SendTransactionError: ${sendError.message}, Logs: ${sendError.logs}`
        );
      }
    } else {
      console.error("Failed to generate transaction:", response.statusText);
    }
  } catch (err) {
   
    if (err.logs) {
      console.error("Transaction simulation failed with logs:", err.logs);
    } else {
      console.error("An unexpected error occurred:", err.message);
    }
  }
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
      console.log(`Mint from SPL Instruction #2: ${parsedInfo.mint}`);

      
      socket.emit("data", { mint: parsedInfo.mint });

      contract = parsedInfo.mint;
      sendPortalTransaction("buy", contract);
      return parsedInfo.mint; 
    } else {
      console.log(`No 'mint' found in SPL Instruction #2 for transaction: ${txId}`);
      return null; 
    }
  } catch (error) {
    console.error("Error parsing SPL instructions:", error);
    return null; 
  }
}




function connectSolanaWs(socket) {
  const solanaWs = new WebSocket(SOLANA_WS_URL);

  solanaWs.on("open", () => {
    console.log("Connected to Solana WebSocket");

    const subscriptionMessage = {
      jsonrpc: "2.0",
      id: 1,
      method: "logsSubscribe",
      params: [
        {
          mentions: [RAYDIUM_PUBLIC_KEY.toBase58()],
        },
        {
          commitment: "processed",
        },
      ],
    };

    solanaWs.send(JSON.stringify(subscriptionMessage));
    console.log("Subscribed to Raydium logs");
  });

  solanaWs.on("message", async (data) => {
    const parsedData = JSON.parse(data);
    console.log(parsedData)
    if (parsedData.method === "logsNotification") {
      const { result } = parsedData.params;
      const { value } = result; // { err, logs, signature }
      console.log(value)
      const initializeAccountLogs = value.logs?.filter((log) =>
        log.includes("Program log: Instruction: InitializeAccount")
      );

      if (initializeAccountLogs && initializeAccountLogs.length === 2) {
        console.log(
          "Detected exactly 2 'Program log: Instruction: InitializeAccount' logs for transaction:",
          value.signature
        );

       
        await parseSPLInstructions(value.signature, socket);
      }
    }
  });

  socket.on("sell", async (data) => {
    contract = null;
    console.log(contract);
  });

  solanaWs.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  solanaWs.on("close", (code, reason) => {
    console.log("WebSocket closed:", code, reason);
    if (code === 1006) {
      console.log("Reconnecting after 3 seconds...");
      setTimeout(() => {
        connectSolanaWs(socket);
      }, 3000);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
    solanaWs.close();
  });
}





app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Socket connected");
    connectSolanaWs(socket);
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
