export type MenuItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export type OrderItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  userName: string;
  createdAt: string;
  items: OrderItem[];
  status?: 'created' | 'approved';
};
