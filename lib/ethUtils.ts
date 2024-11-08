import { Currency } from "lucide-react";
import { ETH_DECIMAL_PLACES, ETHERSCAN_API_KEY } from "./constants";

export const convertWeiToEth = (wei: number) => {
    return wei/(10**ETH_DECIMAL_PLACES);
}


export const getTopThreeTxsOfAnEthAddress = async(address: string, etherscanApiUrl: string, etherscanExplorerUrl: string, apiKey: string = ETHERSCAN_API_KEY) => {
    
    console.log(`API Key: ${apiKey}`)
    let txsList: any[] = []
    try {
        const axios = require('axios');

    let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${etherscanApiUrl}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${apiKey}`,
    headers: { }
    };

    const response = await axios.request(config)
    console.log("response: ", response)
    const result = response.data.result
    console.log("result: ", result)


    for(let item of result) {
        if(txsList.length == 3){
            break;
        }
        txsList.push({
            sender: item.from,
            receiver: item.to,
            hash: item.hash,
            amount: convertWeiToEth(parseInt(item.value)),
            txTimestamp: parseInt(item.timeStamp),
            txType: address == item.from ? "send" : "receive",
            currency: etherscanExplorerUrl.includes('sepolia') ? 'SepoliaETH' : 'ETH',
            txUrl: `${etherscanExplorerUrl}/tx/${item.hash}`
        })
    }

    } catch (error: any) {
        console.error(`Error occured while getting Txs for address: ${address}: `,  error)
        throw new Error(error.message)
    }

    finally{
        return txsList
    }
}