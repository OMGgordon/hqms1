import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>
        <form className="space-y-4">
          <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" className="w-full">Create Account</Button>
        </form>
      </CardContent>
    </Card>
  );
}
