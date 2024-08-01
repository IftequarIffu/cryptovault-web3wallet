export type NetworkType = "Ethereum" | "Solana";
import { Account as AccountType } from "@prisma/client";

export type ClientAccountType = AccountType & { balance: number };

export type WalletContextType = {
  selectedNetwork: NetworkType;
  accounts: ClientAccountType[];
  selectedAccount: string;
  changeSelectedAccount: (accountId: string) => void;
  activeTab: "tokens" | "nfts";
  isGenericTransferModalOpen: boolean;
  transferFromAccountId: string | null;
  isAddAccountModalOpen: boolean;
  mnemonic: string;
  changeNetwork: (network: NetworkType) => void;
  setActiveTab: (tab: "tokens" | "nfts") => void;
  toggleGenericTransferModal: () => void;
  setTransferFromAccountModal: (accountId: string | null) => void;
  toggleAddAccountModal: () => void;
  setMnemonic: (mnemonic: string) => void;
  clearMnemonic: () => void;
  addAccount: (account: ClientAccountType) => void;
  setAllAccounts: (accounts: ClientAccountType[]) => void;
  updateAccountBalance: (id: string, balance: number) => void;
};
