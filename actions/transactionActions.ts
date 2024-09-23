'use server'
import { MAINNET_ETHERSCAN_URL, SEPOLIA_ETHERSCAN_URL, SOLANA_DEVNET_EXPLORER_RPC_URL, SOLANA_MAINNET_EXPLORER_RPC_URL } from "@/lib/constants";
import { getTopThreeTxsOfAnEthAddress } from "@/lib/ethUtils";
import { getTopThreeTxsOfASolanaAddress } from "@/lib/solanaUtils";
import { NetworkType } from "@/lib/types";

export const getTop3TransactionsFromAllAccounts = async (accountsOfSelectedNetwork: any[], selectedNetwork: NetworkType) => {

    console.log(`Accounts: ${accountsOfSelectedNetwork}, selectedNetwork: ${selectedNetwork}`)
    let txsHeap: any[] = []
    const addTransactionToHeap = (heap: any[], newTx: any) => {
      heap.push(newTx);
      // If the heap exceeds 3 transactions, remove the one with the smallest timestamp
      if (heap.length > 3) {
        heap.sort((a, b) => a.txTimestamp - b.txTimestamp);
        heap.shift(); // Remove the oldest transaction
      }
    };

    let allTransactions: any[] = [];

    try {
        const transactionPromises = accountsOfSelectedNetwork.map(async (account: any) => {
        if(selectedNetwork == "ETH Sepolia") {
          let txs = await getTopThreeTxsOfAnEthAddress(account.address, SEPOLIA_ETHERSCAN_URL)
          txs.map((tx: any) => {
            allTransactions.push(tx)

          })
        }
        else if (selectedNetwork == "Ethereum") {
          let txs = await getTopThreeTxsOfAnEthAddress(account.address, MAINNET_ETHERSCAN_URL)
          txs.map((tx: any) => {
            allTransactions.push(tx)
          })
        }
        else if (selectedNetwork == "Solana") {
          let txs = await getTopThreeTxsOfASolanaAddress(account.address, SOLANA_MAINNET_EXPLORER_RPC_URL)
          txs.map((tx: any) => {
            allTransactions.push(tx)
          })
        }
        else if (selectedNetwork == "SOL Devnet") {
          let txs = await getTopThreeTxsOfASolanaAddress(account.address, SOLANA_DEVNET_EXPLORER_RPC_URL)
          console.log(`SOL Devnet Txs: ${txs}`)
          txs.map((tx: any) => {
            allTransactions.push(tx)
          })
        }
      })

      const allTransactionsArrays = await Promise.all(transactionPromises);

    } catch (error: any) {
      console.error(`Error occured while getting ${selectedNetwork} transactions`)
      throw new Error(error.message)
    }
    finally {
      return txsHeap;
    }
}