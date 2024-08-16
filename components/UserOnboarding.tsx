"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import MnemonicDisplay from "./MnemonicDisplay";
import WalletPasswordSetup from "./WalletPasswordSetup";
import { useWallet } from "@/context/WalletContext";
import { hash, addHashedPasswordToLocalStorageAndEncryptLocalStorage } from "@/lib/utils";
import { UserResource } from "@clerk/types";

export default function UserOnboarding() {
  const [step, setStep] = useState<"mnemonic" | "password">("mnemonic");
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [onboardingState, setOnboardingState] = useState<boolean | null>(null);
  const { mnemonic, setMnemonicString, setValuesToDecryptedState, setValuesToEncryptedState } = useWallet();

  useEffect(() => {
    if (isLoaded && user) {
      const onboardingComplete = user.unsafeMetadata.onboardingComplete;
      setOnboardingState(onboardingComplete as boolean);
      console.log(onboardingComplete);
      if (onboardingComplete) {
        router.push("/dashboard");
      }
    }
  }, [isLoaded, user, router]);

  const handleMnemonicComplete = () => {
    setStep("password");
  };

  const handlePasswordComplete = async (password: string) => {
    if (!user) return;

    try {
      // Update user metadata to mark onboarding as complete
      //   console.log("handlePasswordComplete");
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          onboardingComplete: true,
          // totalSolanaAccountsCreated: 0,
          // totalEthereumAccountsCreated: 0,
        },
      });

      // Add the hashed password to the local storage
      // const storedData = JSON.parse(localStorage.getItem(`user_details_${user.id}`) || "{}")

      // const accountsFromLocalStorage = storedData.accounts;

      // let accountsWithHashedPrivateKey: any[] = []

      // accountsFromLocalStorage.map((account: any) => {
      //   accountsWithHashedPrivateKey.push({...account, privateKey: hash(account.privateKey)})
      // })

      // let newStoredData = {...storedData, hashedPassword: hash(password), mnemonic: hash(mnemonic), accounts: accountsWithHashedPrivateKey}
      // localStorage.setItem(`user_details_${user.id}`, JSON.stringify(newStoredData))

      if (!isLoaded) {
        return;
      }
      // In a real application, you would securely store or use the password
      // console.log("Password set:", password);
      // let existingLocalStorageOfLoggedInUser = localStorage.getItem(user.id);
      // let newLocalStorage = existingLocalStorageOfLoggedInUser
      //   ? JSON.parse(existingLocalStorageOfLoggedInUser)
      //   : {};
      // newLocalStorage.mnemonic = mnemonic;
      // localStorage.setItem(user.id, JSON.stringify(newLocalStorage));

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating user metadata:", error);
      // Handle the error appropriately
    }
  };

  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {step === "mnemonic" && (
        <MnemonicDisplay onComplete={handleMnemonicComplete} />
      )}
      {step === "password" && (
        <WalletPasswordSetup onComplete={handlePasswordComplete} />
      )}
    </div>
  );
}


