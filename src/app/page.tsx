"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";

// Define the structure of each coin item, assuming it has a chainId and other properties
interface Coin {
  chainId: number;
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
    socket.on("data", (value: Coin[]) => {
      setCoins(value); // Set the received coins data
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("data", (value: Coin[]) => {
        setCoins(value); 
      });
    };
  }, []);

  console.log(isConnected);
  console.log(transport);

  return (
    <main className="h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="font-bold text-5xl pb-10">PumpFun Graduates</h1>
      <div className="h-full w-full md:max-h-[50rem] md:max-w-[70rem] border-[1px] border-color-white rounded-md">
        <ul>
          {coins.length === 0 ? (
            <li>Loading...</li>
          ) : (
            coins.map((item, index) => (
              <li key={index} className="w-full h-20 overflow-y-auto flex ">
                <div className="w-20 pl-4">{item.icon}</div>
                <div></div>
                
               
                <div></div>  {/* Display other item details */}
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}