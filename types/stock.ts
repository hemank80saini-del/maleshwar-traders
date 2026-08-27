export type StockUnit = "liter" | "gm";

export type StockVariant = {
  id: string;

  size: number;

  unit: StockUnit;

  price: number;

  sellingPrice: number;

  quantity: number;
};

export type Stock = {
  id: string;

  category: "paint" | "timber" | "enamel";

  productName: string;

  productCode: string;

  brand: string;

  // Old fields - existing data ke liye
  price: number;

  sellingPrice: number;

  quantity: number;

  // New size-wise stock
  variants?: StockVariant[];

  createdAt: string;
};