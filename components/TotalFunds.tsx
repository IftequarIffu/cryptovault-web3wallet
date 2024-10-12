'use client'
import { getPricesOfEthAndSolInUSD } from "@/actions/priceActions";
import { NetworkType } from "@/lib/types";
import { useWallet } from "@/context/WalletContext";
import { supportedNetworks } from "@/lib/constants";
import { useEffect, useState } from "react";
import { getSumOfBalancesOfAccounts } from "@/actions/balance";

const TotalFunds = () => {

  const [totalBalance, setTotalBalance] = useState(0)
  const [ethPriceInUSD, setEthPriceInUSD] = useState(0)
  const [solPriceInUSD, setSolPriceInUSD] = useState(0)
  const [currencyPrices, setCurrencyPrices] = useState<{ ethPriceInUSD: number; solPriceInUSD: number } | null>(null);

  const getNetworkInfo = (network: NetworkType) =>
    supportedNetworks[network as NetworkType];

  const {
    accounts,
    selectedNetwork,
  } = useWallet();

  const selectedNetworkAccounts = accounts.filter((account) => account.network == selectedNetwork)
  console.log("SelectedNetworkAccounts: ", selectedNetworkAccounts)




  useEffect(() => {

    const getTotalBalance = async(selectedNetworkAccounts: any[], selectedNetwork: NetworkType) => {
      const totalBalance = await getSumOfBalancesOfAccounts(selectedNetworkAccounts, selectedNetwork)
      console.log("Total Balance: ", totalBalance)
      if (!currencyPrices) {
        const currencyPrices = await getPricesOfEthAndSolInUSD()
        setCurrencyPrices(currencyPrices); // Store prices in state
        setEthPriceInUSD(currencyPrices.ethPriceInUSD);
        setSolPriceInUSD(currencyPrices.solPriceInUSD)
      }    

      setTotalBalance(totalBalance);
    }

    getTotalBalance(selectedNetworkAccounts, selectedNetwork)
  }, [selectedNetwork])



  const totalBalanceInUSD = selectedNetwork == "Ethereum" || selectedNetwork == "ETH Sepolia" ? (totalBalance*ethPriceInUSD) : (totalBalance*solPriceInUSD)



  return (
    <div className="text-right">
      <p className="text-2xl font-bold">
        {parseFloat(totalBalance.toPrecision(3)) + " "}
        {getNetworkInfo(selectedNetwork).symbol}
      </p>
      <p className="text-sm text-gray-500">

        {
          
          `${parseFloat(totalBalanceInUSD.toFixed(3))} USD`
        }
        
        </p>
    </div>
  );
};

export default TotalFunds;
