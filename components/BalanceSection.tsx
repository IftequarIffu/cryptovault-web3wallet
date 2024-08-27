import React from "react";

const BalanceSection = () => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">Balance:</span>
      <span className="text-sm">
        {0} {"ETH"}
      </span>
    </div>
  );
};

export default BalanceSection;
