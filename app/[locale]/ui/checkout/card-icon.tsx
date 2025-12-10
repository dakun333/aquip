import { CardType } from "@/app/[locale]/types/checkout.type";
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
  const typeMap = {
    [CardType.Amex]: "/card/amex.svg",
    [CardType.MasterCard]: "/card/master.svg",
    [CardType.Unknown]: "/card/default.svg",
    [CardType.Visa]: "/card/visa.svg",
  };
  const uri = typeMap[type] || typeMap[CardType.Unknown];

  return <Image src={uri} alt={type} width={width} height={height} />;
}
