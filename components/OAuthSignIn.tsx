
'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GithubIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { ModeToggle } from "./theme-toggler"
import { useRouter } from "next/navigation"


export default function OAuthSignIn() {

    const { signIn } = useSignIn();
    const { signUp, setActive } = useSignUp();

    const router = useRouter()

    const signInWith = (strategy: "oauth_google" | "oauth_github") => {
      return signIn?.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sign-up/sso-callback',
        redirectUrlComplete: '/onboarding',
      })
    }


    async function handleSignIn(strategy: "oauth_google" | "oauth_github") {
      if (!signIn || !signUp) return null
  
      // If the user has an account in your application, but does not yet
      // have an OAuth account connected to it, you can transfer the OAuth
      // account to the existing user account.
      const userExistsButNeedsToSignIn =
        signUp.verifications.externalAccount.status === 'transferable' &&
        signUp.verifications.externalAccount.error?.code === 'external_account_exists'
  
      if (userExistsButNeedsToSignIn) {
        const res = await signIn.create({ transfer: true })
  
        if (res.status === 'complete') {
          setActive({
            session: res.createdSessionId,
          })
        }
      }

      // If the user has an OAuth account but does not yet
    // have an account in your app, you can create an account
    // for them using the OAuth information.
    const userNeedsToBeCreated = signIn.firstFactorVerification.status === 'transferable'

    if (userNeedsToBeCreated) {
      const res = await signUp.create({
        transfer: true,
      })

      console.log("Yes yes")

      if (res.status === 'complete') {
        setActive({
          session: res.createdSessionId,
        })
      }
    } else {
      // If the user has an account in your application
      // and has an OAuth account connected to it, you can sign them in.
      signInWith(strategy)
    }
  }





  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">CryptoWallet</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <ModeToggle />
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 ">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Secure Your Crypto Assets with CryptoWallet
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Manage all your cryptocurrencies in one place. Trade, invest, and grow your portfolio with ease.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  {/* <Link
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    href="#"
                  >
                    Get Started
                  </Link> */}
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    href="#"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              {/* <Image
                alt="CryptoWallet App"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="310"
                src="/placeholder.svg"
                width="550"
              /> */}
              <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-12 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Create Your Account</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who trust CryptoWallet for their crypto management needs.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2 mt-10   ">
                
                <Button className="w-full" variant="outline" onClick={() => handleSignIn("oauth_google")}>
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                  </svg>
                  Continue with Google
                </Button>
                <Button className="w-full" variant="outline" onClick={() => handleSignIn("oauth_github")}>
                  <GithubIcon className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </Button>

                
              </div>
            </div>
          </div>
        </section>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Secure Storage</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Your assets are protected by industry-leading security measures.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Multi-Currency Support</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Manage Bitcoin, Ethereum, and other popular cryptocurrencies in one place.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Easy Transactions</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Send and receive crypto with just a few taps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Stay Updated</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Subscribe to our newsletter for the latest crypto news and updates.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col space-y-4">
                  <Input className="max-w-lg h-4 flex-1" placeholder="Enter your email" type="email" />
                  <Button type="submit">Subscribe</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2023 CryptoWallet. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}