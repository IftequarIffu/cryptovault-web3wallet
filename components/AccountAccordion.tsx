import { getBalanceOfAnAddress } from '@/actions/balance';
import { NetworkType } from '@/lib/types';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  import { Avatar, AvatarFallback } from "@/components/ui/avatar";
  import {
    Send,
    Copy,
    Plus,
    Edit2,
    ChevronLeft,
    ChevronRight,
    Check,
  } from "lucide-react";
  import { Input } from "@/components/ui/input";
import React, { useCallback } from 'react'
import { Button } from './ui/button';
import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@/context/WalletContext';
import { handleRenameAccountsInLocalStorage } from "@/lib/utils";
import { useUser } from '@clerk/nextjs';
import { supportedNetworks } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from './LoadingSpinner';






const AccountAccordion = ({account}: {account: any}) => {

    const { toast } = useToast();
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

    const [balance, setBalance] = useState(0)


    const {isLoaded, user} = useUser()


    const inputRef = useRef<HTMLInputElement>(null);
    const [newAccountName, setNewAccountName] = useState("");
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

      const [transferDetails, setTransferDetails] = useState({
        fromAccount: "",
        amount: "",
        toAddress: "",
        message: "",
      });

      const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);


      const getNetworkInfo = (network: NetworkType) => supportedNetworks[network];

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

      const handleOpenTransferModal = (accountId: string) => {
        setTransferDetails({ ...transferDetails, fromAccount: accountId });
        setIsTransferModalOpen(true);
      };

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
        // console.log("In HandleStart Renaming")
        setIsRenaming(accountId);
        setNewAccountName(currentName);
      };

      const formatAddress = (address: string) => {
        if (!address) return "";
        const firstPart = address.slice(0, 4);   // First 4 characters (e.g., '0x3cF')
        const lastPart = address.slice(-3);      // Last 3 characters (e.g., '93C')
        return `${firstPart}...${lastPart}`;
      };



    const [isRenaming, setIsRenaming] = useState<string | null>(null);
    useEffect(() => {
        if (isRenaming && inputRef.current) {
          inputRef.current.focus();
        }
      }, [isRenaming]);

    
    const [balanceLoading, setBalanceLoading] = useState(false)

    const fetchBalanceData = useCallback(async (address: string, network: NetworkType) => {
      setBalanceLoading(true);
      try {
        const balance = await getBalanceOfAnAddress(address, network);
        // console.log(`Balance for address ${address} on network ${network} is : ${balance}`);
        setBalance(balance as number);
      } catch (error) {
        // console.error("Error fetching balance:", error);
        toast({
          title: "Error",
          description: "Failed to fetch balance. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setBalanceLoading(false);
      }
    }, [toast]);
    

    useEffect(() => {
      fetchBalanceData(account.address, account.network as NetworkType);
    }, [account.address, account.network, fetchBalanceData]);


  return (
    <AccordionItem key={account.id} value={account.id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback>
                {account.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isRenaming === account.id ? (
              <Input
                ref={inputRef}
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                onBlur={() => handleRename(account.id)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleRename(account.id)
                }
                className="h-6 w-32"
              />
            ) : (
              <span>{account.name}</span>
            )}
          </div>
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                getNetworkInfo(account.network as NetworkType).color
              }`}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleStartRenaming(
                  account.id,
                  account.name as string
                );
              }}
              className="ml-2"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          {/* Address Section */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Address:</span>
            <div className="flex items-center">
              <span className="text-sm">{formatAddress(account.address)}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyAddress(account.address);
                }}
              >
                {copiedAddress === account.address ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {/* Address Section */}

          {/* Balance Section */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Balance:</span>
            <span className="text-sm">
              {/* {account.balance}{" "} */}
              {
                balanceLoading ? <LoadingSpinner /> : parseFloat(balance.toPrecision(3)) + " " + getNetworkInfo(account.network as NetworkType)
                .symbol
              }
              
            </span>
          </div>
          {/* Balance Section */}

          {/* Transfer Button */}
          <Button
            className="w-full mt-2"
            onClick={() => handleOpenTransferModal(account.id)}
          >
            <Send className="mr-2 h-4 w-4" /> Transfer
          </Button>
          {/* Transfer Button */}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default AccountAccordion