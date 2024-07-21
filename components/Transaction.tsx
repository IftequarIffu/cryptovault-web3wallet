import {
  ArrowUpRight,
  ArrowDownRight,
  Repeat,
  ExternalLink,
} from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { TransactionType } from "@/components/RecentTransactions";

const Transaction = ({ tx, index }: { tx: TransactionType; index: number }) => {
  return (
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
  );
};

export default Transaction;
