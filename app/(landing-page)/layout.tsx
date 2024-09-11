import { WalletContextProvider } from '@/context/WalletContext'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from 'next-themes'
import React, { ReactNode } from 'react'
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });


const LandingPageLayout = ({ children }: {children: ReactNode}) => {
  return (
        <div className=" p-4 ">{children}</div>
  )
}

export default LandingPageLayout