export interface IPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}
export enum CardType {
  Visa = "visa",
  MasterCard = "mastercard",
  Amex = "amex",
  Unknown = "unknown",
}

export interface IPayCardInfo {
  id: string;
  name: string;
  expireDate: string;
  cvv: string;
  type?: CardType;
}
