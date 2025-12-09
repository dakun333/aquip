export interface ShopItem {
  id: number;
  name: string;
  price: number;
  discount: number;
  count: number;
  image: string;
  description: string;
  created_at: string;
  checked: boolean;
  status: number;
}
export interface Shop {
  id: string;
  name: string;
  checked: 0 | 1 | 2;
  items: ShopItem[];
}
