"use client";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OAuthStrategy } from "@clerk/types";

export default function OAuthSignIn() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();

  if (!isLoaded) {
    return null;
  }

  const signInWith = async (strategy: "oauth_google" | "oauth_github") => {
    try {
      const result = await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sign-up/sso-callback",
        redirectUrlComplete: "/onboarding",
      });
      // The redirect will handle the result
    } catch (err) {
      console.error("OAuth error:", err);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In / Sign Up</CardTitle>
        <CardDescription>Choose a method to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full" onClick={() => signInWith("oauth_google")}>
          {/* <Icons.google className="mr-2 h-4 w-4" /> */}
          Continue with Google
        </Button>
        <Button className="w-full" onClick={() => signInWith("oauth_github")}>
          {/* <Icons.gitHub className="mr-2 h-4 w-4" /> */}
          Continue with GitHub
        </Button>
      </CardContent>
    </Card>
  );
}
