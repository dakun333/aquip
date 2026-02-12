import { CardType } from "@/app/types/checkout.type";
import Image from "next/image";
interface IProps {
  type?: CardType;
  width?: number;
  height?: number;
}
export default function CardIcon({
  type = CardType.Unknown,
  width = 48,
  height = 43,
}: IProps) {
  const typeMap: Record<CardType, string> = {
    [CardType.Visa]: "/card/visa.svg",
    [CardType.MasterCard]: "/card/master.svg",
    [CardType.Amex]: "/card/amex.svg",
    [CardType.ELO]: "/card/elo.svg",
    [CardType.Diners]: "/card/diners.svg",
    [CardType.Discover]: "/card/discover.svg",
    [CardType.Hiper]: "/card/hiper.svg",
    [CardType.JCB]: "/card/jcb.svg",
    [CardType.Mir]: "/card/mir.svg",
    [CardType.PayPal]: "/card/paypal.svg",
    [CardType.UnionPay]: "/card/unionpay.svg",
    [CardType.Unknown]: "/card/default.svg",
  };
  const uri = typeMap[type] || typeMap[CardType.Unknown];

  return <Image src={uri} alt={type} width={width} height={height} />;
}
