import { WalletContextProvider } from "@/context/WalletContext";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import MainContent from "@/components/MainContent";

export default function Web3Wallet() {
  return (
      <Container>
        <Navbar />
        <MainContent />
      </Container>
  );
}
