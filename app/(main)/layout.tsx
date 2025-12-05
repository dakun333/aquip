import HomeFooter from "../ui/home/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex-1 overflow-auto">{children}</div>
      <HomeFooter />
    </div>
  );
}
