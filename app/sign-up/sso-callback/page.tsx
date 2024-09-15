// import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

// export default function SSOCallback() {
//   console.log("testing");
//   // Handle the redirect flow by rendering the
//   // prebuilt AuthenticateWithRedirectCallback component.
//   // This is the final step in the custom OAuth flow.
//   return <AuthenticateWithRedirectCallback />;
// }

'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  // const { isLoaded, user } = useUser(); // Get user details after auth
  // const { isSignedIn } = useAuth(); // To check if user is authenticated
  // const router = useRouter();

  // useEffect(() => {
  //   if (isLoaded) {
  //     if (isSignedIn) {
  //       // Check if this is the first time (sign-up flow)
  //       if (user?.createdAt === user?.updatedAt) {
  //         // First login, redirect to onboarding
  //         router.push("/onboarding");
  //       } else {
  //         // Existing user, redirect to homepage
  //         router.push("/dashboard"); // or whatever default home
  //       }
  //     } else {
  //       // If the user is not signed in, something went wrong, redirect to sign-in
  //       router.push("/onboarding");
  //     }
  //   }
  // }, [isLoaded, isSignedIn, user, router]);

  return <AuthenticateWithRedirectCallback />;
}
