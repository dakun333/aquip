import { Metadata } from "next";
import "./globals.css";

export interface IProps {
  children: React.ReactNode;
}
export default async function LocaleLayout(props: IProps) {
  const { children } = props;
  return <>{children}</>;
}
