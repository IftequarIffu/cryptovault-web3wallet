import React, { Suspense, lazy } from "react";
// import { Accounts } from "./Accounts";
import { Overview } from "./Overview";
import { RecentTransactions } from "./RecentTransactions";
import { AccountsSkeleton } from "./AccountsSkeleton";

const Accounts = lazy(() => import('@/components/Accounts'));

const MainContent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Overview />
      <Suspense fallback={<AccountsSkeleton />}>
        <Accounts />
      </Suspense>
      {/* <RecentTransactions /> */}
    </div>
  );
};

export default MainContent;
