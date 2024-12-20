import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {



   console.log('connected')
   fetch('https://api.dexscreener.com/token-profiles/latest/v1') // Replace with your desired URL
   .then((response) => response.json())
   .then((data) => {
     console.log('GET request data:', data);

     const filteredData = data.filter(item => item.chainId === 'solana');

     console.log(filteredData)
     
     socket.emit('data', filteredData);
   })
   .catch((error) => {
     console.error('Error fetching data:', error);
     socket.emit('error', { message: 'Error fetching data' });
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