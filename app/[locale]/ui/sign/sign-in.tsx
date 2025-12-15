"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { Loader2, Key } from "lucide-react";
// import { signIn } from "@/lib/auth-client";
import Link from "next/link";

import { useRouter } from "next/navigation";

import { saveToken } from "@/lib/utils";
import { IResponse, User } from "@/app/types/api.type";
import { loginByEmail } from "@/lib/api.client";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async () => {
    console.log("执行这里====", email, password);
    if (!email || !password) return;
    try {
      setLoading(true);
      console.log("执行这里", email, password);

      const { token } = await loginByEmail(email, password);
      if (token) {
        saveToken(token);
      }
      router.push("/");
    } catch (e) {
      console.error(e);
      // TODO: 可以加 toast 提示
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const resp = await fetch("/api/users", { cache: "no-store" });
        const data = (await resp.json()) as IResponse<User[]>;
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Card className="w-[80%] max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>

            <Input
              id="password"
              type="password"
              placeholder="password"
              autoComplete="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              onClick={() => {
                setRememberMe(!rememberMe);
              }}
            />
            <Label htmlFor="remember">Remember me</Label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={handleEmailLogin}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <p> Login </p>
            )}
          </Button>

          {/* 社交登录按钮暂时移除，如果后续需要可改为调用新的后端接口 */}
        </div>
      </CardContent>
    </Card>
  );
}
