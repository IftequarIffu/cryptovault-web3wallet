import prisma from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Account as AccountType } from "@prisma/client";


export const getTokensOfAnAccount = async (
  address: string,
  network: string
) => {
  const tokens = [
    { name: "Ethereum", symbol: "ETH", balance: "1.234", value: "2468.00" },
    { name: "USD Coin", symbol: "USDC", balance: "100.00", value: "100.00" },
    { name: "Chainlink", symbol: "LINK", balance: "50.00", value: "750.00" },
  ];

  return tokens;
};

export const getNFTsOfAnAccount = async (address: string, network: string) => {
  return [];
};

export const createEthereumAccount = async (input: any) => {
  await prisma.account.create({
    data: input,
  });
};

export const createSolanaAccount = async () => {};
