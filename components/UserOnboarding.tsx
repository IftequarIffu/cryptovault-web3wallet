"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import MnemonicDisplay from "./MnemonicDisplay";
import WalletPasswordSetup from "./WalletPasswordSetup";

export default function UserOnboarding() {
  const [step, setStep] = useState<"mnemonic" | "password">("mnemonic");
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [onboardingState, setOnboardingState] = useState<boolean | null>(null);

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

      // In a real application, you would securely store or use the password
      console.log("Password set:", password);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating user metadata:", error);
      // Handle the error appropriately
    }
  };

  if (!isLoaded || !user || onboardingState == null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {step === "mnemonic" && onboardingState !== null && (
        <MnemonicDisplay onComplete={handleMnemonicComplete} />
      )}
      {step === "password" && (
        <WalletPasswordSetup onComplete={handlePasswordComplete} />
      )}
    </div>
  );
}
