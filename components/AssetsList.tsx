import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  getNFTsOfAnAccount,
  getTokensOfAnAccount,
} from "@/actions/accountActions";
import NFTsList from "./NFTsList";
import TokensList from "./TokensList";

const AssetsList = async () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  // const tokens = [
  //   { name: "Ethereum", symbol: "ETH", balance: "1.234", value: "2468.00" },
  //   { name: "USD Coin", symbol: "USDC", balance: "100.00", value: "100.00" },
  //   { name: "Chainlink", symbol: "LINK", balance: "50.00", value: "750.00" },
  // ];

  const tokens = await getTokensOfAnAccount("abcd", "Ethereum");
  const NFTs = await getNFTsOfAnAccount("abcd", "Ethereum");

  const paginatedTokens = tokens.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const totalTokensPages = Math.ceil(tokens.length / itemsPerPage);

  const paginatedNFTs = NFTs.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const totalNFTsPages = Math.ceil(NFTs.length / itemsPerPage);

  return (
    <Tabs defaultValue="tokens">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
        <TabsTrigger value="nfts">NFTs</TabsTrigger>
      </TabsList>
      <TabsContent value="tokens" className="h-[300px]">
        {/* <div className="space-y-2">
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
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              {currentPage + 1} / {totalTokensPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(totalTokensPages - 1, prev + 1)
                )
              }
              disabled={currentPage === totalTokensPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )} */}
        {/* <TokensList /> */}
      </TabsContent>
      <TabsContent value="nfts" className="h-[300px]">
        {tokens.length === 0 && (
          <p className="text-center text-gray-500">No NFTs found</p>
        )}
        {/* : (
          // <NFTsList />
        )} */}
        {/* <p className="text-center text-gray-500">No NFTs found</p> */}
        {/* <div className="space-y-2">
          {paginatedNFTs.map((NFT, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 bg-muted rounded-lg"
            >
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback>{NFT.symbol[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{NFT.name}</p>
                  <p className="text-sm text-gray-500">
                    {NFT.balance} {NFT.symbol}
                  </p>
                </div>
              </div>
              <p className="font-semibold">${NFT.value}</p>
            </div>
          ))}
        </div>
        {NFTs.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              {currentPage + 1} / {totalNFTsPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalNFTsPages - 1, prev + 1))
              }
              disabled={currentPage === totalNFTsPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )} */}
      </TabsContent>
    </Tabs>
  );
};

export default AssetsList;
