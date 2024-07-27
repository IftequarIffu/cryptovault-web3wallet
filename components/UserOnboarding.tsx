import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import MnemonicDisplay from "./MnemonicDisplay";
import WalletPasswordSetup from "./WalletPasswordSetup";

export default function UserOnboarding() {
  const [step, setStep] = useState<"mnemonic" | "password">("mnemonic");
  const { user } = useUser();
  const router = useRouter();

  const handleMnemonicComplete = () => {
    setStep("password");
  };

  const handlePasswordComplete = (password: string) => {
    // In a real application, you would securely store or use the password
    console.log("Password set:", password);
    // Redirect to dashboard
    router.push("/dashboard");
  };

  if (!user) {
    // Handle the case where the user is not authenticated
    return <div>Please sign in to continue.</div>;
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
