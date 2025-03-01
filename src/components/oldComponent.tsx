"use client";
// @ts-nocheck

import { useEffect, useState } from "react";

import { initializeSocketListeners } from "../lib/socketData";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Chart from "../components/tvChart";
import Spinner from "../components/ui/Spinner";

import "ldrs/grid";
import { grid } from "ldrs";
import type {} from "ldrs";

import BlurFade from "@/components/ui/blur-fade";

import { usePathname } from "next/navigation";

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

grid.register();

export default function OldComponent() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [coinDevHoldings, setCoinDevHoldings] = useState(new Map());
  const [changedCoins, setChangedCoins] = useState<string[]>([]);

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/dashboard") {
      const cleanup = initializeSocketListeners(
        setCoins,
        setChangedCoins,
        setCoinDevHoldings
      );

      return () => {
        cleanup();
      };
    }
  }, [pathname]);

  if (pathname !== "/dashboard") return null;

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
    <>
      {coins.length != 0 && (
        <h1 className="welcome-content-header ">Data Dashboard</h1>
      )}
      <div className=" custom-scroll-container max-h-[50rem] w-full flex justify-center relative  pb-2 backdrop-blur-xl  max-w-[85rem]    scrollbar-thin  scrollbar-thumb-white scrollbar-track-transparent scrollbar-thumb-rounded">
        <ul className="w-full flex flex-col ">
          {coins.length === 0 ? (
            <li className="w-full h-[90vh] flex justify-center items-center">
              <div className=" flex justify-center items-center  w-40 h-40">
                <l-grid size="150" speed="1.5" color="#53A4FC" />
              </div>
            </li>
          ) : (
            <BlurFade direction="up" className="md:overflow-auto">
              <div className=" z-20 bg-bgColor flex w-full min-h-6 pt-3 pb-7 text-white/30 font-extralight sticky top-0">
                <p className="absolute left-1">Name</p>
                <p className="absolute left-[33.75%]">Marketcap</p>
                <p className="absolute left-[18.5%]">Price</p>
                <p className="absolute left-[42.5%]"> Holders</p>
                <p className="absolute left-[50.75%]"> Dev %</p>
                <p className="absolute left-[58%]"> Bundled %</p>
                <p className="absolute left-[66%]">Top 10 %</p>
                <p className="absolute left-[73.75%]">Mint</p>
              </div>
              {coins.map((item, index) => (
                <li
                  key={index}
                  className={`${
                    changedCoins.includes(item.coinMint) ? "highlight" : ""
                  }  relative w-full min-h-[4.9rem] h-[6.5rem]    pr-1 flex items-center justify-around md:justify-start  border-b-[1px] border-black/10   `}
                >
                  <div
                    className=" w-12 
                 h-full flex justify-center items-center "
                  >
                    <Avatar>
                      <AvatarImage src={item.imageUrl} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col h-full w-[20%] pl-4 mr-4  md:text-base md:w-[25%] max-w-[11rem] items-center justify-center text-xs text-white text-ellipsis">
                    <div className="w-full ">
                      <h1 className="font-semibold hidden sm:flex">
                        {item.ticker}
                      </h1>
                      <p className="text-nowrap truncate font-bold text-xs  ">
                        {item.name}
                      </p>
                    </div>
                  </div>

                  <div className="h-full py-3 w-[15%] md:max-w-[20%]">
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

                        {/* <CiUser className="  w-4 h-4  md:w-5 md:h-5  " /> */}
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
                        {/* <FaDev className="w-5 h-5  md:w-4 md:h-6" /> */}
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
                          {/* <GrBundle className=" w-full h-full   " /> */}
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
                          className={`  md:w-[1.1rem] md:h-[1.3srem] bg-white   rounded-[.15rem] items-center  
                           
                        `}
                        >
                          {/* <TbNumber10
                            className={` w-full h-full text-neutral-500 p-[1px]      `}
                          /> */}
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
              ))}
            </BlurFade>
          )}
        </ul>
      </div>
    </>
  );
}
