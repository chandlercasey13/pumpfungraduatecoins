"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PreviousMap from "postcss/lib/previous-map";

interface Coin {
  chainId: number;
  tokenAddress: string;
  [key: string]: any;
}

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");
  const [coins, setCoins] = useState<Coin[]>([]);
  const [coinDevHoldings, setCoinDevHoldings] = useState(new Map());

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

    const areArraysEqual = (arr1: Coin[], arr2: Coin[]) => {
      if (arr1.length !== arr2.length) return false;

      for (let i = 0; i < arr1.length; i++) {
        if (
          arr1[i].tokenAddress !== arr2[i].tokenAddress ||
          arr1[i].marketCap !== arr2[i].marketCap
        ) {
          return false;
        }
      }
      return true;
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("data", (newMintList) => {
      setCoins((prevCoins) => {
        const isOrderDifferent = !areArraysEqual(prevCoins, newMintList);

        if (isOrderDifferent) {
          return newMintList;
        }

        return prevCoins;
      });
    });
    socket.on("holdings", (holdings) => {
      setCoinDevHoldings((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(holdings.coinMint, holdings.devHoldings);
        return newMap;
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

  interface CopyToClipboardButtonProps {
    textToCopy: string;
  }

  const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
    textToCopy,
  }) => {
    const [copySuccess, setCopySuccess] = useState<string>("");

    const handleCopy = async (): Promise<void> => {
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopySuccess("Copied!");
      } catch (err) {
        setCopySuccess("Failed to copy!");
      }

      setTimeout(() => {
        setCopySuccess("");
      }, 2000);
    };
    return (
      <button
        onClick={handleCopy}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Copy to Clipboard
      </button>
    );
  };

  return (
    <main className="min-h-screen w-screen flex flex-col justify-center items-center bg-black overflow-auto">
      <h1 className="font-bold text-2xl pb-6 pt-4 md:text-5xl md:pb-10 text-white">
        Pump.Fun about to Graduate
      </h1>
      <div className="h-full w-full relative md:h-[50rem] md:w-[70rem] border-[1px] border-color-white rounded-md overflow-auto scrollbar-thin  scrollbar-thumb-white scrollbar-track-transparent scrollbar-thumb-rounded">
        <ul className="h-full flex flex-col ">
          {coins.length === 0 ? (
            <li className="text-white">Loading...</li>
          ) : (
            coins.map((item, index) => (
              <li
                key={index}
                className=" relative w-full min-h-20 overflow-y-auto flex items-center justify-start border-b-2   "
              >
                <div className=" w-16 h-full flex justify-center items-center md:pl-4 md:w-20 ">
                  <Avatar>
                    <AvatarImage src={item.imageUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col h-full w-1/4 max-w-26 items-center justify-center text-white text-ellipsis">
                  <div className="w-full ">
                    <h1 className="font-bold">{item.ticker}</h1>
                    <p className="text-nowrap truncate font-extralight ">
                      {item.name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col  h-full items-center justify-center text-white ">
                  <h1>{Math.round(item.marketCap).toLocaleString()}</h1>
                  <p>{Math.round(item.bondingCurveProgress)}%</p>
                </div>
                <div className="flex flex-row h-full w-[30%]  items-center justify-center gap-2 text-white text-ellipsis  md:gap-8">
                  <p>{item.numHolders}</p>
                  <p>
                    {coinDevHoldings.has(item.coinMint)
                      ? `${(
                          (coinDevHoldings.get(item.coinMint) / 1e9) *
                          100
                        ).toFixed(2)}%`
                      : "0"}
                  </p>
                  <p>20</p>
                  <p>30</p>
                </div>
                <div className=" hidden h-full i text-white text-ellipsis pr-4 overflow-x-hidden justify-end text-sm w-[22rem] max-w-[22rem]  md:flex md:items-center">
                  <p className="w-full text-end text-ellipsis">
                    <CopyToClipboardButton textToCopy={item.coinMint} />
                    {item.coinMint}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
