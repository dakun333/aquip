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
