export interface Order {
  _id?: string; // MongoDB ObjectId string
  userId: string; // reference to User _id
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  createdAt?: Date;
}
