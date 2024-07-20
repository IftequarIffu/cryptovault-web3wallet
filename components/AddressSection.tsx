import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";

const AddressSection = () => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      toast({
        title: "Address copied",
        description: "The address has been copied to your clipboard.",
      });
      setTimeout(() => setCopiedAddress(null), 3000);
    } catch (err) {
      console.error("Failed to copy address: ", err);
      toast({
        title: "Copy failed",
        description: "Failed to copy the address. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">Address:</span>
      <div className="flex items-center">
        <span className="text-sm">{"0xabcd...efg"}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 ml-2"
          onClick={(e) => {
            e.stopPropagation();
            handleCopyAddress("0xabcd...efg");
          }}
        >
          {copiedAddress === "0xabcd...efg" ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default AddressSection;
