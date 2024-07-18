import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import React, { useState } from "react";

const NetworkSelectorDropdown = () => {
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
    <Select value={currentNetwork} onValueChange={setCurrentNetwork}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select network" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(networks).map(([key, network]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${network.color}`} />
              {network.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default NetworkSelectorDropdown;
