export interface Product {
  id: number;
  name: string;
  price: number;
  cover: string;
  description?: string;
  category?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  imgs?: string[];
}
export interface FooterTab {
  name: string;

  label: string;
  href: string;
}
