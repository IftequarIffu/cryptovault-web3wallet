import { ReactNode } from "react";

const Container = ({ children }: { children: ReactNode }) => {
  return <div className="container mx-auto p-3 space-y-3">{children}</div>;
};

export default Container;
