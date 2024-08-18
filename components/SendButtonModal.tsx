"use client"

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "./ui/button";
import { DialogHeader, DialogFooter } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { useWallet } from "@/context/WalletContext";
import { Input } from "./ui/input";
import { sendEther, sendSol } from "@/lib/utils";
import { Loader2, CheckCircle2, XCircle, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { PasswordModal } from "./PasswordModal";

const SendButtonModal = ({ filteredAccounts }: { filteredAccounts: any }) => {
  const { isGenericTransferModalOpen, toggleGenericTransferModal, accounts, selectedNetwork, areValuesDecrypted, mnemonic } = useWallet();
  const [transferDetails, setTransferDetails] = useState({
    fromAccount: "",
    amount: "",
    toAddress: "",
    message: "",
  });
  const [transactionState, setTransactionState] = useState<"idle" | "processing" | "success" | "error">("idle");

  const [error, setError] = useState('')
  const [transactionHash, setTransactionHash] = useState('')

  const [copiedTxHash, setCopiedTxHash] = useState<null|string>('')
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const copyToClipboard = async (txHash: string) => {
    try {
      await navigator.clipboard.writeText(txHash);
      setCopiedTxHash(txHash);
      toast({
        title: "TxHash copied",
        description: "The TxHash has been copied to your clipboard.",
      });
      setTimeout(() => setCopiedTxHash(null), 3000);
    } catch (err) {
      console.error("Failed to copy TxHash: ", err);
      toast({
        title: "Copy failed",
        description: "Failed to copy the TxHash. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTransferSubmit = async () => {

    // console.log("Mnemonic when button clicked: ", mnemonic)
    // console.log("Accs ", accounts)

    if(!areValuesDecrypted){
      setIsPasswordModalOpen(true)
    }
    else{

      let txHash = ''
      setTransactionState("processing");
      try {
        const fromAccount = accounts.find((item: any) => item.name === transferDetails.fromAccount);
        if (!fromAccount) throw new Error("Account not found");

        if (selectedNetwork === "Ethereum" || selectedNetwork === "ETH Sepolia") {
          console.log("Hello", fromAccount.privateKey, transferDetails.amount)
          txHash = await sendEther(fromAccount.privateKey, transferDetails.amount, transferDetails.toAddress, selectedNetwork);
        } else if (selectedNetwork === "Solana" || selectedNetwork === "SOL Devnet") {
          txHash = await sendSol(fromAccount.privateKey, transferDetails.toAddress, parseFloat(transferDetails.amount), selectedNetwork);
        }
        if(txHash == null || txHash == undefined || txHash == '') {
          setTransactionState("error");
        }
        else{
          setTransactionHash(txHash)
          setTransactionState("success");
        }
        
      } catch (error: any) {
        setError("Transaction Failed")
        toast({
          title: "Transaction Failed",
          description: "Transaction failed..",
          variant: "destructive",
        });
        console.error("Transaction failed:", error);
        setTransactionState("error");
      }

    }

    
  };

  const resetModal = () => {
    setTransactionState("idle");
    setTransferDetails({
      fromAccount: "",
      amount: "",
      toAddress: "",
      message: "",
    });
    toggleGenericTransferModal();
  };

  return (
    <>
    <Dialog open={isGenericTransferModalOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-[425px]">
        <AnimatePresence mode="wait">
          {transactionState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle>Transfer Funds</DialogTitle>
                <DialogDescription>Enter the details for your transfer.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fromAccount" className="text-right">From Account</Label>
                  <Select
                    value={transferDetails.fromAccount}
                    onValueChange={(value) => setTransferDetails({ ...transferDetails, fromAccount: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredAccounts.map((account: any) => (
                        <SelectItem key={account.id} value={account.name} className="hover:cursor-pointer">
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">Amount</Label>
                  <Input
                    id="amount"
                    value={transferDetails.amount}
                    onChange={(e) => setTransferDetails({ ...transferDetails, amount: e.target.value })}
                    className="col-span-3"
                    placeholder="0.00"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="toAddress" className="text-right">To Address</Label>
                  <Input
                    id="toAddress"
                    value={transferDetails.toAddress}
                    onChange={(e) => setTransferDetails({ ...transferDetails, toAddress: e.target.value })}
                    className="col-span-3"
                    placeholder="0x..."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="message" className="text-right">Message (optional)</Label>
                  <Textarea
                    id="message"
                    value={transferDetails.message}
                    onChange={(e) => setTransferDetails({ ...transferDetails, message: e.target.value })}
                    className="col-span-3"
                    placeholder="Enter a message..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleTransferSubmit}>Transfer</Button>
              </DialogFooter>
            </motion.div>
          )}

          {transactionState === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <h2 className="mt-4 text-lg font-semibold">Processing Transaction</h2>
              <p className="mt-2 text-center text-sm text-gray-500">
                Please wait while we process your transaction. This may take a few moments.
              </p>
            </motion.div>
          )}

          {transactionState === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <h2 className="mt-4 text-lg font-semibold">Transaction Successful</h2>
              <p className="mt-2 text-center text-sm text-gray-500">
                Your transaction has been successfully processed and confirmed.
              </p>
              {transactionHash && (
                <div className="mt-4 w-full">
                  <Label htmlFor="txHash" className="text-sm font-medium">Transaction Hash:</Label>
                  <div className="flex items-center mt-1">
                    <Input
                      id="txHash"
                      value={transactionHash}
                      readOnly
                      className="pr-2"
                    />

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(transactionHash);
                }}
              >
                {copiedTxHash === transactionHash ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
                  </div>
                </div>
              )}
              <Button onClick={resetModal} className="mt-4">Close</Button>
            </motion.div>
          )}

          {transactionState === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <XCircle className="h-16 w-16 text-red-500" />
              <h2 className="mt-4 text-lg font-semibold">Transaction Failed</h2>
              <p className="mt-2 text-center text-sm text-gray-500">
                {
                  // error != '' ? 
                  // `Error: ${error}` : 
                  "We encountered an error while processing your transaction. Please try again."
                }
              </p>
              <Button onClick={resetModal} className="mt-4">Close</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>

    <PasswordModal
    isOpen={isPasswordModalOpen}
    onClose={() => setIsPasswordModalOpen(false)}
    onSuccess={() => {
      setIsPasswordModalOpen(false);
      // handleTransferSubmit();
    }}
    />
    </>
  );
};

export default SendButtonModal;