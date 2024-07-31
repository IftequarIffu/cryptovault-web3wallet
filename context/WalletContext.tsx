"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
// import { useUser } from "@clerk/nextjs";
// import { Account } from "@prisma/client";
import { WalletContextType, NetworkType } from "@/lib/types";
import { ClientAccountType } from "@/lib/types";
import { getAccountsOfAUserWallet } from "@/actions/walletActions";
// import { Account } from "@prisma/client";

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedNetwork, setSelectedNetwork] =
    useState<NetworkType>("Ethereum");
  const [accounts, setAccounts] = useState<ClientAccountType[]>(
    getAccountsOfAUserWallet("userId")
  );
  const [activeTab, setActiveTab] = useState<"tokens" | "nfts">("tokens");
  const [isGenericTransferModalOpen, setIsGenericTransferModalOpen] =
    useState(false);
  const [transferFromAccountId, setTransferFromAccountId] = useState<
    string | null
  >(null);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [mnemonic, setMnemonic] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("account-0");

  // const { user } = useUser();

  // useEffect(() => {
  //   if (user) {
  //     // In a real application, you would fetch the user's accounts from your backend here
  //     setAccounts([
  //       { id: "1", name: "Main Account", balance: 0 },
  //       { id: "2", name: "Savings", balance: 0 },
  //     ]);
  //   }
  // }, [user]);

  const changeNetwork = useCallback((network: NetworkType) => {
    setSelectedNetwork(network);
  }, []);

  const toggleGenericTransferModal = useCallback(() => {
    setIsGenericTransferModalOpen((prev) => !prev);
  }, []);

  const setTransferFromAccountModal = useCallback(
    (accountId: string | null) => {
      setTransferFromAccountId(accountId);
    },
    []
  );

  const toggleAddAccountModal = useCallback(() => {
    setIsAddAccountModalOpen((prev) => !prev);
  }, []);

  const clearMnemonic = useCallback(() => {
    setMnemonic("");
  }, []);

  const addAccount = useCallback((account: ClientAccountType) => {
    setAccounts((prev) => [...prev, account]);
  }, []);

  const setAllAccounts = useCallback((accounts: ClientAccountType[]) => {
    setAccounts(accounts);
  }, []);

  const updateAccountBalance = useCallback((id: string, balance: number) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === id ? { ...account, balance } : account
      )
    );
  }, []);

  const changeSelectedAccount = useCallback((accountId: string) => {
    setSelectedAccount(accountId);
  }, []);

  const contextValue: WalletContextType = {
    selectedNetwork,
    selectedAccount,
    accounts,
    activeTab,
    isGenericTransferModalOpen,
    transferFromAccountId,
    isAddAccountModalOpen,
    mnemonic,
    changeNetwork,
    changeSelectedAccount,
    setActiveTab,
    toggleGenericTransferModal,
    setTransferFromAccountModal,
    toggleAddAccountModal,
    setMnemonic,
    clearMnemonic,
    addAccount,
    setAllAccounts,
    updateAccountBalance,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
