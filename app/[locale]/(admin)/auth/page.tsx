import { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/app/[locale]/ui/admin/auth/login-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "admin_auth",
  });

  return {
    title: t("title"),
  };
}

export default async function AuthPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <div className="flex-1">
      <LoginForm />
    </div>
  );
}
