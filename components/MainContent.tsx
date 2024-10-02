import React, { Suspense, lazy } from "react";
// import { Accounts } from "./Accounts";
import { Overview } from "./Overview";
import { RecentTransactions } from "./RecentTransactions";
import { AccountsSkeleton } from "./AccountsSkeleton";
import dynamic from "next/dynamic";

// const Accounts = lazy(() => import('@/components/Accounts'));

const Accounts = dynamic(() => import('@/components/Accounts'), {
  loading: () => <AccountsSkeleton />,
  ssr: false
});

const MainContent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Overview />
      {/* <Suspense fallback={<AccountsSkeleton />}> */}
        <Accounts />
      {/* </Suspense> */}
      {/* <AccountsSkeleton /> */}
      {/* <RecentTransactions /> */}
    </div>
  );
};

export default MainContent;
