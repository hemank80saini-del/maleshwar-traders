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
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");

  const [size, setSize] = useState("");
  const [unit, setUnit] =
    useState<StockUnit>("liter");

  const [price, setPrice] = useState("");
  const [sellingPrice, setSellingPrice] =
    useState("");

  const [quantity, setQuantity] = useState("");

  const [variants, setVariants] =
    useState<StockVariant[]>([]);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editingVariantId, setEditingVariantId] =
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
    const data = getStock().filter(
      (item) =>
        item.category === "enamel"
    );

    setStock(data);
  }

  /* =====================================================
     CLEAR VARIANT FORM
  ===================================================== */

  function clearVariantForm() {
    setSize("");
    setUnit("liter");
    setPrice("");
    setSellingPrice("");
    setQuantity("");
    setEditingVariantId(null);
  }

  /* =====================================================
     CLEAR COMPLETE FORM
  ===================================================== */

  function clearForm() {
    setProductName("");
    setBrand("");

    clearVariantForm();

    setVariants([]);
    setEditingId(null);
  }

  /* =====================================================
     ADD / UPDATE VARIANT
  ===================================================== */

  function addVariant() {
    const sizeValue = Number(size);
    const priceValue = Number(price);
    const sellingValue =
      Number(sellingPrice);

    const quantityValue =
      Number(quantity);

    /* ---------------------------------------------
       VALIDATION
    --------------------------------------------- */

    if (!size || sizeValue <= 0) {
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
        editingVariantId
          ? "Please enter additional stock."
          : "Please enter stock quantity."
      );
      return;
    }

    /* =================================================
       UPDATE SPECIFIC VARIANT
    ================================================= */

    if (editingVariantId) {
      const oldVariant =
        variants.find(
          (item) =>
            item.id ===
            editingVariantId
        );

      if (!oldVariant) {
        alert("Size not found.");
        return;
      }

      /* ---------------------------------------------
         DUPLICATE SIZE CHECK
      --------------------------------------------- */

      const duplicate =
        variants.some(
          (item) =>
            item.id !==
              editingVariantId &&
            item.size === sizeValue &&
            item.unit === unit
        );

      if (duplicate) {
        alert(
          "This size already exists for this enamel."
        );
        return;
      }

      /* ---------------------------------------------
         EXISTING STOCK + ADDITIONAL STOCK
      --------------------------------------------- */

      const updatedVariant: StockVariant = {
        ...oldVariant,

        size: sizeValue,

        unit,

        price: priceValue,

        sellingPrice:
          sellingValue,

        quantity:
          oldVariant.quantity +
          quantityValue,
      };

      /* ---------------------------------------------
         UPDATE ONLY SELECTED VARIANT
      --------------------------------------------- */

      const updatedVariants =
        variants.map(
          (item) =>
            item.id ===
            editingVariantId
              ? updatedVariant
              : item
        );

      setVariants(
        updatedVariants
      );

      /*
        Keep editing mode active until
        user presses Update Enamel.
      */

      setSize(
        String(updatedVariant.size)
      );

      setUnit(
        updatedVariant.unit
      );

      setPrice(
        String(updatedVariant.price)
      );

      setSellingPrice(
        String(
          updatedVariant.sellingPrice
        )
      );

      setQuantity("");

      setEditingVariantId(null);

      alert(
        "Enamel size updated successfully!"
      );

      return;
    }

    /* =================================================
       ADD NEW VARIANT
    ================================================= */

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

      size: sizeValue,

      unit,

      price: priceValue,

      sellingPrice:
        sellingValue,

      quantity:
        quantityValue,
    };

    setVariants([
      ...variants,
      newVariant,
    ]);

    clearVariantForm();
  }

  /* =====================================================
     EDIT SPECIFIC VARIANT FROM TABLE
  ===================================================== */

  function editVariant(
    item: Stock,
    variant: StockVariant
  ) {
    /*
      VERY IMPORTANT:

      Load the exact item's variants
      from the table item.

      This fixes:
      "Size not found"
      and
      Existing Stock: 0
    */

    setEditingId(item.id);

    setProductName(
      item.productName
    );

    setBrand(
      item.brand
    );

    /*
      Load ALL variants of this
      particular enamel.
    */

    const itemVariants =
      item.variants &&
      item.variants.length > 0
        ? item.variants
        : [variant];

    setVariants(
      itemVariants
    );

    /*
      Select exact variant
    */

    setEditingVariantId(
      variant.id
    );

    setSize(
      String(variant.size)
    );

    setUnit(
      variant.unit
    );

    setPrice(
      String(variant.price)
    );

    setSellingPrice(
      String(
        variant.sellingPrice
      )
    );

    /*
      IMPORTANT:

      Don't put existing quantity
      inside input.

      User enters only additional stock.
    */

    setQuantity("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =====================================================
     REMOVE VARIANT FROM FORM
  ===================================================== */

  function removeVariant(
    id: string
  ) {
    const updatedVariants =
      variants.filter(
        (item) =>
          item.id !== id
      );

    setVariants(
      updatedVariants
    );

    if (
      editingVariantId === id
    ) {
      clearVariantForm();
    }
  }

  /* =====================================================
     SAVE / UPDATE COMPLETE ENAMEL
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

    /* ---------------------------------------------
       TOTAL STOCK
    --------------------------------------------- */

    const totalQuantity =
      variants.reduce(
        (sum, item) =>
          sum + item.quantity,
        0
      );

    const firstVariant =
      variants[0];

    /* ---------------------------------------------
       CREATE STOCK OBJECT
    --------------------------------------------- */

    const item: Stock = {
      id:
        editingId ??
        uuid(),

      category:
        "enamel",

      productName:
        productName.trim(),

      /*
        Enamel doesn't use shade code.
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
        Size-wise variants
      */

      variants:
        variants,

      createdAt:
        new Date().toLocaleString(),
    };

    /* ---------------------------------------------
       UPDATE EXISTING ENAMEL
    --------------------------------------------- */

    if (editingId) {
      updateStock(item);

      alert(
        "Enamel Updated Successfully!"
      );
    }

    /* ---------------------------------------------
       ADD NEW ENAMEL
    --------------------------------------------- */

    else {
      addStock(item);

      alert(
        "Enamel Added Successfully!"
      );
    }

    loadStock();

    clearForm();
  }

  /* =====================================================
     EDIT COMPLETE ENAMEL
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

    setEditingVariantId(
      null
    );

    if (
      item.variants &&
      item.variants.length > 0
    ) {
      setVariants(
        item.variants
      );
    }

    else {
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
     DELETE COMPLETE ENAMEL
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

  /* =====================================================
     DISPLAY UNIT
  ===================================================== */

  function displayUnit(
    value: StockUnit
  ) {
    return value === "liter"
      ? "Ltr"
      : "Gram";
  }

  /* =====================================================
     UI
  ===================================================== */

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

          {editingVariantId
            ? "Edit Enamel Size"
            : "Enamel Size / Price / Stock"}

        </h3>

        {/* =================================================
            EDIT INFORMATION
        ================================================= */}

        {editingVariantId && (
          <div className="mb-5 bg-blue-900/40 border border-blue-500 rounded-xl p-4">

            <p className="text-blue-300 font-bold">
              Editing Existing Enamel Size
            </p>

            <p className="text-white text-sm mt-1">
              Existing stock will be kept.
              Enter only the additional
              stock you want to add.
            </p>

          </div>
        )}

        {/* =================================================
            INPUTS
        ================================================= */}

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

          {/* STOCK */}

          <input
            type="number"
            min="0"
            step="any"
            placeholder={
              editingVariantId
                ? "Additional Stock"
                : "Stock Quantity"
            }
            value={quantity}
            onChange={(e) =>
              setQuantity(
                e.target.value
              )
            }
            className="p-4 rounded-xl bg-slate-800 border border-purple-500 text-white"
          />

        </div>

        {/* =================================================
            EXISTING STOCK
        ================================================= */}

        {editingVariantId && (
          <div className="mt-4">

            <p className="text-purple-400 font-bold">

              Existing Stock:{" "}

              {
                variants.find(
                  (item) =>
                    item.id ===
                    editingVariantId
                )?.quantity ?? 0
              }

            </p>

          </div>
        )}

        {/* =================================================
            ADD / UPDATE BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={
            addVariant
          }
          className={`mt-5 ${
            editingVariantId
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-orange-600 hover:bg-orange-500"
          } text-white font-bold px-8 py-3 rounded-xl`}
        >

          {editingVariantId
            ? "Update Size"
            : "+ Add Size"}

        </button>

        {/* =================================================
            CANCEL EDIT
        ================================================= */}

        {editingVariantId && (
          <button
            type="button"
            onClick={
              clearVariantForm
            }
            className="mt-5 ml-3 bg-slate-600 hover:bg-slate-500 text-white font-bold px-8 py-3 rounded-xl"
          >
            Cancel Edit
          </button>
        )}

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
                  key={
                    variant.id
                  }
                  className={`flex flex-wrap items-center justify-between gap-4 bg-slate-800 border rounded-xl p-4 ${
                    editingVariantId ===
                    variant.id
                      ? "border-blue-500"
                      : "border-slate-700"
                  }`}
                >

                  {/* SIZE */}

                  <span className="text-cyan-400 font-bold">

                    {variant.size}{" "}

                    {displayUnit(
                      variant.unit
                    )}

                  </span>

                  {/* ACTUAL PRICE */}

                  <span className="text-orange-400">

                    Actual ₹
                    {
                      variant.price
                    }

                  </span>

                  {/* SELLING PRICE */}

                  <span className="text-green-400">

                    Selling ₹
                    {
                      variant.sellingPrice
                    }

                  </span>

                  {/* STOCK */}

                  <span className="text-purple-400">

                    Stock{" "}
                    {
                      variant.quantity
                    }

                  </span>

                  {/* EDIT */}

                  <button
                    type="button"
                    onClick={() => {

                      const parentItem =
                        stock.find(
                          (item) =>
                            item.variants?.some(
                              (v) =>
                                v.id ===
                                variant.id
                            )
                        );

                      if (!parentItem) {
                        alert(
                          "Enamel item not found."
                        );
                        return;
                      }

                      editVariant(
                        parentItem,
                        variant
                      );

                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  {/* REMOVE */}

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
          SAVE BUTTONS
      ================================================= */}

      <div className="flex gap-4 mt-6">

        <button
          type="button"
          onClick={
            saveItem
          }
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl"
        >

          {editingId
            ? "Update Enamel"
            : "Add Enamel"}

        </button>

        <button
          type="button"
          onClick={
            clearForm
          }
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

                /*
                  Enamel has variants
                */

                if (
                  item.variants &&
                  item.variants.length > 0
                ) {

                  return item.variants.map(
                    (
                      variant,
                      index
                    ) => (

                      <tr
                        key={`${item.id}-${variant.id}`}
                        className="border-b border-slate-700 text-center text-white"
                      >

                        {/* ENAMEL */}

                        <td className="p-3 font-bold">

                          {index === 0
                            ? item.productName
                            : ""}

                        </td>

                        {/* BRAND */}

                        <td className="p-3">

                          {index === 0
                            ? item.brand
                            : ""}

                        </td>

                        {/* SIZE */}

                        <td className="p-3 text-cyan-400 font-bold">

                          {variant.size}{" "}

                          {displayUnit(
                            variant.unit
                          )}

                        </td>

                        {/* ACTUAL PRICE */}

                        <td className="p-3 text-orange-400">

                          ₹{" "}
                          {
                            variant.price
                          }

                        </td>

                        {/* SELLING PRICE */}

                        <td className="p-3 text-green-400">

                          ₹{" "}
                          {
                            variant.sellingPrice
                          }

                        </td>

                        {/* STOCK */}

                        <td
                          className={`p-3 font-bold ${
                            variant.quantity <=
                            5
                              ? "text-red-500"
                              : "text-purple-400"
                          }`}
                        >

                          {
                            variant.quantity
                          }

                        </td>

                        {/* ACTION */}

                        <td className="p-3">

                          <div className="flex flex-wrap justify-center gap-2">

                            {/* EVERY SIZE GETS ITS OWN EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                editVariant(
                                  item,
                                  variant
                                )
                              }
                              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                            >
                              Edit
                            </button>

                            {/* DELETE WHOLE ENAMEL */}

                            {index === 0 && (

                              <button
                                type="button"
                                onClick={() =>
                                  removeItem(
                                    item.id
                                  )
                                }
                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                              >
                                Delete
                              </button>

                            )}

                          </div>

                        </td>

                      </tr>

                    )
                  );
                }

                /*
                  Old stock without variants
                */

                return (
                  <tr
                    key={item.id}
                    className="border-b border-slate-700 text-center text-white"
                  >

                    <td className="p-3 font-bold">
                      {item.productName}
                    </td>

                    <td className="p-3">
                      {item.brand}
                    </td>

                    <td className="p-3 text-cyan-400 font-bold">
                      1 Ltr
                    </td>

                    <td className="p-3 text-orange-400">
                      ₹ {item.price}
                    </td>

                    <td className="p-3 text-green-400">
                      ₹ {item.sellingPrice}
                    </td>

                    <td className="p-3 text-purple-400 font-bold">
                      {item.quantity}
                    </td>

                    <td className="p-3">

                      <div className="flex justify-center gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            editItem(
                              item
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(
                              item.id
                            )
                          }
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}