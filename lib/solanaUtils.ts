const axios = require('axios');
import { LAMPORTS } from "./constants";
import { SOLANA_DEVNET_EXPLORER_RPC_URL, SOLANA_MAINNET_EXPLORER_RPC_URL } from "./constants";



export const convertLamportsToSol = (lamports: number) => {
    return lamports/(10**LAMPORTS);
}


export const solanaTxHashSearch = async(txSignature: string, rpcUrl: string, address: string, explorerUrl: string, networkType: string) => {

    let sender = '';
    let receiver = '';
    let amount = 0;
    let txTimestamp = 0;
    let txType = '';
    let txUrl = '';

    try {
        
        let data = JSON.stringify({
            "method": "getTransaction",
            "jsonrpc": "2.0",
            "params": [
                txSignature,
                {
                "encoding": "jsonParsed",
                "commitment": "confirmed",
                "maxSupportedTransactionVersion": 0
                }
            ],
            "id": "1"
            });
        
            let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: rpcUrl,
            headers: { 
                'Content-Type': 'application/json'
            },
            data : data
            };
        
            const response = await axios.request(config)
            // console.log(`For ${txSignature}, the response data is ${response.data}`)
            const result = response.data.result
            console.log(`For ${txSignature}, the result is ${result}`)
            txUrl = `${explorerUrl}/tx/${txSignature}`
            if(networkType == "devnet") {
                txUrl = txUrl + "?cluster=devnet"
            }
            txTimestamp = result.blockTime
            const instructions = response.data.result.transaction.message.instructions
            instructions.forEach((instruction: any) => {
                if(instruction.parsed != null) {
                    sender = instruction.parsed.info.source
                    receiver = instruction.parsed.info.destination
                    amount = convertLamportsToSol(instruction.parsed.info.lamports)
                    txType = sender == address ? "send" : "receive"
                    
                }
            });
    } catch (error: any) {
        console.error(`Error occured while getting Tx Info for signature: ${txSignature}: `,  error)
        throw new Error(error.message)
    }
    finally {
        return {
            sender: sender,
            receiver: receiver,
            amount: amount,
            txTimestamp: txTimestamp,
            txType: txType,
            currency: "SOL",
            hash: txSignature,
            txUrl: txUrl
        }
    }
}


export const getTopThreeTxsOfASolanaAddress = async(address: string, rpcUrl: string, explorerUrl: string, networkType: string) => {

    let txsList: any[] = []
    try {
        let data = JSON.stringify({
            "method": "getSignaturesForAddress",
            "jsonrpc": "2.0",
            "params": [
                address,
                {
                "limit": 3
                }
            ],
            "id": "25839d8d-2198-4514-9a10-ba7b4c88f089"
            });
        
        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: rpcUrl,
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
        };

        const response = await axios.request(config)
        const result = response.data.result
        // console.log("Response: ", response)
        // console.log("Result: ", result)
        let txInfo;

        for(let item of result) {
            if(txsList.length == 3) {
                break;
            }
            txInfo = await solanaTxHashSearch(item.signature, rpcUrl, address, explorerUrl, networkType)
            txsList.push(txInfo)
        }


        return txsList

    } catch (error: any) {
        console.error(`Error occured while getting Txs for address: ${address}: `,  error)
        throw new Error(error.message)
    }
    finally {
        return txsList
    }
}