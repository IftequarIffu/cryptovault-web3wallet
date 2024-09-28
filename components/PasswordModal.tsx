"use client";
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWallet } from '@/context/WalletContext';
import { decryptLocalStorage, hash } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';



interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PasswordModal({ isOpen, onClose, onSuccess }: PasswordModalProps) {
    const { mnemonic, setMnemonicString, setValuesToDecryptedState, setValuesToEncryptedState, accounts, setAllAccounts, password, setWalletPassword } = useWallet();
    const {isLoaded, user} = useUser();

    const [wrongPasswordError, setWrongPasswordError] = useState(false)

  const [enteredPassword, setEnteredPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let decryptedMnemonic;
    let decryptedAccounts;

    if(isLoaded){

        let localStoragePassword = JSON.parse(localStorage.getItem(`user_details_${user?.id}`) || '{}').hashedPassword

        console.log("Password in PasswordModal")

        console.log(hash(enteredPassword) == localStoragePassword)

        if(hash(enteredPassword) == localStoragePassword){
            [decryptedMnemonic, decryptedAccounts] = decryptLocalStorage(enteredPassword, mnemonic, accounts)
            setWalletPassword(enteredPassword)
            console.log("Decrypted Mnemonic in PasswordModal: ", decryptedMnemonic)
            console.log("Decrypted Accounts in PasswordModal: ", decryptedAccounts)

            setMnemonicString(decryptedMnemonic as string)
            setAllAccounts(decryptedAccounts as any[])
            console.log("Values decrypted!!!")
            console.log(`Mnemonic in PasswordModal:`, mnemonic)
            console.log(`Accounts in PasswordModal:`, accounts)
            setValuesToDecryptedState()
            onClose()

        }
        else{
            console.log("Password didn't match")
            setWrongPasswordError(true)
            // alert('Incorrect password');
        }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Password</DialogTitle>
          <DialogDescription>
            Please enter your password to sign the transaction.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            type="password"
            placeholder="Enter your password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            className="mt-4"
          />
          {
            wrongPasswordError && <p className='text-sm text-red-600 mt-2 ms-1'>Wrong Password</p>
          }
          <DialogFooter className="mt-6">
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}