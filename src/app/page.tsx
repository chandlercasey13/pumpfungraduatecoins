"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Spinner from "../components/Spinner"
import { GrBundle } from "react-icons/gr";
import { TbNumber10 } from "react-icons/tb";

interface Coin {
  chainId: number;
  tokenAddress: string;
  [key: string]: any;
}

export default function Home() {
  
  const [coins, setCoins] = useState<Coin[]>([]);
  const [coinDevHoldings, setCoinDevHoldings] = useState(new Map());

  useEffect(() => {
   


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
        newMap.set(holdings.coinMint, [{"devHoldings" : holdings.devHoldings},{"bundlePercentHeld": holdings.bundleSupply},{"topTenPercentHeld" : holdings.tenHolderSupply}]);
        return newMap;
      });
     console.log(holdings)
    });

    return () => {
     
      socket.off("data");
      socket.off("holdings");
      socket.disconnect();
    };
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
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAdNJREFUeF7tm8FtwzAMAMlNmknabNJMUmSSZpNmk2YTxixkoA/HokrLjY3TK4AlmTqdKD9CFdosAYXPPAEAVQwBEIBySQSD/ssgM3sRkQ8Rec/t4ezom4hcReSsqv578dbNIDP7GoJ/Wzzi6Qlvqnro8a4ugIo93z0CnpnzqKpu06KtGZCZ+bFxM9ayY4kFj0fRTTu3TBgGVKz43BiYKRYOy20L5awWQGvmlJZN/kvfq6oeIwNDgMzMbyK3Z0/tpKqX2oKigBxOz+u6FmeP5yGLooD8RvLvmj210KdBFJBNkRluhMnxw0032b833dZ4HvX/HSeAKrsGIACJPDryHLFiB4AKiM0k6d63Vev8T2dQ6wJ69wdQhTCAAJQ7hBiEQRiUI4BBOX7kIAzCoBwBDMrxIwdhEAblCGBQjh85CIMwKEcAg3L8yEEYhEE5AhiU40cOwiAMyhHAoBw/chAGYVCOAAbl+JGDMAiDcgQwKMePHIRBz2/QHqt9ZMl/2u+p2nDU8aKqp5qb0WIWKg5rJFeug6+Fk30eqjb0l4QM8o47qnoOw2kCNG5ZKfB9LeXhWynT9BLwn9r5bnXzWae3Oj58xLa6wGzcAKoQBBCAcocMgyr87gXh0VgK834bAAAAAElFTkSuQmCC"/>
      </button>
    );
  };

  return (
    <main className="min-h-screen w-screen flex flex-col justify-center items-center bg-black/85">
      <h1 className="font-bold text-2xl pb-6 pt-4 md:text-5xl md:pb-10 text-white">
        Pump.Fun about to Graduate
      </h1>
      <div className="h-full w-full relative  bg-white/20 backdrop-blur-sm md:h-[50rem] md:w-[70rem] border-[1px] border-color-white rounded-md overflow-y-hidden scrollbar-thin  scrollbar-thumb-white scrollbar-track-transparent scrollbar-thumb-rounded">
        <ul className="h-full flex flex-col ">
          {coins.length === 0 ? (
            <li className="text-white w-full h-full flex justify-center items-center"><div className="w-40 h-40"><Spinner/></div></li>
          ) : (
            coins.map((item, index) => (
              <li
                key={index}
                className=" relative w-full min-h-[5rem]  flex items-center justify-start border-b-[1px]   "
              >
                <div className=" w-16 h-full flex justify-center items-center md:pl-4 md:w-20 ">
                  <Avatar>
                    <AvatarImage src={item.imageUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col h-full w-[20%] max-w-26 items-center justify-center text-white text-ellipsis">
                  <div className="w-full ">
                    <h1 className="font-semibold">{item.ticker}</h1>
                    <p className="text-nowrap truncate font-extralight text-xs  ">
                      {item.name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col w-[10%]  h-full items-center justify-center text-white ">
                  <h1>{Math.round(item.marketCap).toLocaleString()}</h1>
                  <p>{Math.round(item.bondingCurveProgress)}%</p>
                </div>
                <div className="flex flex-row h-full w-[30%]  items-center justify-center gap-2 text-white text-ellipsis  ">
                 <div className="flex justify-end w-[17%] gap-[.4rem]">
                  <p>{item.numHolders}</p>
                  <img className="w-5 h-5 " src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAA7VJREFUeF7tmoFt3DAMRcVNmk2aSZpM0mSSpJMkmaS3CXs/sABDtShSFHUHQwYOl+BkWXr6JCWalNYlEqDFRyawADUUsgAtQD4nshR0zwpi5h8ppV8ppZ8pJfyNz2UbM77x+UNEnz4d9N99EwUx8+/rkF8MwwaodyJ6NdwzpOlUQMwMpXw4Rj4d1DRAHaqROL7MUtMUQMwM1UA9Iy+Y3PPIDo/6Cgc0WDnlHMKVFApI6XO+/coWrS5bZAMIKC5HOEkoz0SE+0OuaEB/t9B9NHiAweTEEL4Bg4liC3DYDxE9hNBJKYUBYuanlNJbZeCfRPSondQGCX3V/FiYiiIB1dRz6VnxhpK6+tQsUAighnoeW2ZVG3jDp3X3K4GKAgRzgImVl8m0jgYubBlCIloUoNq+x+0rBHW64U/bBzFzzf88EFE+jGpcwH9tNl+E/ssrxA9FKYgPV4PI/bwFSKGr6+48bAHKx7tXtOJIaybmjjRnUdBy0pIlCAdUd6QRwnzI6T7KxKTEWLeZnWmjiINl7YCJMA9I5nAv5ZWuCbSQxQ7pFObXOG6YIJ31sCqpCAxHpTtSlHowyDAFKVSU/TxA4W0FdsLfuaHidVArVdvt0xRbrlhA22Str3g0485tQg6o+wGEKig/KCgv7d4yaFZiCqAAJYUrJ8ObBmjnk2Bytfxya1FVjr3VieX3qYAKB4yEmhbU9DeqN1HQfuV2r3ek4gVEta/eFK1FKbW20xU0YtAz+1iAGrQXoFsD2u2Kc4FU/rZaSllYhf/D/VOIgnZQLEVSVmD7owqc+WtPhqD10KGAJoMp5wZFDQc1DFDQcaK1wEe/D90zuQEpcjU9kxxxjynnFLIPUpSmjJiopw83pG4FCa9fqrJH1NnyPj3p1nwsyVFQU1yFsbjObx5AUnFUhhR66jYEhW4ldQFSFGVOydXs8k25IF3aVnSNyQxIEa1CVSM5JMXYzO/OTIAUfic0P6zx1iPfpuB5VkC1wij0dTPllOAaSjKpSA2ooZ4u+9YoorcNM9cW0xTVLIAk9bgLo3pB1O5rLKhaRRZAtbCufthoCK3+JBVpK20tgA6Llq4V8nenniL8H5XroYkqoKgACZHhbtWzg1SrVVIFFS2gmv9xV622zMT7u7dWSQuotgoqmXon6blfqClSRV4toLCyXs/kNfd6axq1gKZVlWombWmzACloecqGT68g8FuAGioKB6RQ8WmbqEzstLNXTGwBakBagBYghR0JTZaCloKWgnwEloJ8/P4BP9/aWMUHMawAAAAASUVORK5CYII="/>
                  </div>
                  <div className="flex items-center justify-end gap-[.4rem] w-[30%]  ">
                 
                    {coinDevHoldings.has(item.coinMint)
                      ? `${(
                          (coinDevHoldings.get(item.coinMint)[0].devHoldings / 1e9) *
                          100
                        ).toFixed(2)}%`
                      : <div className="w-4 h-4"><Spinner/></div>}
                      <img className="w-6 h-6" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAy5JREFUeF7tm2FSAyEMhclJ1JvoSdSTqCfRm9ib6E2i6UAHUiCprNtl5+0vx9Jd8vES4LGlgKtLgMCnTwCADIUAEACNFREoCAqCgsYIQEFj/C6qQcx8G0J4CSHchxDk75muQ+zsMxF9ezvuBsTMAuXTe+ONtxNIH54+ugBF5Xx5bjhRmzuPkryAJK1eJwre09UPInq2GnoBSWpJiu3pOhDRgxWQFxBbN5rxcyIy4zcbSODMDEA9BQCQkR8ABEBNAqhBS+zFkGJIMaRYjQDWQVZ9wUKxTwgK2oiCqrZB9I+ki48hhKdKX8XA6ppXyoMqntOZWb+J6C49r+djraUg01dhZgEklklyIYsgWgOtgnsgouQKyv5Q/Kmaq/n6G/hbBqhp1WwGUNzw5h11WQ0KkA78vaFMDbJp1VwFUJZaopLC+81GvQAUFXZTUZIoJKVn7TsCqbjyoC0n9FqAcmukNeo6WK8hp+uQTjNdfwTuGcREdAuApC+noKJSpMN/BVSY7ZU65K4/0rE9Aip8ZGbWdUjXn67Rt0dAWnn5UZROL6lf3ZOYmQDp6VqU0TokaNUhDc88iZkGkJ6JmLlXtHUdSm29y4DT4/YKSNehpJSL6s9sRVpSLE8zSbHm2b9a60gqvqvthVl/ZgPkXQel9NB1SACdTkl/92lm/dk7IF2HbvNVu1HDtlWDVDqkkf3rQjEF193LeT30LRTp1sp2FFCxQs9nQWv/lbe9FqB8c6k3q2llW1vw1YqybGBbb5UUs5bH3uhtbFuWyxLnYqYftJDdoWMo1JkBavlEZwyuoqDaSDRcPROs4602PZu5Zq/Vd/MNeaa1jViutW3D0XKN0231nUEHIPmeuIdyr+N6qJUqtf+vpaBL+rSptgBkDAcAAdBYxkJBUBAUNEYAChrjhxoEBUFBYwSgoDF+S9Ygt4Uw1uVVv+16BcfrB7VeNVk1ooUfVvWTzkw1z0OjjSknD7P9DLMXnulHHa0YDyBpE49SxE7dA6SqXVv1jLyAIiSBkw71ZgMl5poYa2+en2ImLm4FXQJyT20ByFor7Wm0/yMWKAgKGtMVFAQFQUFjBKCgMX4/Yd6TZ9aSIGoAAAAASUVORK5CYII="/>
                  </div>
                  <div className="flex justify-end items-center w-[25%] gap-[.4rem]"> {coinDevHoldings.has(item.coinMint) && !Number.isNaN(coinDevHoldings.get(item.coinMint)[1].bundlePercentHeld) ?
                      
                      `${(
                        !Number.isNaN( Math.round((coinDevHoldings.get(item.coinMint)[1].bundlePercentHeld))) ? Math.round((coinDevHoldings.get(item.coinMint)[1].bundlePercentHeld)): 
                      '0' )
                    }%`
                      
                     
                      : <div className="w-4 h-4"><Spinner/></div>

                      
                      } 
                       <div className="w-[1.2rem] h-[1.2srem] items-center  "><GrBundle className=" w-full h-full  " />
                       </div>
                      </div>
     
                  <div className=" flex items-center justify-end w-[25%] h-full gap-[.4rem]"> {coinDevHoldings.has(item.coinMint)
                      ?
                      (coinDevHoldings.get(item.coinMint)[2].topTenPercentHeld) == 0 ? '0'  : `${(
                        Math.round((coinDevHoldings.get(item.coinMint)[2].topTenPercentHeld))  )
                    }%`
                      
                     
                      : <div className="w-4 h-4"><Spinner/></div>}
                      
                      <div className="w-[1.1rem] h-[1.3srem] bg-white border-[1px] rounded-[.15rem] items-center"><TbNumber10 className=" w-full h-full text-gray-500 p-[1px] "/> </div>
                      
                      </div>
                     
                </div>
                <div className=" hidden overflow-hidden h-full i text-white text-ellipsis pr-4 justify-end text-sm w-[22rem] max-w-[22rem]  md:flex md:items-center ">
                <CopyToClipboardButton textToCopy={item.coinMint} />
                  <p className="w-[90%] text-start text-ellipsis text-[11.5px] ">
                    
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
