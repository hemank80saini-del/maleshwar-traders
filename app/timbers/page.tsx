"use client";

import { useState } from "react";

export default function TimbersPage() {
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [timberName, setTimberName] = useState("");
  const [timberCode, setTimberCode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");

  const dueAmount =
    (Number(totalAmount) || 0) - (Number(paidAmount) || 0);

  return (
    <div className="min-h-screen bg-[#0f172a] py-10 px-4">
      <div className="max-w-5xl mx-auto bg-[#1e293b] rounded-2xl shadow-2xl border border-green-700 p-8">

        <h1 className="text-5xl font-bold text-green-400 text-center mb-10">
          Timbers
        </h1>

        <div className="grid gap-5">

          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-800 border border-green-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="text"
            placeholder="Contact Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-800 border border-green-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="text"
            placeholder="Timber Name"
            value={timberName}
            onChange={(e) => setTimberName(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-800 border border-green-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="text"
            placeholder="Timber Size / Code"
            value={timberCode}
            onChange={(e) => setTimberCode(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-800 border border-green-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-800 border border-green-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="number"
            placeholder="Total Amount"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-800 border border-green-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="number"
            placeholder="Amount Paid"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-800 border border-green-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="text"
            value={`Due Amount : ₹ ${dueAmount}`}
            readOnly
            className="w-full p-4 rounded-xl bg-slate-900 border border-yellow-500 text-yellow-400 font-bold"
          />

          <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition">
            Save Customer
          </button>

        </div>

      </div>
    </div>
  );
}