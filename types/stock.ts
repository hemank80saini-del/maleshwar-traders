export interface Stock {
  id: string;

  category: "paint" | "timber";

  productName: string;
  productCode: string;

  brand: string;

  quantity: number;

  price: number;

  createdAt: string;
}