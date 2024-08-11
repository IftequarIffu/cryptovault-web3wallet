export type NetworkType = "Ethereum" | "Solana" | "ETH Sepolia" | "SOL Devnet";
import { Account as AccountType } from "@prisma/client";

export type ClientAccountType = AccountType & { balance: number };

export type TransactionType = {
  type: "send" | "receive" | "swap";
  amount: string;
  to?: string;
  from?: string;
  date: string;
};

export type TokenType = {
  name: string;
  symbol: string;
  balance: number;
  value: number;
};

export type WalletContextType = {
  selectedNetwork: NetworkType;
  accounts: any[];
  selectedAccount: string;
  changeSelectedAccount: (accountId: string) => void;
  activeTab: "tokens" | "nfts";
  isGenericTransferModalOpen: boolean;
  transferFromAccountId: string | null;
  isAddAccountModalOpen: boolean;
  mnemonic: string;
  transactions: TransactionType[];
  tokens: TokenType[];
  areValuesDecrypted: boolean;
  password: string | null;
  setWalletPassword: (password: string) => void;
  changeNetwork: (network: NetworkType) => void;
  setActiveTab: (tab: "tokens" | "nfts") => void;
  toggleGenericTransferModal: () => void;
  setTransferFromAccountModal: (accountId: string | null) => void;
  toggleAddAccountModal: () => void;
  setMnemonicString: (mnemonic: string) => void;
  clearMnemonic: () => void;
  addAccount: (account: any) => void;
  setAllAccounts: (accounts: any[]) => void;
  updateAccountBalance: (id: string, balance: number) => void;
  setAllTokens: (newTokens: TokenType[]) => void;
  setValuesToDecryptedState: () => void;
  setValuesToEncryptedState: () => void;
};
