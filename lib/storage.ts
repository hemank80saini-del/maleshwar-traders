import { Customer } from "@/types/customer";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type CustomerRow = {
  id: string;
  category: Customer["category"];
  customer_name: string;
  contact: string;
  product_name: string;
  product_code: string;
  quantity: number | null;
  quantity_sold: number | null;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  created_at: string;
  accessories: Customer["accessories"];
  paints: Customer["paints"];
  enamels: Customer["enamels"];
  pending_hidden: boolean;
  pending_cleared: boolean;
  pop_channel: string | null;
  pop_price: number | null;
  pop_quantity: number | null;
  pop_name: string | null;
  channel_price: number | null;
  channel_quantity: number | null;
};

function rowToCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    category: row.category,
    customerName: row.customer_name,
    contact: row.contact,
    productName: row.product_name,
    productCode: row.product_code,
    quantity: row.quantity ?? undefined,
    quantitySold: row.quantity_sold ?? undefined,
    totalAmount: row.total_amount,
    paidAmount: row.paid_amount,
    dueAmount: row.due_amount,
    createdAt: row.created_at,
    accessories: row.accessories ?? [],
    paints: row.paints ?? [],
    enamels: row.enamels ?? [],
    pendingHidden: row.pending_hidden,
    pendingCleared: row.pending_cleared,
    popChannel: row.pop_channel ?? undefined,
    popPrice: row.pop_price ?? undefined,
    popQuantity: row.pop_quantity ?? undefined,
    popName: row.pop_name ?? undefined,
    channelPrice: row.channel_price ?? undefined,
    channelQuantity: row.channel_quantity ?? undefined,
  };
}

function customerToRow(customer: Customer) {
  return {
    id: customer.id,
    category: customer.category,
    customer_name: customer.customerName,
    contact: customer.contact,
    product_name: customer.productName,
    product_code: customer.productCode,
    quantity: customer.quantity ?? null,
    quantity_sold: customer.quantitySold ?? null,
    total_amount: customer.totalAmount,
    paid_amount: customer.paidAmount,
    due_amount: customer.dueAmount,
    created_at: customer.createdAt,
    accessories: customer.accessories ?? [],
    paints: customer.paints ?? [],
    enamels: customer.enamels ?? [],
    pending_hidden: customer.pendingHidden ?? false,
    pending_cleared: customer.pendingCleared ?? false,
    pop_channel: customer.popChannel ?? null,
    pop_price: customer.popPrice ?? null,
    pop_quantity: customer.popQuantity ?? null,
    pop_name: customer.popName ?? null,
    channel_price: customer.channelPrice ?? null,
    channel_quantity: customer.channelQuantity ?? null,
  };
}

/* =====================================================
   GET CUSTOMERS
===================================================== */

export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching customers:", error);
    return [];
  }

  return (data as CustomerRow[]).map(rowToCustomer);
}

/* =====================================================
   SAVE CUSTOMERS
===================================================== */

export async function saveCustomers(customers: Customer[]) {
  if (customers.length === 0) {
    return;
  }

  const rows = customers.map(customerToRow);

  const { error } = await supabase
    .from("customers")
    .upsert(rows, {
      onConflict: "id",
    });

  if (error) {
    console.error("Error saving customers:", error);
    throw error;
  }
}

/* =====================================================
   ADD CUSTOMER
===================================================== */

export async function addCustomer(customer: Customer) {
  const row = customerToRow(customer);

  const { error } = await supabase
    .from("customers")
    .insert(row);

  if (error) {
    console.error("Error adding customer:", error);
    throw error;
  }
}

/* =====================================================
   DELETE CUSTOMER
===================================================== */

export async function deleteCustomer(id: string) {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
}

/* =====================================================
   UPDATE CUSTOMER
===================================================== */

export async function updateCustomer(updated: Customer) {
  const row = customerToRow(updated);

  const { error } = await supabase
    .from("customers")
    .update(row)
    .eq("id", updated.id);

  if (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
}