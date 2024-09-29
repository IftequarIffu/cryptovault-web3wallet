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
import { ETHEREUM_SEPOLIA_RPC_URL, MAINNET_ETHERSCAN_URL, SEPOLIA_ETHERSCAN_URL, SOLANA_DEVNET_EXPLORER_RPC_URL, SOLANA_MAINNET_EXPLORER_RPC_URL } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { getTop3TransactionsFromAllAccounts } from "@/actions/transactionActions";


export function RecentTransactions() {
  const { transactions, selectedNetwork, accounts } = useWallet();

  const [transactionsToBeShown, setTransactionsToBeShown] = useState<any[]>()

  const accountsOfSelectedNetwork = accounts.filter((account: any) => account.network == selectedNetwork)


  const getTxsFunction = useCallback(async () => {
    console.log("Hellow")
    let txs = await getTop3TransactionsFromAllAccounts(accountsOfSelectedNetwork, selectedNetwork);
    setTransactionsToBeShown(txs)
  }, [accountsOfSelectedNetwork, selectedNetwork])


  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions?.map((tx, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 bg-muted rounded-lg"
            >
              <div className="flex items-center">
                {tx.type === "send" && (
                  <ArrowUpRight className="h-4 w-4 mr-2 text-red-500" />
                )}
                {tx.type === "receive" && (
                  <ArrowDownRight className="h-4 w-4 mr-2 text-green-500" />
                )}
                {tx.type === "swap" && (
                  <Repeat className="h-4 w-4 mr-2 text-blue-500" />
                )}
                <div>
                  <p className="font-semibold">
                    {tx.type === "send"
                      ? "Sent"
                      : tx.type === "receive"
                      ? "Received"
                      : "Swapped"}{" "}
                    {tx.amount}
                  </p>
                  <p className="text-sm text-gray-500">
                    {tx.type === "send"
                      ? `To: ${tx.to}`
                      : tx.type === "receive"
                      ? `From: ${tx.from}`
                      : `To: ${tx.to}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{tx.date}</p>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" /> View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    
  );
}
