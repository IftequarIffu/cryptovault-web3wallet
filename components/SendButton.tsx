"use client";
import { Send } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { useWallet } from "@/context/WalletContext";

const SendButton = () => {
  const { toggleGenericTransferModal } = useWallet();

  return (
    <div className="flex justify-center">
      <Button onClick={toggleGenericTransferModal}>
        <Send className="mr-2 h-4 w-4" /> Send
      </Button>
    </div>
  );
};

export default SendButton;
