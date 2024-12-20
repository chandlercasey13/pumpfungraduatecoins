"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
      // Compare the new data with the current state and update only if there's a difference
      setCoins((prevCoins) => {
        // Filter out coins that are already present in the state
        const newCoins = value.filter((newCoin) => {
          return !prevCoins.some((existingCoin) => existingCoin.tokenAddress === newCoin.tokenAddress);
        });

        // Return the updated state with new coins added
        return [...prevCoins, ...newCoins];
      });
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("data", (value: Coin[]) => {
        setCoins(value); 
      });
    };
  }, []);



  return (
    <main className="min-h-screen w-screen flex flex-col justify-center items-center bg-black overflow-auto">
      <h1 className="font-bold text-5xl pb-10 text-white">PumpFun Graduates</h1>
      <div className="h-full w-full md:max-h-[50rem] md:max-w-[70rem] border-[1px] border-color-white rounded-md">
        <ul className="h-full flex flex-col">
          {coins.length === 0 ? (
            <li>Loading...</li>
          ) : (
            coins.map((item, index) => (
              <li key={index} className="w-full h-20 overflow-y-auto flex border-b-2 gap-6  ">
                <div className="w-20 pl-4 flex justify-center items-center">
                <Avatar>
  <AvatarImage src={item.icon} />
  <AvatarFallback>CN</AvatarFallback>
</Avatar></div>
                <div className=" flex items-center text-white"> {item.tokenAddress}</div>
                
               
                <div></div>  {/* Display other item details */}
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}