'use client'
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { generateMnemonic } from "bip39";
import { HDNodeWallet, Mnemonic } from "ethers";
import { Connection,PublicKey, clusterApiUrl, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import { NetworkType } from "./types";
import { ethers } from "ethers";
import axios from 'axios'
import CryptoJS from 'crypto-js';
// import * as crypto from 'crypto';
import { ETHEREUM_MAINNET_RPC_URL, ETHEREUM_SEPOLIA_RPC_URL, supportedNetworks } from "./constants";
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNetworkInfo(network: NetworkType) {

  return supportedNetworks[network];
}



export const getMnemonicAfterGeneratingIt = (user: any) => {

  // Generate Mnemonic
  const generatedMnemonic = generateMnemonic();
  const browserStorage = JSON.parse(localStorage.getItem(`user_details_${user.id}`) || '{}')
  const newStorage = {...browserStorage, mnemonic: generatedMnemonic}

  // Set Mnemonic to Local Storage
  localStorage.setItem(`user_details_${user.id}`, JSON.stringify(newStorage))

  // Return Mnemonic
  return generatedMnemonic
}


export const getMnemonicFromLocalStorage = (user: any) => {

  // Get Mnemonic From Local Storage
  const browserStorage = JSON.parse(localStorage.getItem(`user_details_${user.id}`) || '{}')
  const mnemonicFromLocalStorage = browserStorage.mnemonic

  // Return Mnemonic
  return mnemonicFromLocalStorage
}


export const getEthAndSolAccountsAfterGenerating = async(user: any, mnemonic: string) => {

  // Generate Eth and Sol Accounts
  const generatedEthAccount = await generateEthAccount(mnemonic, 0, "Ethereum")
  const generatedSolAccount = await generateSolAccount(mnemonic, 0, "Solana")

  // Generate Eth Sepolia and Sol Devent Accounts
  const generatedEthSepoliaAccount = await generateEthAccount(mnemonic, 1, "ETH Sepolia")
  const generatedSolDevnetAccount = await generateSolAccount(mnemonic, 1, "SOL Devnet")

  // Get Local Storage
  const browserStorage = JSON.parse(localStorage.getItem(`user_details_${user.id}`) || '{}')
  
  // Get Accounts present in Local Storage
  const accountsFromLocalStorage = browserStorage.accounts

  // Create an array of both Eth and Sol Accounts 
  const generatedAccounts = [generatedEthAccount, generatedSolAccount, generatedEthSepoliaAccount, generatedSolDevnetAccount]

  // Create a new storage object with generatedAccounts and set it to Local Storage
  const newStorage = { ...browserStorage, accounts: generatedAccounts }
  localStorage.setItem(`user_details_${user.id}`, JSON.stringify(newStorage))

  // Return those generatedAccounts
  return generatedAccounts
}

const getEthDerivationPath = (totalEthAccounts: number) => {
  return `m/44'/60'/0'/0/${totalEthAccounts}`;
};

const getSolanaDerivationPath = (totalSolanaAccounts: number) => {
  return `m/44'/501'/${totalSolanaAccounts}'/0'`;
};

export const generateEthAccount = (mnemonic: string, totalEthereumAccountsCreatedByUserSoFar: number, network: NetworkType, name: string = "Eth Acc", password: string = "") => {
  console.log("Mnemonic from generateEthAccount : ", mnemonic)
  const mnemonicObject = Mnemonic.fromPhrase(mnemonic);
    const path = getEthDerivationPath(totalEthereumAccountsCreatedByUserSoFar)
    console.log(path)
    const hdNodeWallet = HDNodeWallet.fromMnemonic(mnemonicObject, path);

    let privateKey = ""
    if(password != ""){
      privateKey = encrypt(hdNodeWallet.privateKey, password) as string
    }
    else{
      privateKey = hdNodeWallet.privateKey
    }


    // const name = networkType == "mainnet" ? "Eth Account" : "Eth Sepolia Account"

    if(name == "Eth Acc" && network == "ETH Sepolia") {
      name = "Eth Sepolia Acc"
    }
    

    const accountPayload = {
      id: uuidv4(),
      name: name,
      address: hdNodeWallet.address,
      publicKey: hdNodeWallet.publicKey,
      privateKey: privateKey,
      // network: 'Ethereum',
      network: network,
      derivationPath: path,
    }
    
    return accountPayload;
}


export function uint8ArrayToHex(uint8Array: Uint8Array) {
  return Array.from(uint8Array)
    .map(byte => byte.toString(16).padStart(2, '0'))  // Convert each byte to hex and pad with 0 if necessary
    .join('');  // Join all the hex strings into one
}


export function hexToUint8Array(hexString: string) {
  // Ensure the hex string has an even length
  if (hexString.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }

  const array = new Uint8Array(hexString.length / 2);

  for (let i = 0; i < hexString.length; i += 2) {
    array[i / 2] = parseInt(hexString.substr(i, 2), 16); // Convert each pair of hex characters to a byte
  }

  return array;
}

export const generateSolAccount = async(mnemonic: string, totalSolanaAccountsCreatedByUserSoFar: number, network: NetworkType, name: string = "Sol Acc", password: string = "" ) => {
    
  console.log("Mnemonic in createSolAccount: ", mnemonic)
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const derivationPath = getSolanaDerivationPath(totalSolanaAccountsCreatedByUserSoFar)
  const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key;

  const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);
  const solanaKeypair = Keypair.fromSecretKey(Uint8Array.from(keyPair.secretKey));
  const address = solanaKeypair.publicKey.toBase58()

  let privateKey = ""
    if(password != ""){
      privateKey = uint8ArrayToHex(new Uint8Array(Object.values(solanaKeypair.secretKey))),
      privateKey = encrypt(privateKey, password) as string
    }
    else{
      privateKey = uint8ArrayToHex(new Uint8Array(Object.values(solanaKeypair.secretKey)))
    }

  if(name == "Sol Acc" && network == "SOL Devnet") {
    name = "Sol Devnet Acc"
  }
  

  const accountPayload = {
    id: uuidv4(),
    name: name,
    address: address,
    publicKey: address,
    privateKey: privateKey,
    network: network,
    derivationPath: derivationPath,
  }
  
  return accountPayload;
}


