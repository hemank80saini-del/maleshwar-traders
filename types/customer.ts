export interface Customer {
  id: string;

  category: "paint" | "timber" | "pop";

  customerName: string;

  contact: string;

  productName: string;

  productCode: string;

  quantity?: number;

  quantitySold?: number;

  totalAmount: number;

  paidAmount: number;

  dueAmount: number;

  createdAt: string;

  accessories?: {
    name: string;
    price: number;
  }[];

  paints?: {
    paintName: string;
    shadeCode: string;
    brand: string;
    purchasePrice: number;
    sellingPrice: number;
    quantity: number;
    unit: "liter" | "ml" | "gm";
  }[];

  enamels?: {
    enamelName: string;
    brand: string;
    purchasePrice: number;
    sellingPrice: number;
    quantity: number;
    unit: "liter" | "ml" | "gm";
  }[];

  pendingHidden?: boolean;

  pendingCleared?: boolean;

  popChannel?: string;

  popPrice?: number;

  popQuantity?: number;

    popName?: string;

  channelPrice?: number;

  channelQuantity?: number;
}
