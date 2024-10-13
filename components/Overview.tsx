"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeaderForCard from "./HeaderForCard";
import NetworkSelectorDropdown from "./NetworkSelectorDropdown";
import TotalFunds from "./TotalFunds";
import { useWallet } from "@/context/WalletContext";
import SendButton from "./SendButton";
import { supportedNetworks } from "@/lib/constants";
import { NetworkType } from "@/lib/types";
import { Badge } from "./ui/badge";
import SendButtonModal from "./SendButtonModal";
import { RecentTransactions } from "./RecentTransactions";
import NetworkTypeTag from "./NetworkTypeTag";


export function Overview() {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const {
    tokens,
    accounts,
    selectedNetwork,
    selectedAccount,
    changeNetwork,
    mnemonic,
    areValuesDecrypted
  } = useWallet();
  const { isGenericTransferModalOpen, toggleGenericTransferModal } =
    useWallet();
  const [transferDetails, setTransferDetails] = useState({
    fromAccount: "",
    amount: "",
    toAddress: "",
    message: "",
  });
  // console.log("Mnemonic in Overview: ", mnemonic)
  // console.log("Accounts in Overview: ", accounts)
  // console.log("AreValuesDecrypted in Overview: ", areValuesDecrypted)
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const filteredAccounts = accounts.filter(
    (account) => account.network === selectedNetwork
  );

  const getNetworkInfo = (network: NetworkType) =>
    supportedNetworks[network as NetworkType];

  return (
    <Card className="md:col-span-2">
      <HeaderForCard>Wallet Overview 

        <NetworkTypeTag />
        
      </HeaderForCard>
      

      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <NetworkSelectorDropdown />
            <TotalFunds />
          </div>

          <SendButton />

          <RecentTransactions />

        </div>

        <SendButtonModal filteredAccounts={filteredAccounts} />
      </CardContent>

    </Card>
  );
}