export const updateUnsafeMetaDataOfUserForEthAndSol = async(user: any, totalEthAccountsCreated: number, totalSolAccountsCreated: number) => {
  await user.update({
    unsafeMetadata: {
      ...user.unsafeMetadata,
      totalSolanaAccountsCreated: 2,
      totalEthereumAccountsCreated: 2,
    },
  });
}

export const updateUnsafeMetaDataOfUserForEth = async(user: any) => {
  const totalEthAccountsCreatedFromMetaData = await user.unsafeMetadata.totalEthereumAccountsCreated
  await user.update({
    unsafeMetadata: {
      ...user.unsafeMetadata,
      totalEthereumAccountsCreated: totalEthAccountsCreatedFromMetaData + 1,
    },
  });
}

export const updateUnsafeMetaDataOfUserForSol = async(user: any) => {
  const totalSolAccountsCreatedFromMetaData = await user.unsafeMetadata.totalSolanaAccountsCreated
  await user.update({
    unsafeMetadata: {
      ...user.unsafeMetadata,
      totalSolanaAccountsCreated: totalSolAccountsCreatedFromMetaData + 1,
    },
  });
}

export const getAccountsFromLocalStorage = (user: any) => {

  // Get Mnemonic From Local Storage
  const browserStorage = JSON.parse(localStorage.getItem(`user_details_${user.id}`) || '{}')
  const accountsFromLocalStorage = browserStorage.accounts

  // Return Mnemonic
  return accountsFromLocalStorage
}


export const handleRenameAccountsInLocalStorage = (user: any, accountId: string, newAccountName: string) => {

  const browserStorage = JSON.parse(localStorage.getItem(`user_details_${user.id}`) || '{}')
  const accountsFromLocalStorage = browserStorage.accounts
  const updatedAccounts = accountsFromLocalStorage.map((account: any) => {
    if(account.id == accountId){
      return {...account, name: newAccountName}
    }
    else{
      return account
    }
  })

  localStorage.setItem(`user_details_${user.id}`, JSON.stringify({...browserStorage, accounts: updatedAccounts}))
}



