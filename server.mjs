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

    const startFetching = (socket) => {
      aboutToGraduateCoins(socket);
      intervalId = setInterval(() => {
        aboutToGraduateCoins(socket);
      }, intervalTime);
    };

    startFetching(socket);
    aboutToGraduateCoins(socket);

    socket.on("disconnect", () => {
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
