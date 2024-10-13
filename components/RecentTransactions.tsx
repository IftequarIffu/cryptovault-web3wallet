"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ArrowDownRight,
  Repeat,
  ExternalLink,
} from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { NetworkType } from "@/lib/types";
import { getTopThreeTxsOfASolanaAddress } from "@/lib/solanaUtils";
import { getTopThreeTxsOfAnEthAddress } from "@/lib/ethUtils";
import { ETHEREUM_SEPOLIA_RPC_URL, SOLANA_DEVNET_EXPLORER_RPC_URL, SOLANA_MAINNET_EXPLORER_RPC_URL } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { getTop3TransactionsFromAllAccounts } from "@/actions/transactionActions";
import { supportedNetworks } from "@/lib/constants";
import { convertTimestampToDate } from "@/lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";
import Link from "next/link";


export function RecentTransactions() {
  const { transactions, selectedNetwork, accounts } = useWallet();

  const getNetworkInfo = (network: NetworkType) =>
    supportedNetworks[network as NetworkType];

  const selectedNetworkAccounts = accounts.filter((account) => account.network == selectedNetwork)
  console.log("SelectedNetworkAccounts in RecentTxs: ", selectedNetworkAccounts)

  const [transactionsToBeShown, setTransactionsToBeShown] = useState<any[]>()
  const [loading, setLoading] = useState(false)

  const accountsOfSelectedNetwork = accounts.filter((account: any) => account.network == selectedNetwork)


  const getTxsFunction = async () => {
    console.log("Hellow")
    let txs = await getTop3TransactionsFromAllAccounts(accountsOfSelectedNetwork, selectedNetwork);
    console.log("Txs in RecentTxs: ", txs)
    setTransactionsToBeShown(txs)
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    console.log("In RecentTxs useEffect")
    getTxsFunction()
  }, [selectedNetwork])

  console.log("Txs to be shown: ", transactionsToBeShown)


  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-60">

          {
          transactionsToBeShown?.length == 0 ? <div className="font-semibold text-center flex justify-center items-center h-full"><p>No Transactions found</p></div> : 
          
          loading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner />
              </div>
              ) :

          transactionsToBeShown?.map((tx, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 bg-muted rounded-lg"
            >
              <div className="flex items-center">
                {tx.txType === "send" && (
                  <ArrowUpRight className="h-4 w-4 mr-2 text-red-500" />
                )}
                {tx.txType === "receive" && (
                  <ArrowDownRight className="h-4 w-4 mr-2 text-green-500" />
                )}
                {tx.txType === "swap" && (
                  <Repeat className="h-4 w-4 mr-2 text-blue-500" />
                )}
                <div>
                  <p className="font-semibold">
                    {tx.txType === "send"
                      ? "Sent"
                      : tx.txType === "receive"
                      ? "Received"
                      : "Swapped"}{" "}
                    {`${tx.amount} ${tx.currency}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {tx.txType === "send"
                      ? `To: ${tx.receiver.slice(0,25)}...`
                      : tx.txType === "receive"
                      ? `From: ${tx.sender.slice(0,25)}...`
                      : `To: ${tx.receiver.slice(0,25)}...`}
                  </p>
                  {/* <p>{tx.txUrl}</p> */}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{convertTimestampToDate(tx.txTimestamp)}</p>
                
                <Link href={tx.txUrl}>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" /> View 
                </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    
  );
}
