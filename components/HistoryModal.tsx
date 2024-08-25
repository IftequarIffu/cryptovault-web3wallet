import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useState } from "react";

interface Transaction {
  id: string;
  type: "send" | "receive";
  amount: string;
  token: string;
  date: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export function HistoryModal() {
  const [isOpen, setIsOpen] = useState(true);

  const mockTransactions = [
    {
      id: "1",
      type: "send" as const,
      amount: "0.1",
      token: "ETH",
      date: "2023-06-01",
    },
    {
      id: "2",
      type: "receive" as const,
      amount: "100",
      token: "USDC",
      date: "2023-05-28",
    },
    {
      id: "3",
      type: "send" as const,
      amount: "50",
      token: "LINK",
      date: "2023-05-25",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className=" text-white">
        <DialogHeader>
          <DialogTitle>Transaction History</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {mockTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between bg-muted p-3 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {transaction.type === "send" ? (
                  <ArrowUpRight className="text-red-400" />
                ) : (
                  <ArrowDownLeft className="text-green-400" />
                )}
                <div>
                  <p className="font-semibold">
                    {transaction.type === "send" ? "Sent" : "Received"}
                  </p>
                  <p className="text-sm text-gray-400">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {transaction.amount} {transaction.token}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
