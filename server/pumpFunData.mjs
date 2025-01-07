let coinCache = new Map();
const inProgress = new Set();

export const sendCachedCoins = (socket) => {
  if (coinCache.size > 0) {
    for (const coinMint of coinCache.keys()) {
      const cachedCoin = coinCache.get(coinMint);
      if (
        cachedCoin.ownerHoldings ||
        cachedCoin.bundleSupply ||
        cachedCoin.tenHolderSupply
      ) {
        socket.emit("holdings", {
          coinMint: cachedCoin.coinMint,
          devHoldings: cachedCoin.ownerHoldings,
          bundleSupply: cachedCoin.bundleSupply,
          tenHolderSupply: cachedCoin.tenHolderSupply,
        });
      }
    }
  }
};

export const aboutToGraduateCoins = async (socket, solSocket) => {
  const url = "https://advanced-api.pump.fun/coins/about-to-graduate";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    socket.emit("data", data);

    await cacheCoins(data, socket, solSocket);
  } catch (error) {
    console.error("Error fetching coins:", error);
  }
};

const findOwnerHoldings = async (coinDev, coinMint) => {
  const url = `https://frontend-api-v2.pump.fun/balances/${coinDev}?limit=50&offset=0&minBalance=-1`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      const matchingItem = data.find((item) => item.mint === coinMint);
      if (matchingItem) {
       let roundedHoldings = Math.round(matchingItem.balance / 1e6)
       
        return (Math.round((roundedHoldings/1e9)*100))
      }
    } else {
      console.error("Response data is not an array:", data);
    }
  } catch (err) {
    console.error("Error in findOwnerHoldings:", err);
  }
};

const findBundleHoldings = async (coinMint) => {
  const url = `https://trench.bot/api/bundle_advanced/${coinMint}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.total_percentage_bundled) {
      return data.total_percentage_bundled;
    }
  } catch (err) {
    console.error("Error in findOwnerHoldings:", err);
  }
};

const topTenHoldersSupply = async (coinMint) => {
  const url = `https://advanced-api.pump.fun/coins/list?sortBy=marketCap`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    for (const coin of data) {
      if (coin.coinMint == coinMint) {
        let totalOwnedPercentage = 0;
        for (const holder of coin.holders.slice(0, 10)) {
          totalOwnedPercentage += holder.ownedPercentage;
        }

        return totalOwnedPercentage;
      } else {
      }
    }
  } catch (err) {
    console.error("Error in findOwnerHoldings:", err);
  }
};

const cacheCoins = async (data, socket) => {
  if (!Array.isArray(data)) {
    console.error("cacheCoins: Input data must be an array.");
    return;
  }

  for (const coin of data) {
    if (
      coin &&
      coin.coinMint &&
      !coinCache.has(coin.coinMint) &&
      !inProgress.has(coin.coinMint)
    ) {
      inProgress.add(coin.coinMint);

      (async () => {
        try {
          const bundleSupply = await findBundleHoldings(coin.coinMint);
          const ownerHoldings = await findOwnerHoldings(
            coin.dev,
            coin.coinMint
          );
          const tenHolderSupply = await topTenHoldersSupply(coin.coinMint);

          coin.bundleSupply = bundleSupply;
          coin.ownerHoldings = ownerHoldings;
          coin.tenHolderSupply = tenHolderSupply;

          coinCache.set(coin.coinMint, coin);

          socket.emit("holdings", {
            coinMint: coin.coinMint,
            devHoldings: ownerHoldings,
            bundleSupply: bundleSupply,
            tenHolderSupply: tenHolderSupply,
          });
        } catch (error) {
          console.error(`Error processing coin ${coin.coinMint}:`, error);
        } finally {
          inProgress.delete(coin.coinMint);
        }
      })();
    } else if (coin && coin.coinMint && coinCache.has(coin.coinMint)) {
      const cachedCoin = coinCache.get(coin.coinMint);

      if (
        cachedCoin.ownerHoldings ||
        cachedCoin.bundleSupply ||
        cachedCoin.tenHolderSupply
      ) {
        socket.emit("holdings", {
          coinMint: cachedCoin.coinMint,
          devHoldings: cachedCoin.ownerHoldings,
          bundleSupply: cachedCoin.bundleSupply,
          tenHolderSupply: cachedCoin.tenHolderSupply,
        });
      }
    }
  }
};
