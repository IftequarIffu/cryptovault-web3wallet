import { Card, CardContent } from "@/components/ui/card";
import HeaderForCard from "./HeaderForCard";
import NetworkSelectorDropdown from "./NetworkSelectorDropdown";
import TotalFunds from "./TotalFunds";
import SendButton from "./SendButton";
import SendButtonModal from "./SendButtonModal";
import { RecentTransactions } from "./RecentTransactions";
import NetworkTypeTag from "./NetworkTypeTag";


export function Overview() {

  return (
    <Card className="md:col-span-2">
      <HeaderForCard>Wallet Overview 

        <NetworkTypeTag />
        
      </HeaderForCard>
      

      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <NetworkSelectorDropdown />
            <TotalFunds />
          </div>

          <SendButton />

          <RecentTransactions />

        </div>

        <SendButtonModal />
      </CardContent>

    </Card>
  );
}
