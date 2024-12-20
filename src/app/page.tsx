"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }


    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
socket.on("data",(value) => {
 console.log(value)
} )




    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  console.log(isConnected)
  console.log(transport)

  return (
   
      <main className="h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="font-bold text-5xl pb-10">PumpFun Graduates</h1>
       <div className="h-full w-full    md:max-h-[50rem] md:max-w-[70rem] border-[1px] border-color-white rounded-md">

       </div>
      </main>
      
   
  );
}
