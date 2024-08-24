"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, AlertTriangle, ShieldAlert } from "lucide-react";
import { generateMnemonic } from "bip39";
import { useUser } from "@clerk/nextjs";
import { useWallet } from "@/context/WalletContext";
import { getAccountsFromLocalStorage, getEthAndSolAccountsAfterGenerating, getMnemonicAfterGeneratingIt, getMnemonicFromLocalStorage, updateUnsafeMetaDataOfUserForEthAndSol } from "@/lib/utils";

interface MnemonicDisplayProps {
  onComplete: () => void;
}

export default function MnemonicDisplay({ onComplete }: MnemonicDisplayProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // In a real application, this would be generated securely and not hardcoded

  // Complete this function
  // let mnemonicWords;
  // mnemonicWords = [
  //   "apple",
  //   "banana",
  //   "cherry",
  //   "date",
  //   "elderberry",
  //   "fig",
  //   "grape",
  //   "honeydew",
  //   "imbe",
  //   "jackfruit",
  //   "kiwi",
  //   "lemon",
  // ];

  const { mnemonic, setMnemonicString, accounts, setAllAccounts } = useWallet();

  const { user, isLoaded } = useUser();

  const handleCopy = () => {
    navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    if (confirmed) {
      onComplete();
    }
  };

  // useEffect(() => {

  //   const SetMnemonicUseEffectFunction = async() => {
  
  //     if(user?.id) {
  
  //       // Mnemonic Functions
  //       const storedData = JSON.parse(localStorage.getItem(`user_details_${user.id}`) || "{}")
  //       let generatedMnemonic = '';
  
  //       if(!storedData.mnemonic){
  //         generatedMnemonic = getMnemonicAfterGeneratingIt(user)
  //         console.log("Mnemonic after generating in MnemonicDisplay: ", generatedMnemonic)
  
  //         // encryptStringWithPassword(generatedMnemonic, pass)
  //         setMnemonicString(generatedMnemonic)
  //         console.log("Mnemonic string set 1: ", generatedMnemonic)

  //       }
  //       else{
  //         const mnemonicFromLocalStorage = getMnemonicFromLocalStorage(user)
  //         setMnemonicString(mnemonicFromLocalStorage)
  //         console.log("Mnemonic string set 2: ", mnemonicFromLocalStorage)

  //       }
        
  //     }
  
  //   }

  //   SetMnemonicUseEffectFunction()

  //   if (isLoaded && mnemonic) {
  //     console.log("Mnemonic in MnemonicDisplay:", mnemonic);
  //     setIsLoading(false);
  //   }
  // }, [isLoaded, mnemonic]);



  // useEffect(() => {

  //   const SetAccountsUseEffectFunction = async() => {
  
  //     if(user?.id) {
  
  //       console.log("Yoo! mnemonic: ", mnemonic)

  //       const storedData = JSON.parse(localStorage.getItem(`user_details_${user.id}`) || "{}")
  
  //       // Account Functions
  //       let generatedAccounts = []
  //       if(!storedData.accounts || storedData.accounts.length == 0){
  //         generatedAccounts =  await getEthAndSolAccountsAfterGenerating(user, mnemonic)
  //         setAllAccounts(generatedAccounts)
  //         updateUnsafeMetaDataOfUserForEthAndSol(user, 2, 2)
  //       }
  //       else{
  //         const accountsFromLocalStorage = getAccountsFromLocalStorage(user)
  //         setAllAccounts(accountsFromLocalStorage)
  //       }
        
  //     }
  
  //   }

  //   SetAccountsUseEffectFunction()

  //   if (isLoaded && accounts) {
  //     console.log("Accounts in MnemonicDisplay:", mnemonic);
  //     setIsLoading(false);
  //   }
  // }, [isLoaded, accounts]);






  // const storeMnemonicToLocalStorage = (encryptedMnemonic: string) => {
  //   let existingLocalStorageOfLoggedInUser = JSON.parse(
  //     localStorage.getItem("abcd")
  //   );
  //   existingLocalStorageOfLoggedInUser.encryptedMnemonic = encryptedMnemonic;
  //   localStorage.setItem(
  //     "abcd",
  //     JSON.stringify(existingLocalStorageOfLoggedInUser)
  //   );
  // };

  // const encrypt = (mnemonic: string) => {
  //   return mnemonic;
  // };

  // useEffect(() => {
  //   // This effect handles the mnemonic encryption and storage

  //   if (!mnemonic) {
  //     const generatedMnemonic = generateMnemonic();
  //     setMnemonic(generatedMnemonic);
  //   }
  // }, [isLoaded, mnemonic]);

  // useEffect(() => {
  //   if (isLoaded && !mnemonic) {
  //     const generatedMnemonic = generateMnemonic();
  //     console.log("Generating mnemonic after user load:", generatedMnemonic);  // Add log
  //     setMnemonicString(generatedMnemonic);
  //     console.log("Mnemonic set: ", mnemonic)
  //   }
  // }, [isLoaded, mnemonic, setMnemonicString]);
  

  // useEffect(() => {
  //   // const mnemonic = generateRandomMnemonic();
  //   // setMnemonicState(mnemonic);
  //   // const encryptedMnemonic = encrypt(mnemonic);
  //   // storeMnemonicToLocalStorage(encryptedMnemonic);

  //   // const mnemonic = generateMnemonic();
  //   if (!mnemonic) {
  //     const generatedMnemonic = generateMnemonic();
  //     setMnemonic(generatedMnemonic);
  //     // setMnemonicState(generatedMnemonic);
  //   }
  //   // setIsLoading(false);
  //   // setMnemonic(generateMnemonic());
  //   // console.log("Generated Mnemonic:", mnemonic);
  //   // const seed = mnemonicToSeedSync(mnemonic);

  //   // if (isLoaded) {
  //   //   localStorage.setItem(user?.id as string, JSON.stringify(mnemonic));
  //   // }

  //   // console.log(seed);
  // }, []);

  // if (isLoading) {
  //   return <div>Generating your recovery phrase...</div>;
  // }

  if (isLoading) {
    return <div>Loading your recovery phrase...</div>;
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Your Wallet Recovery Phrase</DialogTitle>
          <DialogDescription>
            Write down or copy these 12 words in the exact order. Never share
            them with anyone.
          </DialogDescription>
        </DialogHeader>
        <Card className="border-dashed border-red-500">
          <CardHeader>
            <CardTitle className="flex items-center text-red-500">
              <ShieldAlert className="mr-2" />
              Extremely Important
            </CardTitle>
            <CardDescription>
              These 12 words are the only way to recover your wallet if you lose
              access. Keep them safe and secret.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {mnemonic.split(" ").map((word, index) => (
                <div key={index} className="bg-muted p-2 rounded text-center">
                  <span className="text-muted-foreground mr-2">
                    {index + 1}.
                  </span>
                  {word}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              {copied ? "Copied!" : "Copy to clipboard"}
            </Button>
          </CardFooter>
        </Card>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Never share these words with anyone. Vercel support will never ask
            for them.
          </AlertDescription>
        </Alert>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={confirmed}
            onCheckedChange={(checked) => setConfirmed(checked as boolean)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I have securely saved my recovery phrase
          </label>
        </div>
        <DialogFooter>
          <Button onClick={handleClose} disabled={!confirmed}>
            I&apos;ve saved these words
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
