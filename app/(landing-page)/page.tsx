"use client";
import { ModeToggle } from "@/components/theme-toggler";
import Image from "next/image";
import MnemonicDisplay from "@/components/MnemonicDisplay";
import UserOnboarding from "@/components/UserOnboarding";
import LandingPage from "@/components/LandingPage";
import { useSignIn } from "@clerk/nextjs";
import OAuthSignIn from "@/components/OAuthSignIn";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";


export default function Home() {

  // const {isLoaded, user } = useUser()
  // const router = useRouter()

  // if(isLoaded && user) {
  //   router.push("/onboarding")
  // }

  return (
    // <main>
      
    //   <UserOnboarding />
    // </main>
    // <LandingPage />
    <OAuthSignIn />
  );
}
