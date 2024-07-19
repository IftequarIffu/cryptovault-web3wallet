import React, { useState } from "react";

const TotalFunds = () => {
  const [currentNetwork, setCurrentNetwork] = useState("ethereum");
  const [currentAccount, setCurrentAccount] = useState("account-0");
  const [accounts, setAccounts] = useState([
    {
      id: "account-0",
      address: "0x1234...5678",
      balance: "1.234",
      name: "Account 1",
      network: "ethereum",
    },
    {
      id: "account-1",
      address: "0x5678...9012",
      balance: "0.567",
      name: "Account 2",
      network: "ethereum",
    },
    {
      id: "account-2",
      address: "0x9012...3456",
      balance: "2.345",
      name: "Account 3",
      network: "solana",
    },
  ]);

  const networks = {
    ethereum: { name: "Ethereum", symbol: "ETH", color: "bg-blue-500" },
    solana: { name: "Solana", symbol: "SOL", color: "bg-purple-500" },
  };
  return (
    <div className="text-right">
      <p className="text-2xl font-bold">
        {"0"} {"ETH"}
      </p>
      <p className="text-sm text-gray-500">${0} USD</p>
    </div>
  );
};

export default TotalFunds;
