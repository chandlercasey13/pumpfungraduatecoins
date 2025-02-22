import { io } from "socket.io-client";
import { Coin } from "../components/oldComponent";

interface Holdings {
  coinMint: string;
  devHoldings: number;
  bundleSupply?: number;
  tenHolderSupply: number;
}

interface CoinHoldings {
  devHoldings: number;
  bundlePercentHeld?: number;
  topTenPercentHeld: number;
}

type CoinDevHoldingsMap = Map<string, CoinHoldings[]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let socket: any = null; 

export function initializeSocketListeners(
  setCoins: React.Dispatch<React.SetStateAction<Coin[]>>,
  setChangedCoins: React.Dispatch<React.SetStateAction<string[]>>,
  setCoinDevHoldings: React.Dispatch<React.SetStateAction<CoinDevHoldingsMap>>
) {
  if (socket) {
    socket.disconnect();
  }

  socket = io("http://localhost:3000");

  socket.on("connect", () => {});

  socket.on("data", (newMintList: Coin[]) => {
    handleData(newMintList);
  });

  socket.on("holdings", (holdings: Holdings) => {
    handleHoldings(holdings);
  });

  const detectChanges = (prevCoins: Coin[], newMintList: Coin[]) => {
    return newMintList
      .filter(
        (newCoin) =>
          !prevCoins.some(
            (prevCoin) =>
              prevCoin.coinMint === newCoin.coinMint &&
              prevCoin.marketCap === newCoin.marketCap
          )
      )
      .map((coin) => coin.coinMint);
  };

  const handleData = (newMintList: Coin[]) => {
    setCoins((prevCoins) => {
      const isOrderDifferent =
        prevCoins.length !== newMintList.length ||
        !prevCoins.every(
          (coin, i) =>
            coin.coinMint === newMintList[i].coinMint &&
            coin.marketCap === newMintList[i].marketCap
        );

      if (isOrderDifferent) {
        const changes = detectChanges(prevCoins, newMintList);
        setChangedCoins(changes);
        return newMintList;
      }

      return prevCoins;
    });
  };

  const handleHoldings = (holdings: Holdings) => {
    setCoinDevHoldings((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.set(holdings.coinMint, [
        {
          devHoldings: holdings.devHoldings,
          bundlePercentHeld: holdings.bundleSupply,
          topTenPercentHeld: holdings.tenHolderSupply,
        },
      ]);
      console.log("Updated Coin Holdings:", newMap);
      return newMap;
    });
  };

  return () => {
    socket.off("data", handleData);
    socket.off("holdings", handleHoldings);
    socket.disconnect();
  };
}
