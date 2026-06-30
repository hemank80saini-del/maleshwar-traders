"use client";

import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import CustomerTable from "@/components/tables/CustomerTable";

import {
  addCustomer,
  getCustomers,
  deleteCustomer,
  updateCustomer,
} from "@/lib/storage";

import {
  getPaintStock,
  reduceStock,
} from "@/lib/stockStorage";

import { Customer } from "@/types/customer";
import { Stock } from "@/types/stock";

export default function PaintsPage() {

  const [customerName, setCustomerName] =
    useState("");

  const [contact, setContact] =
    useState("");

  const [paintName, setPaintName] =
    useState("");

  const [paintNo, setPaintNo] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [availableStock, setAvailableStock] =
    useState(0);

  const [quantitySold, setQuantitySold] =
    useState("");

  const [totalAmount, setTotalAmount] =
    useState("");

  const [paidAmount, setPaidAmount] =
    useState("");

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [paintStock, setPaintStock] =
    useState<Stock[]>([]);

  const [search, setSearch] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const dueAmount =
    (Number(totalAmount) || 0) -
    (Number(paidAmount) || 0);

  useEffect(() => {

  loadCustomers();

  const data = localStorage.getItem("editCustomer");

  if (!data) return;

  const customer = JSON.parse(data);

  setEditingId(customer.id);

  setCustomerName(customer.customerName);

  setContact(customer.contact);

  setPaintName(customer.productName);

  setPaintNo(customer.productCode);
  const stockItem = getPaintStock().find(
  (item) => item.productName === customer.productName
);

if (stockItem) {

  setBrand(stockItem.brand);

  setPrice(stockItem.price.toString());

  setAvailableStock(stockItem.quantity);

}

  setTotalAmount(customer.totalAmount.toString());

  setPaidAmount(customer.paidAmount.toString());

  localStorage.removeItem("editCustomer");

}, []);
    function loadCustomers() {

    const customerData = getCustomers().filter(
      (item) => item.category === "paint"
    );

    const stockData = getPaintStock();

    setCustomers(customerData);

    setPaintStock(stockData);

  }

  function clearForm() {

    setCustomerName("");

    setContact("");

    setPaintName("");

    setPaintNo("");

    setBrand("");

    setPrice("");

    setAvailableStock(0);

    setQuantitySold("");

    setTotalAmount("");

    setPaidAmount("");

    setEditingId(null);

  }

  function calculateTotal(qty: string, itemPrice: string) {

    if (!qty || !itemPrice) {

      setTotalAmount("");

      return;

    }

    const total =
      Number(qty) * Number(itemPrice);

    setTotalAmount(total.toString());

  }
    function saveCustomer() {

    if (
      customerName.trim() === "" ||
      contact.trim() === "" ||
      paintName.trim() === "" ||
      quantitySold.trim() === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    const stockItem = paintStock.find(
      (item) => item.productName === paintName
    );

    if (!stockItem) {
      alert("Paint not found.");
      return;
    }

    if (Number(quantitySold) > stockItem.quantity) {
      alert("Not enough stock available.");
      return;
    }

    const customer: Customer = {

      id: editingId ?? uuid(),

      category: "paint",

      customerName,

      contact,

      productName: paintName,

      productCode: paintNo,

      totalAmount: Number(totalAmount),

      paidAmount: Number(paidAmount),

      dueAmount,

      createdAt: new Date().toLocaleString(),

    };

    if (editingId) {

      updateCustomer(customer);

    } else {

      addCustomer(customer);

      reduceStock(
        paintName,
        Number(quantitySold)
      );

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

    setPaintName(customer.productName);

    setPaintNo(customer.productCode);

    const stockItem = paintStock.find(
      (item) => item.productName === customer.productName
    );

    if (stockItem) {

      setBrand(stockItem.brand);

      setPrice(stockItem.price.toString());

      setAvailableStock(stockItem.quantity);

    }

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
      Premium Paints
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

      <select
        value={paintName}
        onChange={(e) => {

          const value = e.target.value;

          setPaintName(value);

          const selected = paintStock.find(
            (item) => item.productName === value
          );

          if (selected) {

            setPaintNo(selected.productCode);

            setBrand(selected.brand);

            setPrice(selected.price.toString());

            setAvailableStock(selected.quantity);

            calculateTotal(
              quantitySold,
              selected.price.toString()
            );

          }

        }}
        className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
      >

        <option value="">
          Select Paint
        </option>

        {paintStock.map((item) => (

          <option
            key={item.id}
            value={item.productName}
          >
            {item.productName} ({item.quantity} Left)
          </option>

        ))}

      </select>

      <input
        type="text"
        value={paintNo}
        readOnly
        placeholder="Shade Code"
        className="p-4 rounded-xl bg-slate-900 border border-yellow-500 text-yellow-400"
      />
            <input
        type="text"
        value={brand}
        readOnly
        placeholder="Brand"
        className="p-4 rounded-xl bg-slate-900 border border-blue-500 text-blue-400"
      />

      <input
        type="text"
        value={price}
        readOnly
        placeholder="Price Per Unit"
        className="p-4 rounded-xl bg-slate-900 border border-green-500 text-green-400"
      />

      <input
        type="text"
        value={`${availableStock} Available`}
        readOnly
        className="p-4 rounded-xl bg-slate-900 border border-purple-500 text-purple-400 font-bold"
      />

      <input
        type="number"
        placeholder="Quantity Sold"
        value={quantitySold}
        onChange={(e) => {

          const qty = e.target.value;

          setQuantitySold(qty);

          calculateTotal(qty, price);

        }}
        className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
      />

      <input
        type="number"
        placeholder="Total Amount"
        value={totalAmount}
        readOnly
        className="p-4 rounded-xl bg-slate-900 border border-orange-500 text-orange-400 font-bold"
      />

      <input
        type="number"
        placeholder="Amount Paid"
        value={paidAmount}
        onChange={(e) => setPaidAmount(e.target.value)}
        className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
      />

    </div>
        <div className="mt-6">

      <input
        type="text"
        value={`Due Amount : ₹ ${dueAmount}`}
        readOnly
        className="w-full p-4 rounded-xl bg-slate-900 border border-yellow-500 text-yellow-400 font-bold"
      />

    </div>

    {availableStock === 0 && (

      <div className="mt-4 bg-red-700 text-white p-4 rounded-xl font-bold text-center">

        ❌ OUT OF STOCK

      </div>

    )}

    {availableStock > 0 && availableStock <= 5 && (

      <div className="mt-4 bg-yellow-500 text-black p-4 rounded-xl font-bold text-center">

        ⚠️ LOW STOCK ({availableStock} Left)

      </div>

    )}

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