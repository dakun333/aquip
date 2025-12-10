import { useTranslations } from "next-intl";

export default function My() {
  const t = useTranslations("my");
  return (
    <>
      <div className="h-full w-full flex flex-col">
        <div className="shrink-0 h-16 flex justify-center items-center text-2xl font-bold border-b">
          {t("title")}
        </div>
        <div className="flex-1 overflow-y-auto"></div>
      </div>
    </>
  );
}
