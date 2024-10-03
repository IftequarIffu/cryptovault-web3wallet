import { getPricesOfEthAndSolInUSD } from "@/actions/priceActions";
import { NetworkType } from "@/lib/types";

const TotalFunds = ({ currency, networkType, selectedNetwork }: { currency: string, networkType: string, selectedNetwork: NetworkType }) => {


  // const {ethPriceInUSD, solPriceInUSD} = await getPricesOfEthAndSolInUSD()



  return (
    <div className="text-right">
      <p className="text-2xl font-bold">
        {"0"} {currency}
      </p>
      <p className="text-sm text-gray-500">

        {
          networkType != "mainnet" ? "0 USD" : "1 USD"
        }
        
        </p>
    </div>
  );
};

export default TotalFunds;
