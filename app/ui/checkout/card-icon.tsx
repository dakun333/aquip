import { CardType } from "@/app/types/checkout.type";
import Image from "next/image";
export default function CardIcon({
  type = CardType.Unknown,
}: {
  type?: CardType;
}) {
  const typeMap = {
    [CardType.Amex]: "/card/amex.svg",
    [CardType.MasterCard]: "/card/master.svg",
    [CardType.Unknown]: "/card/card.svg",
    [CardType.Visa]: "/card/visa.svg",
  };

  return <Image src={typeMap[type]} alt={type} width={40} height={25} />;
}
