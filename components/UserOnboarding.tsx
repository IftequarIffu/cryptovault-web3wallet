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
        },
      });

      if (!isLoaded) {
        return;
      }
      
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


