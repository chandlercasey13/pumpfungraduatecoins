import { socket } from "../socket"; 
import { Coin } from "../app/page"; 


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

export function initializeSocketListeners(
  setCoins: React.Dispatch<React.SetStateAction<Coin[]>>,
  setChangedCoins: React.Dispatch<React.SetStateAction<string[]>>,
  setCoinDevHoldings: React.Dispatch<React.SetStateAction<CoinDevHoldingsMap>>
) {

  const detectChanges = (prevCoins: Coin[], newMintList: Coin[]) => {
    const addedOrUpdated = newMintList.filter(
      (newCoin) =>
        !prevCoins.some(
          (prevCoin) =>
            prevCoin.coinMint === newCoin.coinMint &&
            prevCoin.marketCap === newCoin.marketCap
        )
    );

    return addedOrUpdated.map((coin) => coin.coinMint);
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
  
      return newMap;
    });
  };
  

  socket.on("data", handleData);
  socket.on("holdings", handleHoldings);

 
  return () => {
    socket.off("data", handleData);
    socket.off("holdings", handleHoldings);
    socket.disconnect();
  };
}
