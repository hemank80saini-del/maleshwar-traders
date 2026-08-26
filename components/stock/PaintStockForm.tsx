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

  const [productName, setProductName] =
    useState("");

  const [productCode, setProductCode] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [sellingPrice, setSellingPrice] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [stock, setStock] =
    useState<Stock[]>([]);


  /*
    LOAD STOCK
  */

  useEffect(() => {

    loadStock();

  }, []);


  function loadStock() {

    const data =
      getStock().filter(
        (item) =>
          item.category === "paint"
      );

    setStock(data);
  }


  /*
    CLEAR FORM
  */

  function clearForm() {

    setProductName("");

    setProductCode("");

    setBrand("");

    setQuantity("");

    setPrice("");

    setSellingPrice("");

    setEditingId(null);
  }


  /*
    SAVE / UPDATE PAINT
  */

  function saveItem() {

    if (
      productName.trim() === "" ||
      productCode.trim() === "" ||
      brand.trim() === "" ||
      quantity.trim() === "" ||
      price.trim() === "" ||
      sellingPrice.trim() === ""
    ) {

      alert(
        "Please fill all fields"
      );

      return;
    }


    const quantityValue =
      Number(quantity);

    const priceValue =
      Number(price);

    const sellingPriceValue =
      Number(sellingPrice);


    if (
      quantityValue < 0 ||
      priceValue < 0 ||
      sellingPriceValue < 0
    ) {

      alert(
        "Price and quantity cannot be negative."
      );

      return;
    }


    const item: Stock = {

      id:
        editingId ??
        uuid(),

      category:
        "paint",

      productName:
        productName.trim(),

      productCode:
        productCode.trim(),

      brand:
        brand.trim(),

      quantity:
        quantityValue,

      price:
        priceValue,

      sellingPrice:
        sellingPriceValue,

      createdAt:
        new Date().toLocaleString(),

    };


    /*
      UPDATE
    */

    if (editingId) {

      updateStock(item);

      alert(
        "Paint Updated Successfully!"
      );

    } else {

      addStock(item);

      alert(
        "Paint Added Successfully!"
      );

    }


    loadStock();

    clearForm();
  }


  /*
    EDIT PAINT
  */

  function editItem(
    item: Stock
  ) {

    setEditingId(
      item.id
    );

    setProductName(
      item.productName
    );

    setProductCode(
      item.productCode
    );

    setBrand(
      item.brand
    );

    setQuantity(
      item.quantity.toString()
    );

    setPrice(
      item.price.toString()
    );

    setSellingPrice(
      item.sellingPrice.toString()
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  /*
    DELETE PAINT
  */

  function removeItem(
    id: string
  ) {

    if (
      !confirm(
        "Delete this paint?"
      )
    ) {

      return;
    }

    deleteStock(id);

    loadStock();
  }


  return (

    <div className="bg-[#1e293b] rounded-2xl shadow-2xl border border-green-700 p-8">


      {/* TITLE */}

      <h2 className="text-4xl font-bold text-green-400 mb-8">

        Paint Stock Management

      </h2>


      {/* FORM */}

      <div className="grid md:grid-cols-2 gap-5">


        {/* PAINT NAME */}

        <input
          type="text"
          placeholder="Paint Name"
          value={productName}
          onChange={(e) =>
            setProductName(
              e.target.value
            )
          }
          className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
        />


        {/* SHADE CODE */}

        <input
          type="text"
          placeholder="Shade Code"
          value={productCode}
          onChange={(e) =>
            setProductCode(
              e.target.value
            )
          }
          className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
        />


        {/* BRAND */}

        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) =>
            setBrand(
              e.target.value
            )
          }
          className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
        />


        {/* QUANTITY */}

        <input
          type="number"
          placeholder="Available Quantity"
          value={quantity}
          min="0"
          onChange={(e) =>
            setQuantity(
              e.target.value
            )
          }
          className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
        />


        {/* PRICE */}

        <input
          type="number"
          placeholder="Price"
          value={price}
          min="0"
          onChange={(e) =>
            setPrice(
              e.target.value
            )
          }
          className="p-4 rounded-xl bg-slate-800 border border-orange-500 text-white"
        />


        {/* SELLING PRICE */}

        <input
          type="number"
          placeholder="Selling Price"
          value={sellingPrice}
          min="0"
          onChange={(e) =>
            setSellingPrice(
              e.target.value
            )
          }
          className="p-4 rounded-xl bg-slate-800 border border-green-500 text-white"
        />

      </div>


      {/* BUTTONS */}

      <div className="flex gap-4 mt-6">


        <button
          type="button"
          onClick={saveItem}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl"
        >

          {editingId
            ? "Update Paint"
            : "Add Paint"}

        </button>


        <button
          type="button"
          onClick={clearForm}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl"
        >

          Clear

        </button>

      </div>


      {/* STOCK TABLE */}

      <PaintStockTable
        stock={stock}
        onEdit={editItem}
        onDelete={removeItem}
      />

    </div>

  );
}