export const handleAddNewAccount = async(mnemonic: string, user: any, network: NetworkType, name: string, password: string) => {
  
  // Get total Eth and Sol accounts from Metadata
  const totalEthAccounts = user.unsafeMetadata.totalEthereumAccountsCreated
  const totalSolAccounts = user.unsafeMetadata.totalSolanaAccountsCreated

  // Generate Eth or Sol Account
  let generatedAccount;
  if(network == "Ethereum") {
    generatedAccount = generateEthAccount(mnemonic, totalEthAccounts, network, name, password)
    updateUnsafeMetaDataOfUserForEth(user)
  }
  else if(network == "ETH Sepolia"){
    generatedAccount = generateEthAccount(mnemonic, totalEthAccounts, network, name, password)
    updateUnsafeMetaDataOfUserForEth(user)

  }
  else if(network == "Solana") {
    generatedAccount = await generateSolAccount(mnemonic, totalSolAccounts, network, name, password)
    updateUnsafeMetaDataOfUserForSol(user)
  }
  else if(network == "SOL Devnet") {
    generatedAccount = await generateSolAccount(mnemonic, totalSolAccounts,network, name, password)
    updateUnsafeMetaDataOfUserForSol(user)
  }

  // Encrypt private key of newly generated Account


  
  let updatedAccounts: any[] = [];
  let decryptedMnemonic: string | any | undefined = '';
  let decryptedAccounts: string | any[] | undefined = [];
  const browserStorage = JSON.parse(localStorage.getItem(`user_details_${user.id}`) || '{}')
  const accountsFromLocalStorage = browserStorage.accounts
  updatedAccounts = [...accountsFromLocalStorage, generatedAccount]

  let result = decryptLocalStorage(password, mnemonic, updatedAccounts)

  decryptedMnemonic = result[0];
  decryptedAccounts = result[1];


  // Add the newly created account to the local storage
  localStorage.setItem(`user_details_${user.id}`, JSON.stringify({...browserStorage, accounts: updatedAccounts}))

  // Return decryptedAccounts
  return decryptedAccounts

};


export const sendEther = async(privateKey: string, amountInEther: string, toAddress: string, selectedNetwork: NetworkType) => {

  let txHash = '';

  // try {
    
    // create the provider to access arbitrum goerli testnet
    const rpcUrl = selectedNetwork == "Ethereum" ? ETHEREUM_MAINNET_RPC_URL : ETHEREUM_SEPOLIA_RPC_URL
  // const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com')
  const provider = new ethers.JsonRpcProvider(rpcUrl)
  // create wallet using private key and provider
  const wallet = new ethers.Wallet(privateKey, provider)
  // the receiver
  const recipient = toAddress;
  // const amountInEther = '0.001'
  // transaction data, recipient and value in wei
  const txData = {
    to: recipient,
    value: ethers.parseEther(amountInEther)// eth to wei
  }
  console.log(`Sending ${amountInEther}eth to ${recipient}`)
  // send transaction with the wallet
  const tx = await wallet.sendTransaction(txData)
  console.log(`Waiting tx... ${tx.hash}`)
  // wait transaction to confirm at least 1 block
  const finishedTx = await tx.wait()
  console.log(`Tx executed ${finishedTx?.hash}`)
  txHash = finishedTx?.hash as string

  return txHash
  
}

export const hexToDecimal = (str: string) => {
  return parseInt(str, 16)
}

export const balanceInEth = (balanceInWei: number) => {
  return balanceInWei/10**18;
}

export const balanceInSol = (balanceInWei: number) => {
  return balanceInWei/10**9;
}

export const getTransactionsOfAnEthAddress = (address: string) => {

}


