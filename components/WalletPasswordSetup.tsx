import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface WalletPasswordSetupProps {
  onComplete: (password: string) => void;
}

export default function WalletPasswordSetup({
  onComplete,
}: WalletPasswordSetupProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Hello from handlesubmit");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    onComplete(password);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Set Your Wallet Password</CardTitle>
        <CardDescription>
          This password will be used to access your wallet. Make sure it&apos;s
          strong and unique.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-red-500 flex items-center">
              <AlertCircle className="mr-2 h-4 w-4" />
              {error}
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          Set Password and Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
