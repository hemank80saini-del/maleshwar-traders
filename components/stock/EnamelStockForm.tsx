"use client";

import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import {
  Stock,
  StockUnit,
  StockVariant,
} from "@/types/stock";

import {
  addStock,
  getStock,
  updateStock,
  deleteStock,
} from "@/lib/stockStorage";


export default function EnamelStockForm() {

  const [productName, setProductName] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [size, setSize] =
    useState("");

  const [unit, setUnit] =
    useState<StockUnit>("liter");

  const [price, setPrice] =
    useState("");

  const [sellingPrice, setSellingPrice] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [variants, setVariants] =
    useState<StockVariant[]>([]);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [stock, setStock] =
    useState<Stock[]>([]);


  /* =====================================================
     LOAD ENAMEL STOCK
  ===================================================== */

  useEffect(() => {

    loadStock();

  }, []);


  function loadStock() {

    const data =
      getStock().filter(
        (item) =>
          item.category === "enamel"
      );

    setStock(data);
  }


  /* =====================================================
     CLEAR FORM
  ===================================================== */

  function clearForm() {

    setProductName("");

    setBrand("");

    setSize("");

    setUnit("liter");

    setPrice("");

    setSellingPrice("");

    setQuantity("");

    setVariants([]);

    setEditingId(null);
  }


  /* =====================================================
     ADD SIZE
  ===================================================== */

  function addVariant() {

    const sizeValue =
      Number(size);

    const priceValue =
      Number(price);

    const sellingValue =
      Number(sellingPrice);

    const quantityValue =
      Number(quantity);


    if (
      !size ||
      sizeValue <= 0
    ) {

      alert(
        "Please enter a valid size."
      );

      return;
    }


    if (
      price === "" ||
      priceValue < 0
    ) {

      alert(
        "Please enter actual price."
      );

      return;
    }


    if (
      sellingPrice === "" ||
      sellingValue < 0
    ) {

      alert(
        "Please enter selling price."
      );

      return;
    }


    if (
      quantity === "" ||
      quantityValue < 0
    ) {

      alert(
        "Please enter stock quantity."
      );

      return;
    }


    const alreadyExists =
      variants.some(
        (item) =>
          item.size === sizeValue &&
          item.unit === unit
      );


    if (alreadyExists) {

      alert(
        "This size already exists for this enamel."
      );

      return;
    }


    const newVariant: StockVariant = {

      id: uuid(),

      size:
        sizeValue,

      unit,

      price:
        priceValue,

      sellingPrice:
        sellingValue,

      quantity:
        quantityValue,
    };


    setVariants([
      ...variants,
      newVariant,
    ]);


    setSize("");

    setPrice("");

    setSellingPrice("");

    setQuantity("");
  }


  /* =====================================================
     REMOVE SIZE
  ===================================================== */

  function removeVariant(
    id: string
  ) {

    setVariants(
      variants.filter(
        (item) =>
          item.id !== id
      )
    );
  }


  /* =====================================================
     SAVE ENAMEL
  ===================================================== */

  function saveItem() {

    if (
      productName.trim() === ""
    ) {

      alert(
        "Please enter Enamel Name."
      );

      return;
    }


    if (
      brand.trim() === ""
    ) {

      alert(
        "Please enter Brand."
      );

      return;
    }


    if (
      variants.length === 0
    ) {

      alert(
        "Please add at least one size."
      );

      return;
    }


    const totalQuantity =
      variants.reduce(
        (sum, item) =>
          sum + item.quantity,
        0
      );


    const firstVariant =
      variants[0];


    const item: Stock = {

      id:
        editingId ??
        uuid(),

      category:
        "enamel",

      productName:
        productName.trim(),

      /*
        Enamel me Shade Code nahi hai.
        Isliye productCode blank rahega.
      */

      productCode:
        "",

      brand:
        brand.trim(),

      /*
        Compatibility fields
      */

      price:
        firstVariant.price,

      sellingPrice:
        firstVariant.sellingPrice,

      quantity:
        totalQuantity,

      /*
        Size-wise data
      */

      variants,

      createdAt:
        new Date().toLocaleString(),
    };


    if (editingId) {

      updateStock(item);

      alert(
        "Enamel Updated Successfully!"
      );

    } else {

      addStock(item);

      alert(
        "Enamel Added Successfully!"
      );
    }


    loadStock();

    clearForm();
  }


  /* =====================================================
     EDIT
  ===================================================== */

  function editItem(
    item: Stock
  ) {

    setEditingId(
      item.id
    );

    setProductName(
      item.productName
    );

    setBrand(
      item.brand
    );


    if (
      item.variants &&
      item.variants.length > 0
    ) {

      setVariants(
        item.variants
      );

    } else {

      /*
        Old stock compatibility
      */

      setVariants([
        {
          id:
            `${item.id}-old`,

          size:
            1,

          unit:
            "liter",

          price:
            item.price,

          sellingPrice:
            item.sellingPrice,

          quantity:
            item.quantity,
        },
      ]);
    }


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  /* =====================================================
     DELETE
  ===================================================== */

  function removeItem(
    id: string
  ) {

    if (
      !confirm(
        "Delete this enamel?"
      )
    ) {

      return;
    }


    deleteStock(id);

    loadStock();
  }


  return (

    <div className="mt-8 bg-[#1e293b] rounded-2xl shadow-2xl border border-red-700 p-8">


      {/* =================================================
          TITLE
      ================================================= */}

      <h2 className="text-4xl font-bold text-red-400 mb-8">

        Enamel Stock Management

      </h2>


      {/* =================================================
          BASIC DETAILS
      ================================================= */}

      <div className="grid md:grid-cols-2 gap-5">


        {/* ENAMEL NAME */}

        <input
          type="text"
          placeholder="Enamel Name"
          value={productName}
          onChange={(e) =>
            setProductName(
              e.target.value
            )
          }
          className="p-4 rounded-xl bg-slate-800 border border-red-600 text-white"
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
          className="p-4 rounded-xl bg-slate-800 border border-red-600 text-white"
        />

      </div>


      {/* =================================================
          SIZE / PRICE / STOCK
      ================================================= */}

      <div className="mt-6 bg-slate-900 rounded-xl border border-orange-500 p-5">


        <h3 className="text-xl font-bold text-orange-400 mb-5">

          Enamel Size / Price / Stock

        </h3>


        <div className="grid md:grid-cols-5 gap-4">


          {/* SIZE */}

          <input
            type="number"
            min="0"
            step="any"
            placeholder="Size e.g. 1 / 5 / 500"
            value={size}
            onChange={(e) =>
              setSize(
                e.target.value
              )
            }
            className="p-4 rounded-xl bg-slate-800 border border-cyan-500 text-white"
          />


          {/* UNIT */}

          <select
            value={unit}
            onChange={(e) =>
              setUnit(
                e.target.value as StockUnit
              )
            }
            className="p-4 rounded-xl bg-slate-800 border border-cyan-500 text-white"
          >

            <option value="liter">
              Ltr
            </option>

            <option value="gm">
              Gram
            </option>

          </select>


          {/* ACTUAL PRICE */}

          <input
            type="number"
            min="0"
            step="any"
            placeholder="Actual Price"
            value={price}
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
            min="0"
            step="any"
            placeholder="Selling Price"
            value={sellingPrice}
            onChange={(e) =>
              setSellingPrice(
                e.target.value
              )
            }
            className="p-4 rounded-xl bg-slate-800 border border-green-500 text-white"
          />


          {/* STOCK QUANTITY */}

          <input
            type="number"
            min="0"
            step="any"
            placeholder="Stock Quantity"
            value={quantity}
            onChange={(e) =>
              setQuantity(
                e.target.value
              )
            }
            className="p-4 rounded-xl bg-slate-800 border border-purple-500 text-white"
          />

        </div>


        {/* ADD SIZE */}

        <button
          type="button"
          onClick={addVariant}
          className="mt-5 bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-3 rounded-xl"
        >

          + Add Size

        </button>


        {/* =================================================
            ADDED SIZES
        ================================================= */}

        {variants.length > 0 && (

          <div className="mt-6 space-y-3">


            <h4 className="text-lg font-bold text-yellow-400">

              Added Enamel Sizes

            </h4>


            {variants.map(
              (variant) => (

                <div
                  key={variant.id}
                  className="flex flex-wrap items-center justify-between gap-4 bg-slate-800 border border-slate-700 rounded-xl p-4"
                >


                  <span className="text-cyan-400 font-bold">

                    {variant.size}{" "}

                    {variant.unit ===
                    "liter"
                      ? "Ltr"
                      : "Gram"}

                  </span>


                  <span className="text-orange-400">

                    Actual ₹
                    {variant.price}

                  </span>


                  <span className="text-green-400">

                    Selling ₹
                    {variant.sellingPrice}

                  </span>


                  <span className="text-purple-400">

                    Stock{" "}
                    {variant.quantity}

                  </span>


                  <button
                    type="button"
                    onClick={() =>
                      removeVariant(
                        variant.id
                      )
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >

                    Remove

                  </button>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="flex gap-4 mt-6">


        <button
          type="button"
          onClick={saveItem}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl"
        >

          {editingId
            ? "Update Enamel"
            : "Add Enamel"}

        </button>


        <button
          type="button"
          onClick={clearForm}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl"
        >

          Clear

        </button>

      </div>


      {/* =================================================
          ENAMEL TABLE
      ================================================= */}

      <div className="overflow-x-auto mt-8 rounded-xl border border-slate-700">

        <table className="w-full">

          <thead className="bg-red-700 text-white">

            <tr>

              <th className="p-3">
                Enamel
              </th>

              <th className="p-3">
                Brand
              </th>

              <th className="p-3">
                Size
              </th>

              <th className="p-3">
                Actual Price
              </th>

              <th className="p-3">
                Selling Price
              </th>

              <th className="p-3">
                Stock
              </th>

              <th className="p-3">
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {stock.map(
              (item) => {

                if (
                  item.variants &&
                  item.variants.length > 0
                ) {

                  return item.variants.map(
                    (variant, index) => (

                      <tr
                        key={`${item.id}-${variant.id}`}
                        className="border-b border-slate-700 text-center text-white"
                      >

                        <td className="p-3 font-bold">

                          {index === 0
                            ? item.productName
                            : ""}

                        </td>


                        <td className="p-3">

                          {index === 0
                            ? item.brand
                            : ""}

                        </td>


                        <td className="p-3 text-cyan-400 font-bold">

                          {variant.size}{" "}

                          {variant.unit ===
                          "liter"
                            ? "Ltr"
                            : "Gram"}

                        </td>


                        <td className="p-3 text-orange-400">

                          ₹ {variant.price}

                        </td>


                        <td className="p-3 text-green-400">

                          ₹ {variant.sellingPrice}

                        </td>


                        <td
                          className={`p-3 font-bold ${
                            variant.quantity <= 5
                              ? "text-red-500"
                              : "text-purple-400"
                          }`}
                        >

                          {variant.quantity}

                        </td>


                        <td className="p-3">

                          {index === 0 && (

                            <>

                              <button
                                onClick={() =>
                                  editItem(item)
                                }
                                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mr-2"
                              >
                                Edit
                              </button>


                              <button
                                onClick={() =>
                                  removeItem(
                                    item.id
                                  )
                                }
                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                              >
                                Delete
                              </button>

                            </>

                          )}

                        </td>

                      </tr>

                    )
                  );
                }


                return null;
              }
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}