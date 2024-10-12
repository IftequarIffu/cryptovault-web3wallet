"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
// import { useUser } from "@clerk/nextjs";
// import { Account } from "@prisma/client";
import { WalletContextType, NetworkType, TokenType } from "@/lib/types";
import { ClientAccountType } from "@/lib/types";
import {
  get3RecentTransactionsOfUserWallet,
  getAccountsOfAUserWallet,
  getTokens,
} from "@/actions/walletActions";
import { generateMnemonic } from "bip39";
import { useUser } from "@clerk/nextjs";
import { HDNodeWallet, Mnemonic } from "ethers";
import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import { getBalanceOfAnAddress } from "@/actions/balance";
import { getMnemonicAfterGeneratingIt,
   getMnemonicFromLocalStorage, 
   getEthAndSolAccountsAfterGenerating,
   updateUnsafeMetaDataOfUserForEthAndSol,
   getAccountsFromLocalStorage,
   encrypt
   } from "@/lib/utils"; 


// import { Account } from "@prisma/client";

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const {user, isLoaded} = useUser()

  const [selectedNetwork, setSelectedNetwork] =
    useState<NetworkType>("Ethereum");
  const [accounts, setAccounts] = useState<any[]>([]);
  // const [accounts, setAccounts] = useState()
  const [activeTab, setActiveTab] = useState<"tokens" | "nfts">("tokens");
  const [isGenericTransferModalOpen, setIsGenericTransferModalOpen] =
    useState(false);
  const [transferFromAccountId, setTransferFromAccountId] = useState<
    string | null
  >(null);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [mnemonic, setMnemonic] = useState("");

  const [selectedAccount, setSelectedAccount] = useState("Eth Account");
  const [tokens, setTokens] = useState(getTokens());

  const [areValuesDecrypted, setAreValuesDecrypted] = useState(false)
  
  const [password, setPassword] = useState<string|null>(null)


  const [transactions, setTransactions] = useState(
    get3RecentTransactionsOfUserWallet("abcd")
  );

  const changeNetwork = useCallback((network: NetworkType) => {
    setSelectedNetwork(network);
  }, []);

  const toggleGenericTransferModal = useCallback(() => {
    setIsGenericTransferModalOpen((prev) => !prev);
  }, []);

  const setTransferFromAccountModal = useCallback(
    (accountId: string | null) => {
      setTransferFromAccountId(accountId);
    },
    []
  );

  const toggleAddAccountModal = useCallback(() => {
    setIsAddAccountModalOpen((prev) => !prev);
  }, []);

  const clearMnemonic = useCallback(() => {
    setMnemonic("");
  }, []);

  const setMnemonicString = useCallback((newMnemonic: string) => {
    console.log("New Mnemonic in setMnemoniStaring: ", newMnemonic)
    setMnemonic(newMnemonic);
  }, []);

  const addAccount = useCallback((account: any) => {
    setAccounts((prev: any) => [...prev, account]);
  }, []);

  const setAllAccounts = useCallback((accounts: any[]) => {
    setAccounts(accounts);
  }, []);

  const updateAccountBalance = useCallback((id: string, balance: number) => {
    setAccounts((prev: any[]) =>
      prev.map((account) =>
        account.id === id ? { ...account, balance } : account
      )
    );
  }, []);

  const changeSelectedAccount = useCallback((accountId: string) => {
    setSelectedAccount(accountId);
  }, []);

  const setAllTokens = useCallback((newTokens: TokenType[]) => {
    setTokens(newTokens);
  }, []);

  const setValuesToDecryptedState = useCallback(() => {
    setAreValuesDecrypted(true);
  }, []);

  const setValuesToEncryptedState = useCallback(() => {
    setAreValuesDecrypted(false);
  }, []);

  const setWalletPassword = useCallback((password: string) => {
    setPassword(password);
  }, []);


  const initializeLocalStorageWithMnemonicAndEthAccountAndSolAccount = (newMnemonic: string, accountsArr: any) => {
    localStorage.setItem(`user_details_${user?.id}`, JSON.stringify({
      mnemonic: newMnemonic,
      accounts: accountsArr
    }))
  }

  const getEthDerivationPath = (totalEthAccounts: number) => {
    return `m/44'/60'/0'/0/${totalEthAccounts}`;
  };

  const getSolanaDerivationPath = (totalSolanaAccounts: number) => {
    return `m/44'/501'/${totalSolanaAccounts}'/0'`;
  };

  const createEthAccount = (totalEthereumAccountsCreatedByUserSoFar: number, newMnemonic: string, name:string = "Eth Account 1",) => {
    const mnemonicObject = Mnemonic.fromPhrase(newMnemonic);
    const path = getEthDerivationPath(totalEthereumAccountsCreatedByUserSoFar)
    // console.log(path)
    const hdNodeWallet = HDNodeWallet.fromMnemonic(mnemonicObject, path);

    const accountPayload = {
      id: name,
      name: name,
      balance: 0,
      address: hdNodeWallet.address,
      publicKey: hdNodeWallet.publicKey,
      privateKey: hdNodeWallet.privateKey,
      network: 'Ethereum',
      derivationPath: path,
    }
    
    return accountPayload;
  }

  const createSolAccount = async(totalSolanaAccountsCreatedByUserSoFar: number, newMnemonic: string, name:string = "Sol Account 1",) => {
    
    console.log("Mnemonic in createSolAccount: ", newMnemonic)
    const seed = await bip39.mnemonicToSeed(newMnemonic);
    const derivationPath = getSolanaDerivationPath(0)
    const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key;

    const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);
    const solanaKeypair = Keypair.fromSecretKey(Uint8Array.from(keyPair.secretKey));
    const address = solanaKeypair.publicKey.toBase58()
    

    const accountPayload = {
      id: name,
      name: name,
      balance: 0,
      address: address,
      publicKey: address,
      privateKey: solanaKeypair.secretKey,
      network: 'Solana',
      derivationPath: derivationPath,
    }
    
    return accountPayload;
  }

  const updateTotalEthAccountsCreated = async(user: any, totalEthAccounts:number) => {
    await user.update({
      unsafeMetadata: {
        ...user.unsafeMetadata,
        totalEthereumAccountsCreated: totalEthAccounts+1,
      },
    });
  }

  const updateTotalSolAccountsCreated = async(user: any, totalSolAccounts:number) => {
    await user.update({
      unsafeMetadata: {
        ...user.unsafeMetadata,
        totalSolanaAccountsCreated: totalSolAccounts+1,
      },
    });
  }

  const updateAccountMetaData = async(user: any) => {
    await user.update({
      unsafeMetadata: {
        ...user.unsafeMetadata,
        totalSolanaAccountsCreated: 1,
        totalEthereumAccountsCreated: 1
      },
    });
  }


  useEffect(() => {

    const SetMnemonicUseEffectFunction = async() => {
  
      if(user?.id) {
  
        // Mnemonic Functions
        const storedData = JSON.parse(localStorage.getItem(`user_details_${user.id}`) || "{}")
        let generatedMnemonic = '';
  
        if(!storedData.mnemonic){
          generatedMnemonic = getMnemonicAfterGeneratingIt(user)
          // console.log("Mnemonic after generating in Wallet Context: ", generatedMnemonic)
  
          // encryptStringWithPassword(generatedMnemonic, pass)
          setMnemonicString(generatedMnemonic)
          // console.log("Mnemonic string set 1: ", generatedMnemonic)

        }
        else{
          if(areValuesDecrypted == false) {
            const mnemonicFromLocalStorage = getMnemonicFromLocalStorage(user)
            setMnemonicString(mnemonicFromLocalStorage)
            // console.log("Mnemonic string set 2: ", mnemonicFromLocalStorage)
          }
          

        }
        
      }
  
    }

    SetMnemonicUseEffectFunction()
  }, [isLoaded]);



  useEffect(() => {

    const SetAccountsUseEffectFunction = async() => {
  
      if(user?.id && mnemonic) {
  
        // console.log("Yoo! mnemonic: ", mnemonic)

        const storedData = JSON.parse(localStorage.getItem(`user_details_${user.id}`) || "{}")
  
        // Account Functions
        let generatedAccounts = []
        if(!storedData.accounts || storedData.accounts.length == 0){
          generatedAccounts =  await getEthAndSolAccountsAfterGenerating(user, mnemonic)
          setAllAccounts(generatedAccounts)
          updateUnsafeMetaDataOfUserForEthAndSol(user, 2, 2)
        }
        else{
          if(areValuesDecrypted == false) {
            const accountsFromLocalStorage = getAccountsFromLocalStorage(user)
            if(!areValuesDecrypted) {
              setAllAccounts(accountsFromLocalStorage)
            }
          }
          
          
        }
        
      }
  
    }

    if(mnemonic){
      SetAccountsUseEffectFunction()
    }
   
  }, [isLoaded, mnemonic]);


  const contextValue: WalletContextType = {
    selectedNetwork,
    selectedAccount,
    accounts,
    activeTab,
    isGenericTransferModalOpen,
    transferFromAccountId,
    isAddAccountModalOpen,
    mnemonic,
    transactions,
    tokens,
    areValuesDecrypted,
    password,
    setWalletPassword,
    changeNetwork,
    changeSelectedAccount,
    setActiveTab,
    toggleGenericTransferModal,
    setTransferFromAccountModal,
    toggleAddAccountModal,
    setMnemonicString,
    clearMnemonic,
    addAccount,
    setAllAccounts,
    updateAccountBalance,
    setAllTokens,
    setValuesToDecryptedState,
    setValuesToEncryptedState,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
