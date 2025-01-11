"use client";

import { useEffect, useState } from "react";

import { initializeSocketListeners } from "../lib/socketData";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Chart from "../components/tvChart";
import Spinner from "../components/ui/Spinner";
import { GrBundle } from "react-icons/gr";
import { TbNumber10 } from "react-icons/tb";
import { FaDev } from "react-icons/fa";
import { CiUser } from "react-icons/ci";

import BlurFade from "@/components/ui/blur-fade";

export interface Coin {
  chainId: string;
  tokenAddress: string;
  ticker?: string;
  name?: string;
  marketCap?: number;
  bondingCurveProgress?: number;
  numHolders?: number;
  imageUrl?: string;
  coinMint: string;
  [key: string]: string | number | undefined;
}

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [coinDevHoldings, setCoinDevHoldings] = useState(new Map());
  const [changedCoins, setChangedCoins] = useState<string[]>([]);

  useEffect(() => {
    const cleanup = initializeSocketListeners(
      setCoins,
      setChangedCoins,
      setCoinDevHoldings
    );

    return () => cleanup();
  }, []);

  interface CopyToClipboardButtonProps {
    textToCopy: string;
  }

  const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
    textToCopy,
  }) => {
    const handleCopy = async (): Promise<void> => {
      await navigator.clipboard.writeText(textToCopy);
    };
    return (
      <button
        onClick={handleCopy}
        className="px-1 w-6   text-white  rounded hover:bg-gray-500"
      >
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAdNJREFUeF7tm8FtwzAMAMlNmknabNJMUmSSZpNmk2YTxixkoA/HokrLjY3TK4AlmTqdKD9CFdosAYXPPAEAVQwBEIBySQSD/ssgM3sRkQ8Rec/t4ezom4hcReSsqv578dbNIDP7GoJ/Wzzi6Qlvqnro8a4ugIo93z0CnpnzqKpu06KtGZCZ+bFxM9ayY4kFj0fRTTu3TBgGVKz43BiYKRYOy20L5awWQGvmlJZN/kvfq6oeIwNDgMzMbyK3Z0/tpKqX2oKigBxOz+u6FmeP5yGLooD8RvLvmj210KdBFJBNkRluhMnxw0032b833dZ4HvX/HSeAKrsGIACJPDryHLFiB4AKiM0k6d63Vev8T2dQ6wJ69wdQhTCAAJQ7hBiEQRiUI4BBOX7kIAzCoBwBDMrxIwdhEAblCGBQjh85CIMwKEcAg3L8yEEYhEE5AhiU40cOwiAMyhHAoBw/chAGYVCOAAbl+JGDMAiDcgQwKMePHIRBz2/QHqt9ZMl/2u+p2nDU8aKqp5qb0WIWKg5rJFeug6+Fk30eqjb0l4QM8o47qnoOw2kCNG5ZKfB9LeXhWynT9BLwn9r5bnXzWae3Oj58xLa6wGzcAKoQBBCAcocMgyr87gXh0VgK834bAAAAAElFTkSuQmCC" />
      </button>
    );
  };

  return (
    <main className=" relative min-h-screen w-screen flex flex-col justify-center items-center bg-black/85 md:overflow-hidden">
      <BlurFade
        direction="up"
        className=" h-full w-screen flex flex-col justify-center items-center  md:overflow-hidden"
      >
        <h1 className=" h-[10%]  font-bold text-2xl pb-6  md:text-5xl md:pb-10 text-white">
          Pump.Fun about to Graduate
        </h1>
        <div className=" h-full w-full flex justify-center relative  bg-white/30 backdrop-blur-sxl md:h-[50rem] max-w-[70rem]  md:rounded-lg md:overflow-y-hidden scrollbar-thin  scrollbar-thumb-white scrollbar-track-transparent scrollbar-thumb-rounded">
          <ul className=" h-full w-full flex flex-col ">
            {coins.length === 0 ? (
              <li className="w-full h-[90vh] flex justify-center items-center">
                <div className="  w-40 h-40">
                  <Spinner />
                </div>
              </li>
            ) : (
              coins.map((item, index) => (
                <li
                  key={index}
                  className={`${
                    changedCoins.includes(item.coinMint) ? "highlight" : ""
                  }  relative w-full min-h-[6rem] h-[6rem]   md:min-h-[5rem] pr-1 flex items-center justify-around md:justify-start  border-b-[1px] border-black/10   `}
                >
                  <div
                    className=" w-12 
                 h-full flex justify-center items-center mr-2 pl-2 md:pl-4 md:w-20 "
                  >
                    <Avatar>
                      <AvatarImage src={item.imageUrl} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col h-full w-[20%] mr-4  md:text-base md:w-[25%] max-w-[11rem] items-center justify-center text-xs text-white text-ellipsis">
                    <div className="w-full ">
                      <h1 className="font-semibold hidden sm:flex">
                        {item.ticker}
                      </h1>
                      <p className="text-nowrap truncate font-bold text-xs  ">
                        {item.name}
                      </p>
                    </div>
                  </div>

                  <div className="h-full w-[15%] md:max-w-[20%]">
                    <Chart />
                  </div>
                  <div className="flex flex-col w-[25%] max-w-[6rem]  h-full items-center justify-center text-sm md:text-base text-white ">
                    {item.marketCap ? (
                      <h1>
                        {Math.round(Number(item.marketCap)).toLocaleString()}
                      </h1>
                    ) : (
                      <h1>N/A</h1>
                    )}
                    <p>
                      {item.bondingCurveProgress !== undefined
                        ? `${Math.round(item.bondingCurveProgress)}%`
                        : "N/A"}
                    </p>
                  </div>

                  <div className="flex flex-row h-full w-[40%] py-3 md:w-[35%] text-xs md:text-base text-[10px]  items-center justify-center md:gap-2 text-white text-ellipsis  ">
                    <div className="w-1/2 h-full flex flex-col justify-center items-center  md:flex-row ">
                      <div
                        className={`flex justify-center items-center w-full h-1/2 md:w-1/2 gap-[.4rem] 
                      ${
                        item.numHolders && item.numHolders <= 50
                          ? "text-red-400"
                          : ""
                      } 
                      ${
                        item.numHolders &&
                        item.numHolders < 75 &&
                        item.numHolders > 50
                          ? "text-orange-300"
                          : ""
                      }
                      ${
                        item.numHolders && item.numHolders > 75
                          ? "text-green-300"
                          : ""
                      }
                      `}
                      >
                        <p className="flex items-center">{item.numHolders}</p>

                        <CiUser className="  w-4 h-4  md:w-5 md:h-5  " />
                      </div>

                      <div
                        className={`flex items-center justify-center gap-[.4rem] w-full md:w-1/2 h-1/2 
                      ${
                        coinDevHoldings.has(item.coinMint) &&
                        coinDevHoldings.get(item.coinMint)[0].devHoldings > 40
                          ? "text-red-400"
                          : ""
                      }
                      ${
                        coinDevHoldings.has(item.coinMint) &&
                        coinDevHoldings.get(item.coinMint)[0].devHoldings >
                          20 &&
                        coinDevHoldings.get(item.coinMint)[0].devHoldings < 40
                          ? "text-orange-300"
                          : ""
                      }   
                      ${
                        coinDevHoldings.has(item.coinMint) &&
                        coinDevHoldings.get(item.coinMint)[0].devHoldings < 20
                          ? "text-green-300"
                          : ""
                      }
                      `}
                      >
                        {coinDevHoldings.has(item.coinMint) ? (
                          `${
                            coinDevHoldings.get(item.coinMint)[0].devHoldings
                          }%`
                        ) : (
                          <div className="w-4 h-4">
                            <Spinner />
                          </div>
                        )}
                        <FaDev className="w-5 h-5  md:w-4 md:h-6" />
                      </div>
                    </div>

                    <div className="w-1/2 h-full flex flex-col justify-center items-center md:flex-row ">
                      <div
                        className={`flex justify-center items-center w-full h-1/2 gap-[.4rem]  
                       ${
                         coinDevHoldings.has(item.coinMint) &&
                         !Number.isNaN(
                           coinDevHoldings.get(item.coinMint)[0]
                             .bundlePercentHeld
                         ) &&
                         coinDevHoldings.get(item.coinMint)[0]
                           .bundlePercentHeld > 50
                           ? "text-red-400"
                           : ""
                       }

${
  coinDevHoldings.has(item.coinMint) &&
  !Number.isNaN(coinDevHoldings.get(item.coinMint)[0].bundlePercentHeld) &&
  coinDevHoldings.get(item.coinMint)[0].bundlePercentHeld > 20 &&
  coinDevHoldings.get(item.coinMint)[0].bundlePercentHeld < 50
    ? "text-orange-300"
    : ""
}
${
  coinDevHoldings.has(item.coinMint) &&
  !Number.isNaN(coinDevHoldings.get(item.coinMint)[0].bundlePercentHeld) &&
  coinDevHoldings.get(item.coinMint)[0].bundlePercentHeld < 20
    ? "text-green-300"
    : ""
}

                      
                      
                      `}
                      >
                        {" "}
                        {coinDevHoldings.has(item.coinMint) &&
                        !Number.isNaN(
                          coinDevHoldings.get(item.coinMint)[0]
                            .bundlePercentHeld
                        ) ? (
                          `${
                            !Number.isNaN(
                              Math.round(
                                coinDevHoldings.get(item.coinMint)[0]
                                  ?.bundlePercentHeld
                              )
                            )
                              ? Math.round(
                                  coinDevHoldings.get(item.coinMint)[0]
                                    .bundlePercentHeld
                                )
                              : "X"
                          }%`
                        ) : (
                          <div className="w-4 h-4">
                            <Spinner />
                          </div>
                        )}
                        <div className="md:w-[1.2rem] md:h-[1.2srem] items-center  ">
                          <GrBundle className=" w-full h-full   " />
                        </div>
                      </div>

                      <div
                        className={` flex items-center justify-center w-full  h-1/2  gap-[.4rem] 
                      ${
                        coinDevHoldings.has(item.coinMint) &&
                        coinDevHoldings.get(item.coinMint)[0]
                          .topTenPercentHeld > 50
                          ? "text-red-400"
                          : ""
                      }
                      ${
                        coinDevHoldings.has(item.coinMint) &&
                        coinDevHoldings.get(item.coinMint)[0]
                          .topTenPercentHeld > 20 &&
                        coinDevHoldings.get(item.coinMint)[0]
                          .topTenPercentHeld < 50
                          ? "text-orange-300"
                          : ""
                      }
                       ${
                         coinDevHoldings.has(item.coinMint) &&
                         coinDevHoldings.get(item.coinMint)[0]
                           .topTenPercentHeld < 20
                           ? "text-green-300"
                           : ""
                       }
                      `}
                      >
                        {" "}
                        {coinDevHoldings.has(item.coinMint) ? (
                          coinDevHoldings.get(item.coinMint)[0]
                            .topTenPercentHeld == 0 ? (
                            "0"
                          ) : (
                            `${Math.round(
                              coinDevHoldings.get(item.coinMint)[0]
                                ?.topTenPercentHeld
                            )}%`
                          )
                        ) : (
                          <div className="w-4 h-4">
                            <Spinner />
                          </div>
                        )}
                        <div
                          className={`  md:w-[1.1rem] md:h-[1.3srem] bg-white border-[1px]  rounded-[.15rem] items-center  ${
                            coinDevHoldings.has(item.coinMint) &&
                            coinDevHoldings.get(item.coinMint)[0]
                              .topTenPercentHeld > 50
                              ? "border-red-400 bg-red-400 "
                              : ""
                          } 
                         ${
                           coinDevHoldings.has(item.coinMint) &&
                           coinDevHoldings.get(item.coinMint)[0]
                             .topTenPercentHeld > 20 &&
                           coinDevHoldings.get(item.coinMint)[0]
                             .topTenPercentHeld < 50
                             ? "bg-orange-300 border-orange-300"
                             : ""
                         }
                          ${
                            coinDevHoldings.has(item.coinMint) &&
                            coinDevHoldings.get(item.coinMint)[0]
                              .topTenPercentHeld < 20
                              ? "text-green-300 bg-green-300"
                              : ""
                          }
                        `}
                        >
                          <TbNumber10
                            className={` w-full h-full text-neutral-500 p-[1px]      `}
                          />{" "}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" hidden overflow-hidden h-full i text-white text-ellipsis pr-4 justify-center text-sm w-[22rem] max-w-[22rem]  md:flex md:items-center ">
                    <CopyToClipboardButton
                      textToCopy={item.coinMint ?? "No Data"}
                    />
                    <p className="w-[90%] text-start text-ellipsis text-[11.5px] ">
                      {item.coinMint}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </BlurFade>
    </main>
  );
}
