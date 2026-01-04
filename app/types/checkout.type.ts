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
  ELO = "elo",
  Diners = "diners",
  Discover = "discover",
  Hiper = "hiper",
  JCB = "jcb",
  Mir = "mir",
  PayPal = "paypal",
  UnionPay = "unionpay",
  Unknown = "unknown",
}

export interface IPayCardInfo {
  id: string;
  name: string;
  expireDate: string;
  cvv: string;
  type?: CardType;
}
export interface ICard {
  id: string;
  name: string;
  expireDate: string;
  cvv: string;
  type: CardType;
}
