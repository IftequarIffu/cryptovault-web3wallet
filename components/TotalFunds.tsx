'use client'
import { getPricesOfEthAndSolInUSD } from "@/actions/priceActions";
import { NetworkType } from "@/lib/types";
import { useWallet } from "@/context/WalletContext";
import { supportedNetworks } from "@/lib/constants";
import { useEffect, useState } from "react";
import { getSumOfBalancesOfAccounts } from "@/actions/balance";

const TotalFunds = () => {


  // const {ethPriceInUSD, solPriceInUSD} = await getPricesOfEthAndSolInUSD()

  const [totalBalance, setTotalBalance] = useState(0)
  const [ethAndSolPricesInUSD, setEthAndSolPricesInUSD] = useState({})
  const [ethPriceInUSD, setEthPriceInUSD] = useState(0)
  const [solPriceInUSD, setSolPriceInUSD] = useState(0)
  // const [totalBalanceInUSD, setTotalBalanceInUSD] = useState(0)
  const [currencyPrices, setCurrencyPrices] = useState<{ ethPriceInUSD: number; solPriceInUSD: number } | null>(null);

  const getNetworkInfo = (network: NetworkType) =>
    supportedNetworks[network as NetworkType];

  const {
    tokens,
    accounts,
    selectedNetwork,
    selectedAccount,
    changeNetwork,
    mnemonic,
    areValuesDecrypted
  } = useWallet();

  const selectedNetworkAccounts = accounts.filter((account) => account.network == selectedNetwork)
  console.log("SelectedNetworkAccounts: ", selectedNetworkAccounts)

  // useEffect(() => {

  //   const getEthAndSolPricesInUSD = async() => {
  //     const currencyPrices = await getPricesOfEthAndSolInUSD()
  //     setCurrencyPrices(currencyPrices)
  //   }

  //   getEthAndSolPricesInUSD()

  // }, [])



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
      // // const currencyPrices = await getPricesOfEthAndSolInUSD()
      // if(selectedNetwork == "ETH Sepolia" || selectedNetwork == "Ethereum") {
      //   const totalBalanceInUSD = totalBalance*(currencyPrices.ethPriceInUSD)
      //   console.log("TotalBalanceInUSD in useEffect: ", totalBalanceInUSD)
      //   setTotalBalanceInUSD(totalBalanceInUSD)
      // }
      // else{
      //   const totalBalanceInUSD = totalBalance*(currencyPrices.solPriceInUSD)
      //   console.log("TotalBalanceInUSD in useEffect: ", totalBalanceInUSD)
      //   setTotalBalanceInUSD(totalBalanceInUSD)
      // }
      

      setTotalBalance(totalBalance);
    }

    getTotalBalance(selectedNetworkAccounts, selectedNetwork)
  }, [selectedNetwork])



  const totalBalanceInUSD = selectedNetwork == "Ethereum" || selectedNetwork == "ETH Sepolia" ? (totalBalance*ethPriceInUSD) : (totalBalance*solPriceInUSD)



  return (
    <div className="text-right">
      <p className="text-2xl font-bold">
        {/* {"0"}  */}
        {parseFloat(totalBalance.toPrecision(3)) + " "}
        {getNetworkInfo(selectedNetwork).symbol}
      </p>
      <p className="text-sm text-gray-500">

        {
          // getNetworkInfo(selectedNetwork).type == "mainnet" ? "0 USD" 
          // : 
          // "3 USD"
          
          `${parseFloat(totalBalanceInUSD.toFixed(3))} USD`
        }
        
        </p>
    </div>
  );
};

export default TotalFunds;
