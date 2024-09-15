// import OAuthSignIn from "@/components/OAuthSignIn";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    // <div className="flex items-center justify-center min-h-screen">
    //   <OAuthSignIn />
    // </div>

    <SignUp signInUrl="/sign-in" />
  );
}
