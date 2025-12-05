export interface IPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}
export interface IPayCardInfo {
  id: string;
  name: string;
  expireDate: string;
  cvv: string;
}
