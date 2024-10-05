const axios = require('axios');

// Function to get ETH and SOL prices
export async function getPricesOfEthAndSolInUSD() {

    let ethPriceInUSD = 0;
    let solPriceInUSD = 0;
  try {
    const url = 'https://api.coingecko.com/api/v3/simple/price';
    const response = await axios.get(url, {
      params: {
        ids: 'ethereum,solana', // Specify the cryptocurrencies
        vs_currencies: 'usd',   // Get the prices in USD
      },
    });

    const prices = response.data;
    
    console.log(`Ethereum (ETH): $${prices.ethereum.usd}`);
    console.log(`Solana (SOL): $${prices.solana.usd}`);
    ethPriceInUSD = prices.ethereum.usd
    solPriceInUSD = prices.solana.usd
  } catch (error) {
    console.error('Error fetching prices:', error);
  }
  finally{
    return {
        "ethPriceInUSD": ethPriceInUSD,
        "solPriceInUSD": solPriceInUSD
    }
  }
}



// getPricesOfEthAndSolInUSD();
