import prisma from "@/lib/db";
import { ClientAccountType, TransactionType } from "@/lib/types";

export const getAccountsOfAUserWallet = (userId: string) => {
  let accounts: any = [
    {
      id: "account-0",
      userId: "user-123",
      address: "0x1234...5678",
      balance: 1.234,
      name: "Yoyo Account",
      network: "Ethereum",
      publicKey: "abcd",
      derivationPath: "/abcd/1/2/3",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "account-1",
      userId: "user-123",
      address: "0x5678...9012",
      balance: 0.567,
      name: "John",
      network: "Ethereum",
      publicKey: "abcd",
      derivationPath: "/abcd/1/2/3",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "account-2",
      userId: "user-123",
      address: "0x9012...3456",
      balance: 2.345,
      name: "Walter",
      network: "Solana",
      publicKey: "abcd",
      derivationPath: "/abcd/1/2/3",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  return accounts;
};

export const get3RecentTransactionsOfUserWallet = (userId: string) => {
  const recentTransactions: TransactionType[] = [
    {
      type: "send",
      amount: "0.1 ETH",
      to: "0xabcd...efgh",
      date: "2023-06-01",
    },
    {
      type: "receive",
      amount: "100 USDC",
      from: "0xijkl...mnop",
      date: "2023-05-30",
    },
    {
      type: "swap",
      amount: "0.5 ETH",
      to: "10 LINK",
      date: "2023-05-28",
    },
  ];

  return recentTransactions;
};

export const getTokens = () => {
  const tokens = [
    { name: "Ethereum", symbol: "ETH", balance: 1.234, value: 2468.0 },
    { name: "USD Coin", symbol: "USDC", balance: 100.0, value: 100.0 },
    { name: "Chainlink", symbol: "LINK", balance: 50.0, value: 750.0 },
  ];

  return tokens;
};
