"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Input } from "./ui/input";
import React, { useState } from "react";
import NetworkSelectorDropdown from "./NetworkSelectorDropdown";
import { Button } from "./ui/button";
import { DialogHeader, DialogFooter } from "./ui/dialog";
import { useWallet } from "@/context/WalletContext";
import { useUser } from "@clerk/nextjs";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { HDNodeWallet, Mnemonic } from "ethers";
import { handleAddNewAccount } from "@/lib/utils";
import { PasswordModal } from "./PasswordModal";


const AddNewAccountModal = () => {
  const { isLoaded, user } = useUser();
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const {
    accounts,
    mnemonic,
    addAccount,
    setAllAccounts,
    selectedNetwork,
    changeNetwork,
    selectedAccount,
    changeSelectedAccount,
    areValuesDecrypted, 
    password
  } = useWallet();
  const [newAccount, setNewAccount] = useState({
    name: "",
    network: selectedNetwork,
  });

  const handleAddAccount = () => {

    // if(!areValuesDecrypted){
    //   setIsPasswordModalOpen(true)
    // }

    console.log("Mnemonic : ", mnemonic)

    if(mnemonic.startsWith("U2")){
      setIsPasswordModalOpen(true)
    }

    if (newAccount.name.trim()) {
      const newId = `account-${accounts.length}`;
      setAllAccounts([
        ...accounts,
        {
          id: "1234",
          userId: "user-123",
          address: `0x${Math.random()
            .toString(16)
            .slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
          balance: 0,
          name: newAccount.name.trim(),
          derivationPath: "/abc",
          publicKey: "abcd",
          network: selectedNetwork,
          createdAt: null,
          updatedAt: null,
        },
      ]);
      setIsAddingAccount(false);
      setNewAccount({ name: "", network: selectedNetwork });
    }
  };

  const getEthDerivationPath = (totalEthAccounts: number) => {
    return `m/44'/60'/0'/0/${totalEthAccounts}`;
  };

  const getSolanaDerivationPath = (totalSolanaAccounts: number) => {
    return `m/44'/501'/${totalSolanaAccounts}'/0'`;
  };

  const createEthereumAccount = (
    mnemonic: string,
    derivationPath: string
  ) => {};

  // const handleAddNewAccount = () => {
  //   console.log("Mnemonic: ", mnemonic);
  //   const mnemonicObject = Mnemonic.fromPhrase(mnemonic);

  //   const path = getEthDerivationPath(
  //     user?.unsafeMetadata.totalEthAccounts as number
  //   );
  //   console.log(path);
  //   const hdNodeWallet = HDNodeWallet.fromMnemonic(mnemonicObject, path);

  //   let payload;
  //   if (isLoaded) {
  //     payload = {
  //       userId: user?.id,
  //       address: hdNodeWallet.address,
  //       balance: 0,
  //       name: newAccount.name,
  //       network: selectedNetwork,
  //       publicKey: hdNodeWallet.publicKey,
  //       derivationPath: path,
  //     };
  //   }

  //   console.log(payload);
  // };

  return (
    <>
    <PasswordModal
    isOpen={isPasswordModalOpen}
    onClose={() => setIsPasswordModalOpen(false)}
    onSuccess={() => {
      setIsPasswordModalOpen(false);
      // handleTransferSubmit();
    }}
    />
    <Dialog open={isAddingAccount} onOpenChange={setIsAddingAccount}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4">
          <Plus className="h-4 w-4 mr-2" /> Add Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Account</DialogTitle>
          <DialogDescription>
            Create a new account for your wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newAccount.name}
              onChange={(e) =>
                setNewAccount({ ...newAccount, name: e.target.value })
              }
              className="col-span-3"
            />
            <Label htmlFor="name" className="text-right">
              Network
            </Label>
            <NetworkSelectorDropdown />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={async() => {
            if(!areValuesDecrypted){
              setIsPasswordModalOpen(true);
            }
            else{
              const decryptedAccounts: any = await handleAddNewAccount(mnemonic, user, selectedNetwork, newAccount.name, password as string);
              setAllAccounts(decryptedAccounts);
              setIsAddingAccount(false)
            }
            
          }}>Add Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
    
  );
};

export default AddNewAccountModal;
