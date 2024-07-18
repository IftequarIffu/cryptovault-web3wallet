import React, { ReactNode } from "react";
import { CardHeader, CardTitle } from "./ui/card";

const HeaderForCard = ({ children }: { children: ReactNode }) => {
  return (
    <CardHeader>
      <CardTitle>{children}</CardTitle>
    </CardHeader>
  );
};

export default HeaderForCard;
