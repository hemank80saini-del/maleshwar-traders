import { Customer } from "@/types/customer";

const STORAGE_KEY = "maleshwar_customers";

export function getCustomers(): Customer[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : [];
}

export function saveCustomers(customers: Customer[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

export function addCustomer(customer: Customer) {
  const customers = getCustomers();

  customers.unshift(customer);

  saveCustomers(customers);
}

export function deleteCustomer(id: string) {
  const customers = getCustomers().filter(
    (customer) => customer.id !== id
  );

  saveCustomers(customers);
}

export function updateCustomer(updated: Customer) {
  const customers = getCustomers().map((customer) =>
    customer.id === updated.id ? updated : customer
  );

  saveCustomers(customers);
}