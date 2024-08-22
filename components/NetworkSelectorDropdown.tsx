"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import React from "react";
import { useWallet } from "@/context/WalletContext";
import { supportedNetworks } from "@/lib/constants";

const NetworkSelectorDropdown = () => {
  const { selectedNetwork, changeNetwork } = useWallet();

  return (
    <Select value={selectedNetwork} onValueChange={changeNetwork}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select network" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(supportedNetworks).map(([key, network]) => (
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
