import "./globals.css";

interface IProps {
  children: React.ReactNode;
}
export default async function LocaleLayout(props: IProps) {
  const { children } = props;
  return <>{children}</>;
}
