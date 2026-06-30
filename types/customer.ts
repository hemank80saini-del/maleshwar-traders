export interface Customer {
  id: string;

  customerName: string;
  contact: string;

  productName: string;
  productCode: string;

  quantity?: number;

  totalAmount: number;
  paidAmount: number;
  dueAmount: number;

  category: "paint" | "timber";

  createdAt: string;
}