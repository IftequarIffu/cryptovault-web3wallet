'use client'
import { Connection, PublicKey, clusterApiUrl, Keypair } from  '@solana/web3.js'
import axios from 'axios';
import { ethers } from 'ethers';
import { balanceInEth, balanceInSol, getNetworkInfo, hexToDecimal } from '@/lib/utils';
import { NetworkType } from '@/lib/types';


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
      url: rpcUrl,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
  const response = await axios.request(config);
  // console.log("Response from getSolanaBalance: ", response)
  // console.log("Solana Response: ", response)
  return response.data.result.value;
    
  } catch (error: any) {
    // console.log("Error in getSolanaBalance: ", error)
    // throw new Error(error.message)
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

    const response = await axios.request(config);
    return response.data.result;

}



export async function getBalanceOfAnAddress(address: string, network: NetworkType){

    // console.log("I am in getBalanceOfAnAddress")
    const networkInfo = getNetworkInfo(network)
    // console.log("I am in getBalanceOfAnAddress: ", networkInfo)

    // console.log("Entered getBalanceOfAnAddress", address, network)
    if(network == "Ethereum") {
     
      const hexBalance = await getEthereumBalance(address, networkInfo.networkRpcUrl)
      const balanceInDecimalWei = hexToDecimal(hexBalance)
      return balanceInEth(balanceInDecimalWei)
    }
    else if(network == "Solana"){
      const balanceInLamports: number = await getSolanaBalance(address, networkInfo.networkRpcUrl)
      // console.log("Solana balance in lamports getBalanceOfAnAddress: ", balanceInLamports)
      return balanceInSol(balanceInLamports)
    }
    else if(network == "ETH Sepolia"){
      const hexBalance = await getEthereumBalance(address, networkInfo.networkRpcUrl)
      const balanceInDecimalWei = hexToDecimal(hexBalance)
      return balanceInEth(balanceInDecimalWei)
    }
    else if(network == "SOL Devnet"){
    const balanceInLamports: number = await getSolanaBalance(address, networkInfo.networkRpcUrl)
    // console.log("Solana balance in lamports getBalanceOfAnAddress: ", balanceInLamports)
    return balanceInSol(balanceInLamports)
  }
}

export async function getSumOfBalancesOfAccounts(accounts: any[], network: NetworkType) {

  let totalBalanceSum = 0;

  for(let account of accounts) {
    const balance = await getBalanceOfAnAddress(account.address, network);
    // console.log("Balance in Accounts.ForEach: ", balance)
    if(balance){
      totalBalanceSum += balance
    }
  }
  // console.log("Total Balance Sum in getSumOfBalancesOfAccounts: ", totalBalanceSum)
  return totalBalanceSum;
}