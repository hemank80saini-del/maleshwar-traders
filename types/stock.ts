export type Stock = {
  id: string;

  category: "paint" | "timber";

  productName: string;

  productCode: string;

  brand: string;

  price: number;

  sellingPrice: number;

  quantity: number;

  createdAt: string;
};