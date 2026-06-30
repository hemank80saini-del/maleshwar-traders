"use client";

import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import { Customer } from "@/types/customer";
import {
  addCustomer,
  getCustomers,
  deleteCustomer,
  updateCustomer,
} from "@/lib/storage";

import CustomerTable from "@/components/tables/CustomerTable";

export default function TimbersPage() {
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");

  const [timberName, setTimberName] = useState("");
  const [timberCode, setTimberCode] = useState("");

  const [quantity, setQuantity] = useState("");

  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");

  const [customers, setCustomers] = useState<Customer[]>([]);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const dueAmount =
    (Number(totalAmount) || 0) -
    (Number(paidAmount) || 0);

  useEffect(() => {
    loadCustomers();
  }, []);

  function loadCustomers() {
    const data = getCustomers().filter(
      (item) => item.category === "timber"
    );

    setCustomers(data);
  }

  function clearForm() {
    setCustomerName("");
    setContact("");
    setTimberName("");
    setTimberCode("");
    setQuantity("");
    setTotalAmount("");
    setPaidAmount("");
    setEditingId(null);
  }

  function saveCustomer() {
    if (
      customerName.trim() === "" ||
      contact.trim() === "" ||
      timberName.trim() === "" ||
      timberCode.trim() === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    const customer: Customer = {
      id: editingId ?? uuid(),

      category: "timber",

      customerName,
      contact,

      productName: timberName,
      productCode: timberCode,

      quantity: Number(quantity),

      totalAmount: Number(totalAmount),
      paidAmount: Number(paidAmount),
      dueAmount,

      createdAt: new Date().toLocaleString(),
    };

    if (editingId) {
      updateCustomer(customer);
    } else {
      addCustomer(customer);
    }

    loadCustomers();
    clearForm();
  }

  function removeCustomer(id: string) {
    if (!confirm("Delete this customer?")) return;

    deleteCustomer(id);

    loadCustomers();
  }

  function editCustomer(customer: Customer) {
    setEditingId(customer.id);

    setCustomerName(customer.customerName);
    setContact(customer.contact);

    setTimberName(customer.productName);
    setTimberCode(customer.productCode);

    setQuantity(customer.quantity?.toString() || "");

    setTotalAmount(customer.totalAmount.toString());
    setPaidAmount(customer.paidAmount.toString());
  }

  const filteredCustomers = customers.filter((customer) => {
    const value = search.toLowerCase();

    return (
      customer.customerName.toLowerCase().includes(value) ||
      customer.contact.includes(value) ||
      customer.productName.toLowerCase().includes(value) ||
      customer.productCode.toLowerCase().includes(value)
    );
  });

  return (
        <div className="min-h-screen bg-[#0f172a] py-10 px-4">
      <div className="max-w-6xl mx-auto bg-[#1e293b] rounded-2xl shadow-2xl border border-green-700 p-8">

        <h1 className="text-5xl font-bold text-green-400 text-center mb-10">
          Timbers
        </h1>

        <div className="grid md:grid-cols-2 gap-5">

          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
          />

          <input
            type="text"
            placeholder="Contact Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
          />

          <input
            type="text"
            placeholder="Timber Name"
            value={timberName}
            onChange={(e) => setTimberName(e.target.value)}
            className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
          />

          <input
            type="text"
            placeholder="Timber Size / Code"
            value={timberCode}
            onChange={(e) => setTimberCode(e.target.value)}
            className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
          />

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
          />

          <input
            type="number"
            placeholder="Total Amount"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
          />

          <input
            type="number"
            placeholder="Amount Paid"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
          />

        </div>

        <div className="mt-5">

          <input
            readOnly
            value={`Due Amount : ₹ ${dueAmount}`}
            className="w-full p-4 rounded-xl bg-slate-900 border border-yellow-500 text-yellow-400 font-bold"
          />

        </div>

        <div className="mt-6 flex gap-4">

          <button
            onClick={saveCustomer}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl"
          >
            {editingId ? "Update Customer" : "Save Customer"}
          </button>

          <button
            onClick={clearForm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl"
          >
            Clear
          </button>

        </div>

        <div className="mt-8">

          <input
            type="text"
            placeholder="Search Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-800 border border-blue-500 text-white"
          />

        </div>

        <CustomerTable
          customers={filteredCustomers}
          onDelete={removeCustomer}
          onEdit={editCustomer}
        />

      </div>
    </div>
  );
}