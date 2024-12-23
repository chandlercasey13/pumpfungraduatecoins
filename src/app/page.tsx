"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define the structure of each coin item
interface Coin {
  chainId: number;
  tokenAddress: string;
  [key: string]: any; // Allow additional properties if necessary
}

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");
  const [coins, setCoins] = useState<Coin[]>([]); // State to store an array of coins

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport: { name: string }) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("data", (newMint: Coin) => {
      // Update state with the new mint if it doesn't already exist
      setCoins((prevCoins) => {
        const exists = prevCoins.some((coin) => coin.tokenAddress === newMint.tokenAddress);
        if (!exists) {
          return [...prevCoins, newMint];
        }
        return prevCoins;
      });
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("data");
    };
  }, []);

  const handleSell = () => {
    socket.emit("sell", "work");
    console.log("Sell event emitted:");
  };

  console.log(`${process.env.PUMPFUN_KEY}`);

  return (
    <main className="min-h-screen w-screen flex flex-col justify-center items-center bg-black overflow-auto">
      <h1 className="font-bold text-5xl pb-10 text-white">PumpFun Graduates</h1>
      <div className="h-full w-full md:max-h-[50rem] md:max-w-[70rem] border-[1px] border-color-white rounded-md">
        <button className="h-20 w-20 bg-white" onClick={handleSell}>
          Sell
        </button>

        <ul className="h-full flex flex-col">
          {coins.length === 0 ? (
            <li className="text-white">Loading...</li>
          ) : (
            coins.map((item, index) => (
              <li
                key={index}
                className="w-full h-20 overflow-y-auto flex border-b-2 gap-6"
              >
                <div className="w-20 pl-4 flex justify-center items-center">
                  <Avatar>
                    <AvatarImage src={item.icon} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex items-center text-white">
                  {item.tokenAddress}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
