export interface Customer {
  id: string;

  category: "paint" | "timber";

  customerName: string;
  contact: string;

  productName: string;
  productCode: string;

  quantity?: number;

  totalAmount: number;
  paidAmount: number;
  dueAmount: number;

  createdAt: string;
}