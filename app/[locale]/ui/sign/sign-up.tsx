"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { registerByEmail } from "@/lib/api.client";
import { saveToken } from "@/lib/utils";
import { signUp } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import { ROLES } from "@/lib/roles";

export default function SignUp() {
  const t = useTranslations("sign.sign_up");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState<string>(ROLES.USER);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const signUpHandle = async () => {
    if (!email || !password || !firstName || !lastName) {
      toast.error(t("fill_required"));
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error(t("password_mismatch"));
      return;
    }

    try {
      setLoading(true);
      const { token } = await registerByEmail({
        email,
        password,
        name: `${firstName} ${lastName}`,
      });
      if (token) {
        saveToken(token);
      }
      router.push("/");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || t("register_failed"));
    } finally {
      setLoading(false);
    }
  };
  const betterAuthSignUpHandle = async () => {
    try {
      setLoading(true);
      const res = await signUp.email({
        name: `${firstName} ${lastName}`,
        email,
        password,
      });

      if (res.error) {
        console.error(res.error.message || "Something went wrong.");
        toast.error(res.error.message || t("register_failed"));
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || t("register_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="z-50 rounded-md rounded-t-none max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{t("title")}</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">{t("first_name")}</Label>
              <Input
                id="first-name"
                placeholder={t("first_name_placeholder")}
                required
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                value={firstName}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">{t("last_name")}</Label>
              <Input
                id="last-name"
                placeholder={t("last_name_placeholder")}
                required
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                value={lastName}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("email_placeholder")}
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder={t("password_placeholder")}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{t("confirm_password")}</Label>
            <Input
              id="password_confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              autoComplete="new-password"
              placeholder={t("confirm_password_placeholder")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">{t("profile_image")}</Label>
            <div className="flex items-end gap-4">
              {imagePreview && (
                <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt={t("profile_preview")}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 w-full">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {imagePreview && (
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={betterAuthSignUpHandle}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <p>{t("better_auth_sign_up")}</p>
            )}
          </Button>
          {/* <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={signUpHandle}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Create an account"
            )}
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
