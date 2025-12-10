import HomeFooter from "../ui/home/footer";
import { setRequestLocale } from "next-intl/server";
import { Locale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
interface IProps {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}
export default async function MainLayout(props: IProps) {
  const params = await props.params;

  const { children } = props;
  const { lang } = await params;

  setRequestLocale(lang);

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex-1 overflow-auto">{children}</div>
      <HomeFooter />
    </div>
  );
}
