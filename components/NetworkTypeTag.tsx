import React from 'react'
import { useWallet } from '@/context/WalletContext';
import { NetworkType } from '@/lib/types';
import { supportedNetworks } from "@/lib/constants";
import { Badge } from './ui/badge';



const NetworkTypeTag = () => {

    const getNetworkInfo = (network: NetworkType) => supportedNetworks[network as NetworkType];


    const {selectedNetwork} = useWallet();


  return (
    <>
        {
          getNetworkInfo(selectedNetwork).type == "testnet" && <Badge className={`ms-[320px]`}>Test Net</Badge>
        }

        {
          getNetworkInfo(selectedNetwork).type == "devnet" && <Badge className={`ms-[320px]`}>Dev Net</Badge>
        }
    </>
  )
}

export default NetworkTypeTag