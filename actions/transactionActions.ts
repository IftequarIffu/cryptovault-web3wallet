'use server'
import { MAINNET_ETHERSCAN_API_URL, 
  SEPOLIA_ETHERSCAN_API_URL, 
  SOLANA_DEVNET_EXPLORER_RPC_URL, 
  SOLANA_MAINNET_EXPLORER_RPC_URL,
  ETHEREUM_MAINNET_RPC_URL,
  ETHEREUM_SEPOLIA_RPC_URL,
  SEPOLIA_ETHERSCAN_EXPLORER_URL,
  MAINNET_ETHERSCAN_EXPLORER_URL,
  SOLANA_EXPLORER_URL} from "@/lib/constants";
import { getTopThreeTxsOfAnEthAddress } from "@/lib/ethUtils";
import { getTopThreeTxsOfASolanaAddress } from "@/lib/solanaUtils";
import { NetworkType } from "@/lib/types";

export const getTop3TransactionsFromAllAccounts = async (accountsOfSelectedNetwork: any[], selectedNetwork: NetworkType) => {

    console.log(`Accounts: ${accountsOfSelectedNetwork}, selectedNetwork: ${selectedNetwork}`)
    let txsHeap: any[] = []
    const addTransactionToHeap = (heap: any[], newTx: any) => {

      const isDuplicate = heap.some(tx => tx.txTimestamp === newTx.txTimestamp && tx.sender === newTx.sender);
      if (!isDuplicate) {
        heap.push(newTx);
      }

      if (heap.length > 3) {
        heap.sort((a, b) => a.txTimestamp - b.txTimestamp);
        heap.shift(); // Remove the oldest transaction
      }
    };


    try {
        let txs: any[];
        const transactionPromises = accountsOfSelectedNetwork.map(async (account: any) => {
        if(selectedNetwork == "ETH Sepolia") {
          txs = await getTopThreeTxsOfAnEthAddress(account.address, SEPOLIA_ETHERSCAN_API_URL, SEPOLIA_ETHERSCAN_EXPLORER_URL)
        }
        else if (selectedNetwork == "Ethereum") {
          txs = await getTopThreeTxsOfAnEthAddress(account.address, MAINNET_ETHERSCAN_API_URL, MAINNET_ETHERSCAN_EXPLORER_URL)
        }
        else if (selectedNetwork == "Solana") {
          txs = await getTopThreeTxsOfASolanaAddress(account.address, SOLANA_MAINNET_EXPLORER_RPC_URL, SOLANA_EXPLORER_URL, 'mainnet')
        }
        else if (selectedNetwork == "SOL Devnet") {
          txs = await getTopThreeTxsOfASolanaAddress(account.address, SOLANA_DEVNET_EXPLORER_RPC_URL, SOLANA_EXPLORER_URL, 'devnet')
        }

        txs.forEach((tx: any) => {
          console.log("Adding transaction to heap: ", tx);
          addTransactionToHeap(txsHeap, tx);
        });

      })

      await Promise.all(transactionPromises);

      console.log("Heap after fetching transactions: ", txsHeap);

    } catch (error: any) {
      console.error(`Error occured while getting ${selectedNetwork} transactions`)
      throw new Error(error.message)
    }
    finally {
      return txsHeap;
    }
}