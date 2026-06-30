import { Customer } from "@/types/customer";

const STORAGE_KEY = "maleshwar_customers";

// Get all customers
export const getCustomers = (): Customer[] => {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Save all customers
export const saveCustomers = (customers: Customer[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
};

// Add new customer
export const addCustomer = (customer: Customer) => {
  const customers = getCustomers();
  customers.push(customer);
  saveCustomers(customers);
};

// Delete customer
export const deleteCustomer = (id: string) => {
  const customers = getCustomers().filter(
    (customer) => customer.id !== id
  );

  saveCustomers(customers);
};

// Update customer
export const updateCustomer = (updatedCustomer: Customer) => {
  const customers = getCustomers().map((customer) =>
    customer.id === updatedCustomer.id ? updatedCustomer : customer
  );

  saveCustomers(customers);
};