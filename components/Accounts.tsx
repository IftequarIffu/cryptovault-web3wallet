"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBalanceOfAnAddress } from "@/actions/balance";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Copy,
  Plus,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NetworkSelectorDropdown from "./NetworkSelectorDropdown";
import { useWallet } from "@/context/WalletContext";
import { supportedNetworks } from "@/lib/constants";
import { NetworkType } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { createEthereumAccount } from "@/actions/accountActions";
import AddNewAccountModal from "./AddNewAccountModal";
import AccountsLoading from "./AccountsLoading";
import { handleRenameAccountsInLocalStorage } from "@/lib/utils";
import AccountAccordion from "./AccountAccordion";
import useSWR from 'swr'
import { AccountsSkeleton } from "./AccountsSkeleton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Accounts() {
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [newAccountName, setNewAccountName] = useState("");
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const {
    accounts,
    mnemonic,
    addAccount,
    setAllAccounts,
    selectedNetwork,
    changeNetwork,
    selectedAccount,
    changeSelectedAccount,
  } = useWallet();
  const { Wallet } = require("ethers");
  const [newAccount, setNewAccount] = useState({
    name: "",
    network: selectedNetwork,
  });
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferDetails, setTransferDetails] = useState({
    fromAccount: "",
    amount: "",
    toAddress: "",
    message: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const itemsPerPage = 3;
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user, isLoaded } = useUser();
  const [openAccordionItem, setOpenAccordionItem] = useState<string | null>(null);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRenaming]);

  console.log("Accounts in Accounts.tsx: ", accounts)
  const filteredAccounts = accounts.filter(
    (account) => account.network === selectedNetwork
  );
  const paginatedAccounts = filteredAccounts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  const handleRename = (accountId: string) => {
    if (newAccountName.trim()) {

      handleRenameAccountsInLocalStorage(user, accountId, newAccountName)

      setAllAccounts(
        accounts.map((account) =>
          account.id === accountId
            ? { ...account, name: newAccountName.trim() }
            : account
        )
      );

    }
    setIsRenaming(null);
    setNewAccountName("");
  };

  const handleStartRenaming = (accountId: string, currentName: string) => {
    console.log("In HandleStart Renaming")
    setIsRenaming(accountId);
    setNewAccountName(currentName);
  };

  const handleOpenTransferModal = (accountId: string) => {
    setTransferDetails({ ...transferDetails, fromAccount: accountId });
    setIsTransferModalOpen(true);
  };

  const getNetworkInfo = (network: NetworkType) => supportedNetworks[network];

  const handleTransferSubmit = () => {
    console.log("Transfer details:", transferDetails);
    // Implement the actual transfer logic here
    setIsTransferModalOpen(false);
    setTransferDetails({
      fromAccount: "",
      amount: "",
      toAddress: "",
      message: "",
    });
  };

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

  

  const formatAddress = (address: string) => {
    if (!address) return "";
    const firstPart = address.slice(0, 4);   // First 4 characters (e.g., '0x3cF')
    const lastPart = address.slice(-3);      // Last 3 characters (e.g., '93C')
    return `${firstPart}...${lastPart}`;
  };

  if (!isLoaded || user == null) {
    return null;
  }



  return (
    //<Suspense fallback={<AccountsLoading />}>
      <Card>
        <CardHeader>
          <CardTitle>
            Accounts [{supportedNetworks[selectedNetwork].name}]
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* <Suspense fallback={<AccountsSkeleton />}> */}
          <div className="h-[400px] flex flex-col justify-between">
            <Accordion
              type="single"
              collapsible
              className="w-full"
              value={selectedAccount}
              onValueChange={changeSelectedAccount}
            >
              {paginatedAccounts.map((account) => (
                <AccountAccordion key={account.id} account={account} />
              ))}
            </Accordion>
            {filteredAccounts.length > itemsPerPage && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span>
                  {currentPage + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
                  }
                  disabled={currentPage === totalPages - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          {/* </Suspense> */}
          

          <AddNewAccountModal />

          <Dialog
            open={isTransferModalOpen}
            onOpenChange={setIsTransferModalOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Transfer Funds</DialogTitle>
                <DialogDescription>
                  Enter the details for your transfer.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    value={transferDetails.amount}
                    onChange={(e) =>
                      setTransferDetails({
                        ...transferDetails,
                        amount: e.target.value,
                      })
                    }
                    className="col-span-3"
                    placeholder="0.00"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="toAddress" className="text-right">
                    To Address
                  </Label>
                  <Input
                    id="toAddress"
                    value={transferDetails.toAddress}
                    onChange={(e) =>
                      setTransferDetails({
                        ...transferDetails,
                        toAddress: e.target.value,
                      })
                    }
                    className="col-span-3"
                    placeholder="0x..."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="message" className="text-right">
                    Message (optional)
                  </Label>
                  <Textarea
                    id="message"
                    value={transferDetails.message}
                    onChange={(e) =>
                      setTransferDetails({
                        ...transferDetails,
                        message: e.target.value,
                      })
                    }
                    className="col-span-3"
                    placeholder="Enter a message..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleTransferSubmit}>Transfer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    //</Suspense>
  )
}
