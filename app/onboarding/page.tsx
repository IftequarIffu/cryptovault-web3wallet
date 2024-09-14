import React from "react";
import UserOnboarding from "@/components/UserOnboarding";
import { WalletContextProvider } from "@/context/WalletContext";

const Onboarding = () => {
  return (
    // <WalletContextProvider>
      <UserOnboarding />
    // </WalletContextProvider>
  );
};

export default Onboarding;
