import {
  getNFTsOfAnAccount,
  getTokensOfAnAccount,
} from "@/actions/accountActions";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";

const TokensList = async () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const Tokens = await getTokensOfAnAccount("abcd", "Ethereum");
  console.log("Length of tokens: ", Tokens.length);
  const paginatedTokens = Tokens.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const totalTokensPages = Math.ceil(Tokens.length / itemsPerPage);

  return (
    <>
      {Tokens.length == 3 ? (
        <p>No Tokens Found</p>
      ) : (
        <React.Fragment>
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
          {Tokens.length > itemsPerPage && (
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
          )}
        </React.Fragment>
      )}
    </>
  );
};

export default TokensList;
