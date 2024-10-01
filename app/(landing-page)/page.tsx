"use client";
import { ModeToggle } from "@/components/theme-toggler";
import Image from "next/image";
import MnemonicDisplay from "@/components/MnemonicDisplay";
import UserOnboarding from "@/components/UserOnboarding";
import LandingPage from "@/components/LandingPage";
import { useSignIn } from "@clerk/nextjs";
import OAuthSignIn from "@/components/OAuthSignIn";
import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";


export default function Home() {

  const router = useRouter()

  const { user, isLoaded } = useUser()

  if(isLoaded && user) {
    router.push("/dashboard")
  }


  return (
    <OAuthSignIn />
  );
}
