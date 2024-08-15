import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

export function withOnboardingCheck(WrappedComponent: React.ComponentType) {
  return function WithOnboardingCheck(props: any) {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (isLoaded && user) {
        const onboardingComplete = user.unsafeMetadata.onboardingComplete;

        if (!onboardingComplete && router.pathname !== "/onboarding") {
          router.push("/onboarding");
        } else if (onboardingComplete && router.pathname === "/onboarding") {
          router.push("/dashboard");
        }
      }
    }, [isLoaded, user, router]);

    if (!isLoaded) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
}
