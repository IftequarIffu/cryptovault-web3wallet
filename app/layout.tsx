import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { WalletContextProvider } from "@/context/WalletContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CryptoVault",
  description: "Web3 Wallet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <WalletContextProvider>
        <html lang="en">
          <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex min-h-screen justify-center items-center">
                {children}
                {/* <div className="w-3/5 p-4 ">{children}</div> */}
              </div>
            </ThemeProvider>
          </body>
        </html>
    </WalletContextProvider>
    </ClerkProvider>
  );
}
