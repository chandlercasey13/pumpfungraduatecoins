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
    console.log("connected");

    // Function to fetch and filter data
    function fetchData() {
      fetch('https://api.dexscreener.com/token-profiles/latest/v1') // Replace with your desired URL
        .then((response) => response.json())
        .then((data) => {
          

          // Filter data based on chainId and tokenAddress
          const filteredData = data.filter((item) => {
            return item.chainId === 'solana' && item.tokenAddress && item.tokenAddress.endsWith('pump');
          });
          console.log(filteredData);

          // Emit filtered data to the client
          socket.emit("data", filteredData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          socket.emit("error", { message: "Error fetching data" });
        });
    }

    // Start fetching data every 1 second
    const intervalId = setInterval(fetchData, 3000);

    // Run the initial fetch when the connection is established
    fetchData();

    // Clear the interval when the client disconnects
    socket.on("disconnect", () => {
      console.log('A user disconnected');
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