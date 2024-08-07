import { SignedIn, UserButton } from "@clerk/nextjs";
import React from "react";
import { ModeToggle } from "./theme-toggler";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center">
      <Logo />
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
