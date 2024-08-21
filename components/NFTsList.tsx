import { getNFTsOfAnAccount } from "@/actions/accountActions";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";

const NFTsList = async () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const NFTs = await getNFTsOfAnAccount("abcd", "Ethereum");
  const paginatedNFTs = NFTs.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const totalNFTsPages = Math.ceil(NFTs.length / itemsPerPage);

  return (
    <>
      <div className="space-y-2">
        {paginatedNFTs.map((NFT, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-2 bg-muted rounded-lg"
          >
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback>{NFT}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{NFT}</p>
                <p className="text-sm text-gray-500">
                  {NFT} {NFT}
                </p>
              </div>
            </div>
            <p className="font-semibold">${NFT}</p>
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
      )}
    </>
  );
};

export default NFTsList;
