import React from "react";
import { Accounts } from "./Accounts";
import { Overview } from "./Overview";
import { RecentTransactions } from "./RecentTransactions";

const MainContent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Overview />
      <Accounts />
      <RecentTransactions />
    </div>
  );
};

export default MainContent;
