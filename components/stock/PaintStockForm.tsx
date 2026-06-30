"use client";

import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import { Stock } from "@/types/stock";
import {
  addStock,
  getStock,
  updateStock,
  deleteStock,
} from "@/lib/stockStorage";

import PaintStockTable from "./PaintStockTable";

export default function PaintStockForm() {
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [brand, setBrand] = useState("");

  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [stock, setStock] = useState<Stock[]>([]);

  useEffect(() => {
    loadStock();
  }, []);

  function loadStock() {
    const data = getStock().filter(
      (item) => item.category === "paint"
    );

    setStock(data);
  }

  function clearForm() {
    setProductName("");
    setProductCode("");
    setBrand("");
    setQuantity("");
    setPrice("");
    setEditingId(null);
  }

  function saveItem() {
    if (
      productName.trim() === "" ||
      productCode.trim() === "" ||
      brand.trim() === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    const item: Stock = {
      id: editingId ?? uuid(),

      category: "paint",

      productName,
      productCode,

      brand,

      quantity: Number(quantity),

      price: Number(price),

      createdAt: new Date().toLocaleString(),
    };
        if (editingId) {
      updateStock(item);
    } else {
      addStock(item);
    }

    loadStock();
    clearForm();
  }

  function editItem(item: Stock) {
    setEditingId(item.id);

    setProductName(item.productName);
    setProductCode(item.productCode);
    setBrand(item.brand);
    setQuantity(item.quantity.toString());
    setPrice(item.price.toString());
  }

  function removeItem(id: string) {
    if (!confirm("Delete this paint?")) return;

    deleteStock(id);

    loadStock();
  }

  return (
    <div className="bg-[#1e293b] rounded-2xl shadow-2xl border border-green-700 p-8">

      <h2 className="text-4xl font-bold text-green-400 mb-8">
        Paint Stock Management
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <input
          type="text"
          placeholder="Paint Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
        />

        <input
          type="text"
          placeholder="Shade Code"
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
          className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
        />

        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
        />

        <input
          type="number"
          placeholder="Available Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
        />

      </div>

      <div className="flex gap-4 mt-6">

        <button
          onClick={saveItem}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl"
        >
          {editingId ? "Update Paint" : "Add Paint"}
        </button>

        <button
          onClick={clearForm}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl"
        >
          Clear
        </button>

      </div>

      <PaintStockTable
        stock={stock}
        onEdit={editItem}
        onDelete={removeItem}
      />

    </div>
  );
}