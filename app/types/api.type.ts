export interface IResponse<T> {
  code: number | string;
  data: T;
  message?: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}
export interface RechargeRecord {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
}
