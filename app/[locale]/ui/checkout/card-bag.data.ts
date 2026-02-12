import { CardType, ICard } from "@/app/types/checkout.type";

export const CardBagTestData: ICard[] = [
  {
    id: "5599002122167839",
    name: "John Doe",
    expireDate: "12/25",
    cvv: "123",
    type: CardType.Visa,
  },
  {
    id: "5599002122167838",
    name: "Jane Doe",
    expireDate: "01/26",
    cvv: "456",
    type: CardType.MasterCard,
  },
  {
    id: "2204120132335132",
    name: "Jim Beam",
    expireDate: "02/27",
    cvv: "789",
    type: CardType.Amex,
  },
  {
    id: "2204120132335130",
    name: "Jim Beam",
    expireDate: "02/27",
    cvv: "789",
    type: CardType.Amex,
  },
];
