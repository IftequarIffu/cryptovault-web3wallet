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
  console.log("Mnemonic in Overview: ", mnemonic)
  console.log("Accounts in Overview: ", accounts)
  console.log("AreValuesDecrypted in Overview: ", areValuesDecrypted)
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const filteredAccounts = accounts.filter(
    (account) => account.network === selectedNetwork
  );

  const handleOpenTransferModal = () => {
    setTransferDetails({
      ...transferDetails,
      fromAccount: "",
    });
    setIsTransferModalOpen(true);
  };

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

  const paginatedTokens = tokens.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const totalPages = Math.ceil(tokens.length / itemsPerPage);

  const getNetworkInfo = (network: NetworkType) =>
    supportedNetworks[network as NetworkType];

  return (
    <Card className="md:col-span-2">
      <HeaderForCard>Wallet Overview 
        {
          getNetworkInfo(selectedNetwork).type == "testnet" && <Badge className={`ms-[320px]`}>Test Net</Badge>
        }

        {
          getNetworkInfo(selectedNetwork).type == "devnet" && <Badge className={`ms-[320px]`}>Dev Net</Badge>
        }
        
        </HeaderForCard>
      

      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <NetworkSelectorDropdown />
            <TotalFunds currency={getNetworkInfo(selectedNetwork).symbol} networkType={getNetworkInfo(selectedNetwork).type} selectedNetwork={selectedNetwork}/>
          </div>

          {/* Send Button */}
          {/* <div className="flex justify-center">
            <Button onClick={handleOpenTransferModal}>
              <Send className="mr-2 h-4 w-4" /> Send
            </Button>
          </div> */}
          <SendButton />
          {/* Send Button */}

          {/* AssetsList */}

          {/* <Tabs defaultValue="tokens">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="nfts">NFTs</TabsTrigger>
            </TabsList>
            <TabsContent value="tokens" className="h-[300px]">
              <div className="space-y-2">
                {paginatedTokens.map((token, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-muted rounded-lg"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{token.symbol[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{token.name}</p>
                        <p className="text-sm text-gray-500">
                          {token.balance} {token.symbol}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">${token.value}</p>
                  </div>
                ))}
              </div>
              {tokens.length > itemsPerPage && (
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
                      setCurrentPage((prev) =>
                        Math.min(totalPages - 1, prev + 1)
                      )
                    }
                    disabled={currentPage === totalPages - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="nfts" className="h-[300px]">
              <p className="text-center text-gray-500">No NFTs found</p>
            </TabsContent>
          </Tabs> */}

          <RecentTransactions />

          {/* <AssetsList /> */}
          {/* AssetsList */}
        </div>

        {/* SendButtonModal */}
        {/* <Dialog
          open={isGenericTransferModalOpen}
          onOpenChange={toggleGenericTransferModal}
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
                <Label htmlFor="fromAccount" className="text-right">
                  From Account
                </Label>
                <Select
                  value={transferDetails.fromAccount}
                  onValueChange={(value) =>
                    setTransferDetails({
                      ...transferDetails,
                      fromAccount: value,
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({account.balance}{" "}
                        {getNetworkInfo(selectedNetwork).symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
        </Dialog> */}
        <SendButtonModal filteredAccounts={filteredAccounts} />
        {/* SendButtonModal */}
      </CardContent>

      {/* <HistoryModal /> */}
    </Card>
  );
}
