import { Send } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";

const SendOrTransferButton = () => {
  const [transferDetails, setTransferDetails] = useState({
    fromAccount: "",
    amount: "",
    toAddress: "",
    message: "",
  });

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const handleOpenTransferModal = () => {
    setTransferDetails({
      ...transferDetails,
      fromAccount: "",
    });
    setIsTransferModalOpen(true);
  };

  return (
    <Button onClick={handleOpenTransferModal}>
      <Send className="mr-2 h-4 w-4" /> Send
    </Button>
  );
};

export default SendOrTransferButton;
