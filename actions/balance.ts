'use client'
import { Connection, PublicKey, clusterApiUrl, Keypair } from  '@solana/web3.js'
import axios from 'axios';
import { ethers } from 'ethers';
import { balanceInEth, balanceInSol, getNetworkInfo, hexToDecimal } from '@/lib/utils';
import { NetworkType } from '@/lib/types';



// async function getSolanaBalance(address: string) {
//     const connection = new Connection(clusterApiUrl('mainnet-beta'));

//   // Convert the address string to a PublicKey object
//   const publicKey = new PublicKey(address);

//   // Get the balance of the public key (in lamports, the smallest unit of SOL)
//   const balance = await connection.getBalance(publicKey);

//   // Convert lamports to SOL (1 SOL = 1 billion lamports)
//   const balanceInSol = await balance / 1e9;
// //   console.log(`Balance of ${address} is: ${balanceInSol} SOL`);

//   return balanceInSol

  
// }


async function getSolanaBalance(address: string, rpcUrl: string){

  try {

    let data = JSON.stringify({
      "jsonrpc": "2.0",
      "id": 1,
      "method": "getBalance",
      "params": [
        address
      ]
    });

  let config = {
      method: 'post',
      // maxBodyLength: Infinity,
      url: rpcUrl,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
  const response = await axios.request(config);
  console.log("Solana Response: ", response)
  return response.data.result.value;
    
  } catch (error: any) {
    throw new Error(error.message)
  }

    

}

async function getEthereumBalance(address: string, rpcUrl: string) {


  const axios = require('axios');
let data = JSON.stringify({
  "jsonrpc": "2.0",
  "method": "eth_getBalance",
  "params": [
    address,
    "latest"
  ],
  "id": 1
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

// axios.request(config)
// .then((response) => {
//   console.log(JSON.stringify(response.data));
// })
// .catch((error) => {
//   console.log(error);
// });

    const response = await axios.request(config);
    // console.log("Response: ", response)
    return response.data.result;

}



export async function getBalanceOfAnAddress(address: string, network: NetworkType){

    console.log("I am in getBalanceOfAnAddress")
    const networkInfo = getNetworkInfo(network)
    console.log("I am in getBalanceOfAnAddress: ", networkInfo)

    console.log("Entered getBalanceOfAnAddress", address, network)
    if(network == "Ethereum") {
     
      const hexBalance = await getEthereumBalance(address, networkInfo.networkRpcUrl)
      const balanceInDecimalWei = hexToDecimal(hexBalance)
      return balanceInEth(balanceInDecimalWei)
    }
    else if(network == "Solana"){
        // console.log("")
      const balanceInLamports: number = await getSolanaBalance(address, networkInfo.networkRpcUrl)
      console.log("Solana balance in lamports getBalanceOfAnAddress: ", balanceInLamports)
      return balanceInSol(balanceInLamports)
      // return balance
    }
    else if(network == "ETH Sepolia"){
      const hexBalance = await getEthereumBalance(address, networkInfo.networkRpcUrl)
      const balanceInDecimalWei = hexToDecimal(hexBalance)
      return balanceInEth(balanceInDecimalWei)
    }
    else if(network == "SOL Devnet"){
      // console.log("")
    const balanceInLamports: number = await getSolanaBalance(address, networkInfo.networkRpcUrl)
    console.log("Solana balance in lamports getBalanceOfAnAddress: ", balanceInLamports)
    return balanceInSol(balanceInLamports)
    // return balance
  }
}