export const sendSol = async(senderSecretKey: any, recepientPublicKey: string, amountInSol: number, network: NetworkType) => {
  

  const cluster = network === "Solana" ? "mainnet-beta" : "devnet"

  let signature = '';
  senderSecretKey = new Uint8Array(Object.values(senderSecretKey));
  // console.log("Sender Secret Key: ", senderSecretKey, typeof senderSecretKey)

  const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(senderSecretKey))

  const recipientPublicKey = new PublicKey(recepientPublicKey);

  const amountInLamports = amountInSol * (10**9)

  const connection = new Connection(clusterApiUrl(cluster), 'confirmed');

  async function sendSolana() {
    try {
      // Create a transaction object
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderKeypair.publicKey,  // Sender's public key
          toPubkey: recipientPublicKey,         // Recipient's public key
          lamports: amountInLamports,           // Amount in lamports (1e9 = 1 SOL)
        })
      );

      transaction.feePayer = senderKeypair.publicKey

      console.log("Tx: ", transaction)
  
      // Sign and send the transaction
      try {
        signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);
      } catch (error) {
        throw new Error("Tx Failed!")
      }
      
      console.log('Transaction successful with signature: ', signature);
    } catch (err: any) {
      throw new Error("Transaction Failed!")
      console.error('Failed to send SOL: ', err.getLogs());
    }
    finally {
      return signature
    }
  }

  signature = ''
  signature = await sendSolana()
  return signature

}


export const encrypt = (plainText: string, password: string) => {
  try {
    const iv = crypto.randomBytes(16);
    const key = crypto.createHash('sha256').update(password).digest('base64').substr(0, 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    let encrypted = cipher.update(plainText);
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return iv.toString('hex') + ':' + encrypted.toString('hex');

  } catch (error) {
    console.log(error);
  }
}


export const decrypt = (encryptedText: string, password: string) => {
  try {
    const textParts = encryptedText.split(':');
    const ivHex = textParts.shift(); // Get the first element (IV)
    if (!ivHex) {
      throw new Error('IV is missing or undefined.');
    }
    const iv = Buffer.from(ivHex, 'hex');

    const encryptedData = Buffer.from(textParts.join(':'), 'hex');
    const key = crypto.createHash('sha256').update(password).digest('base64').substr(0, 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    const decrypted = decipher.update(encryptedData);
    const decryptedText = Buffer.concat([decrypted, decipher.final()]);
    return decryptedText.toString();
  } catch (error) {
    console.log(error)
  }
}




export const hash = (str: string) => {
  return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
  // return hash
}


export const addHashedPasswordToLocalStorageAndEncryptLocalStorage = (password: string, mnemonic: string, user: any) => {

      console.log("Password: ", password, typeof password)
      console.log("Mnemonic: ", mnemonic, typeof mnemonic)
      const storedData = JSON.parse(localStorage.getItem(`user_details_${user.id}`) || "{}")

      const accountsFromLocalStorage = storedData.accounts;

      let accountsWithEncryptedPrivateKey: any[] = []

      accountsFromLocalStorage.map((account: any) => {
        accountsWithEncryptedPrivateKey.push({...account, privateKey: encrypt(account.privateKey, password)})
      })

      let newStoredData = {...storedData, hashedPassword: hash(password), mnemonic: encrypt(mnemonic, password), accounts: accountsWithEncryptedPrivateKey}
      
      console.log("New storeddata in addHashedPasswordToLocalStorageAndEncryptLocalStorage: ", newStoredData)
      
      localStorage.setItem(`user_details_${user.id}`, JSON.stringify(newStoredData))

}


export const decryptLocalStorage = (password: string, mnemonic: string, accounts: any[]) => {

  let decryptedMnemonic = decrypt(mnemonic, password)

  let decryptedAccounts: any[] = []

  

  accounts.forEach((account: any) => {
    console.log("Name: ", account.name)
    console.log("Private Key: ", account.privateKey)
    let decryptedPrivateKey: string | undefined | Uint8Array | null = decrypt(account.privateKey, password);
    // console.log("Private Key: ", account.privateKey)
    console.log("Decrypted Private Key: ", decryptedPrivateKey)
    if(account.network === "Solana" || account.network === "SOL Devnet"){
      // console.log("Descrypted private Key: must start with 9, ", decryptedPrivateKey)
      decryptedPrivateKey = hexToUint8Array(decryptedPrivateKey as string)
    }
    if (decryptedPrivateKey) {
      // console.log(`Decrypted private key: ${decryptedPrivateKey}`);
      decryptedAccounts.push({ ...account, privateKey: decryptedPrivateKey });
    } else {
      console.error(`Failed to decrypt private key for account: ${account.address}`);
    }
  })
  console.log("Decrypted Accounts, ", decryptedAccounts)
  return [decryptedMnemonic, decryptedAccounts]

}
