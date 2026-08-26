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

type SalePaint = {
  paintName: string;
  shadeCode: string;
  brand: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
};

export default function PaintsPage() {

  const [customerName, setCustomerName] =
    useState("");

  const [contact, setContact] =
    useState("");

  // Current paint being selected
  const [paintName, setPaintName] =
    useState("");

  const [paintNo, setPaintNo] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [purchasePrice, setPurchasePrice] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [availableStock, setAvailableStock] =
    useState(0);

  const [quantitySold, setQuantitySold] =
    useState("");

  // Multiple paints
  const [paints, setPaints] =
    useState<SalePaint[]>([]);

  // Accessories
  const [accessoryName, setAccessoryName] =
    useState("");

  const [accessoryPrice, setAccessoryPrice] =
    useState("");

  const [accessories, setAccessories] =
    useState<
      { name: string; price: number }[]
    >([]);

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


  /*
    PAINTS TOTAL
  */

  const paintsTotal =
    paints.reduce(
      (sum, paint) =>
        sum +
        paint.sellingPrice *
          paint.quantity,
      0
    );


  /*
    ACCESSORIES TOTAL
  */

  const accessoriesTotal =
    accessories.reduce(
      (sum, item) =>
        sum + item.price,
      0
    );


  /*
    FINAL TOTAL
  */

  const totalAmount =
    paintsTotal +
    accessoriesTotal;


  /*
    DUE
  */

  const dueAmount =
    totalAmount -
    (Number(paidAmount) || 0);


  /*
    LOAD CUSTOMERS + STOCK
  */

  function loadCustomers() {

    const customerData =
      getCustomers().filter(
        (item) =>
          item.category === "paint"
      );

    const stockData =
      getPaintStock();

    setCustomers(customerData);

    setPaintStock(stockData);
  }


  /*
    PAGE LOAD
  */

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {

    loadCustomers();

    const data =
      localStorage.getItem(
        "editCustomer"
      );

    if (!data) {
      return;
    }

    const customer: Customer =
      JSON.parse(data);

    setEditingId(customer.id);

    setCustomerName(
      customer.customerName
    );

    setContact(
      customer.contact
    );

    /*
      NEW MULTIPLE PAINT DATA
    */

    if (
      customer.paints &&
      customer.paints.length > 0
    ) {

      setPaints(
        customer.paints
      );

      /*
        Current paint fields
        first paint se fill honge
      */

      const firstPaint =
        customer.paints[0];

      setPaintName(
        firstPaint.paintName
      );

      setPaintNo(
        firstPaint.shadeCode
      );

      setBrand(
        firstPaint.brand
      );

      setPurchasePrice(
        firstPaint.purchasePrice.toString()
      );

      setPrice(
        firstPaint.sellingPrice.toString()
      );

      const stockItem =
        getPaintStock().find(
          (item) =>
            item.productCode
              .toLowerCase() ===
            firstPaint.shadeCode
              .toLowerCase()
        );

      if (stockItem) {

        setAvailableStock(
          stockItem.quantity
        );

      }

      setQuantitySold(
        firstPaint.quantity.toString()
      );

    } else {

      /*
        OLD CUSTOMER DATA SUPPORT
      */

      setPaintName(
        customer.productName
      );

      setPaintNo(
        customer.productCode
      );

      const stockItem =
        getPaintStock().find(
          (item) =>
            item.productName ===
            customer.productName
        );

      if (stockItem) {

        setBrand(
          stockItem.brand
        );

        setPurchasePrice(
          stockItem.price?.toString() ||
          ""
        );

        setPrice(
          stockItem.sellingPrice?.toString() ||
          stockItem.price?.toString() ||
          ""
        );

        setAvailableStock(
          stockItem.quantity
        );

      }

      setQuantitySold(
        customer.quantitySold?.toString() ||
        ""
      );
    }

    setPaidAmount(
      customer.paidAmount.toString()
    );

    setAccessories(
      customer.accessories ||
      []
    );

    localStorage.removeItem(
      "editCustomer"
    );

  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */


  /*
    SELECT PAINT
  */

  function selectPaint(
    selected: Stock
  ) {

    setPaintName(
      selected.productName
    );

    setPaintNo(
      selected.productCode
    );

    setBrand(
      selected.brand
    );

    setPurchasePrice(
      selected.price?.toString() ||
      ""
    );

    const sellingPrice =
      selected.sellingPrice?.toString() ||
      selected.price?.toString() ||
      "";

    setPrice(
      sellingPrice
    );

    setAvailableStock(
      selected.quantity
    );
  }


  /*
    SELECT PAINT FROM DROPDOWN
  */

  function handlePaintSelect(
    value: string
  ) {

    const selected =
      paintStock.find(
        (item) =>
          item.productName ===
          value
      );

    if (selected) {

      selectPaint(
        selected
      );

    }
  }


  /*
    SHADE CODE SEARCH
  */

  function handleShadeCode(
    code: string
  ) {

    setPaintNo(code);

    const selected =
      paintStock.find(
        (item) =>
          item.productCode
            .toLowerCase()
            .trim() ===
          code
            .toLowerCase()
            .trim()
      );

    if (selected) {

      selectPaint(
        selected
      );

    } else {

      setPaintName("");
      setBrand("");

      setPurchasePrice("");
      setPrice("");

      setAvailableStock(0);
    }
  }


  /*
    ADD PAINT
  */

  function addPaint() {

    if (
      !paintName ||
      !paintNo ||
      !price ||
      !quantitySold
    ) {

      alert(
        "Please select a paint, shade code and quantity."
      );

      return;
    }

    const quantity =
      Number(quantitySold);

    if (
      quantity <= 0
    ) {

      alert(
        "Please enter a valid quantity."
      );

      return;
    }

    /*
      Check if same paint already
      added in current sale
    */

    const existingIndex =
      paints.findIndex(
        (paint) =>
          paint.shadeCode
            .toLowerCase() ===
          paintNo
            .toLowerCase()
      );


    if (
      existingIndex !== -1
    ) {

      const updatedPaints =
        [...paints];

      const existingPaint =
        updatedPaints[
          existingIndex
        ];

      const newQuantity =
        existingPaint.quantity +
        quantity;

      const stockItem =
        paintStock.find(
          (item) =>
            item.productCode
              .toLowerCase() ===
            paintNo
              .toLowerCase()
        );

      if (
        stockItem &&
        newQuantity >
          stockItem.quantity
      ) {

        alert(
          "Not enough stock available."
        );

        return;
      }

      updatedPaints[
        existingIndex
      ] = {
        ...existingPaint,
        quantity:
          newQuantity,
      };

      setPaints(
        updatedPaints
      );

    } else {

      if (
        quantity >
        availableStock
      ) {

        alert(
          "Not enough stock available."
        );

        return;
      }

      const newPaint: SalePaint = {

        paintName,

        shadeCode:
          paintNo,

        brand,

        purchasePrice:
          Number(purchasePrice) || 0,

        sellingPrice:
          Number(price),

        quantity,

      };

      setPaints([
        ...paints,
        newPaint,
      ]);

    }


    /*
      Clear current paint
      fields for next paint
    */

    setPaintName("");
    setPaintNo("");
    setBrand("");

    setPurchasePrice("");
    setPrice("");

    setAvailableStock(0);
    setQuantitySold("");
  }


  /*
    REMOVE PAINT
  */

  function removePaint(
    index: number
  ) {

    setPaints(
      paints.filter(
        (_, i) =>
          i !== index
      )
    );
  }


  /*
    ADD ACCESSORY
  */

  function addAccessory() {

    const name =
      accessoryName.trim();

    const priceValue =
      Number(accessoryPrice);

    if (!name) {

      alert(
        "Please enter accessory name."
      );

      return;
    }

    if (
      !accessoryPrice ||
      priceValue <= 0
    ) {

      alert(
        "Please enter a valid accessory price."
      );

      return;
    }

    setAccessories([
      ...accessories,
      {
        name,
        price:
          priceValue,
      },
    ]);

    setAccessoryName("");
    setAccessoryPrice("");
  }


  /*
    REMOVE ACCESSORY
  */

  function removeAccessory(
    index: number
  ) {

    setAccessories(
      accessories.filter(
        (_, i) =>
          i !== index
      )
    );
  }


  /*
    CLEAR FORM
  */

  function clearForm() {

    setCustomerName("");
    setContact("");

    setPaintName("");
    setPaintNo("");
    setBrand("");

    setPurchasePrice("");
    setPrice("");

    setAvailableStock(0);
    setQuantitySold("");

    setPaints([]);

    setAccessoryName("");
    setAccessoryPrice("");
    setAccessories([]);

    setPaidAmount("");

    setEditingId(null);
  }


  /*
    SAVE CUSTOMER
  */

  function saveCustomer() {

    if (
      customerName.trim() === "" ||
      contact.trim() === ""
    ) {

      alert(
        "Please fill customer details."
      );

      return;
    }


    if (
      paints.length === 0
    ) {

      alert(
        "Please add at least one paint."
      );

      return;
    }


    /*
      Final stock validation
    */

    for (
      const paint of paints
    ) {

      const stockItem =
        paintStock.find(
          (item) =>
            item.productCode
              .toLowerCase() ===
            paint.shadeCode
              .toLowerCase()
        );

      if (!stockItem) {

        alert(
          `${paint.paintName} stock not found.`
        );

        return;
      }

      /*
        For NEW sale check stock.
        For edit we don't reduce stock
        again.
      */

      if (
        !editingId &&
        paint.quantity >
          stockItem.quantity
      ) {

        alert(
          `Not enough stock for ${paint.paintName}.`
        );

        return;
      }
    }


    /*
      Main old fields are kept
      for compatibility.
    */

    const firstPaint =
      paints[0];


    const customer: Customer = {

      id:
        editingId ??
        uuid(),

      category:
        "paint",

      customerName,

      contact,

      productName:
        firstPaint.paintName,

      productCode:
        firstPaint.shadeCode,

      quantitySold:
        firstPaint.quantity,

      paints:

        paints,

      totalAmount,

      paidAmount:
        Number(paidAmount) || 0,

      dueAmount,

      accessories,

      createdAt:
        new Date().toLocaleString(),

    };


    /*
      UPDATE
    */

    if (editingId) {

      updateCustomer(
        customer
      );

      alert(
        "Customer Updated Successfully!"
      );

    } else {

      /*
        SAVE
      */

      addCustomer(
        customer
      );


      /*
        Reduce stock for EVERY paint
      */

      for (
        const paint of paints
      ) {

        reduceStock(
          paint.paintName,
          paint.quantity
        );

      }


      alert(
        "Customer Saved Successfully!"
      );

    }


    loadCustomers();

    clearForm();
  }


  /*
    DELETE CUSTOMER
  */

  function removeCustomer(
    id: string
  ) {

    if (
      !confirm(
        "Delete this customer?"
      )
    ) {

      return;
    }

    deleteCustomer(id);

    loadCustomers();
  }


  /*
    EDIT CUSTOMER
  */

  function editCustomer(
    customer: Customer
  ) {

    setEditingId(
      customer.id
    );

    setCustomerName(
      customer.customerName
    );

    setContact(
      customer.contact
    );


    /*
      MULTIPLE PAINT CUSTOMER
    */

    if (
      customer.paints &&
      customer.paints.length > 0
    ) {

      setPaints(
        customer.paints
      );

      const firstPaint =
        customer.paints[0];

      setPaintName(
        firstPaint.paintName
      );

      setPaintNo(
        firstPaint.shadeCode
      );

      setBrand(
        firstPaint.brand
      );

      setPurchasePrice(
        firstPaint.purchasePrice.toString()
      );

      setPrice(
        firstPaint.sellingPrice.toString()
      );

      setQuantitySold(
        firstPaint.quantity.toString()
      );

      const stockItem =
        paintStock.find(
          (item) =>
            item.productCode
              .toLowerCase() ===
            firstPaint.shadeCode
              .toLowerCase()
        );

      if (stockItem) {

        setAvailableStock(
          stockItem.quantity
        );

      }

    } else {

      /*
        OLD SINGLE PAINT CUSTOMER
      */

      setPaintName(
        customer.productName
      );

      setPaintNo(
        customer.productCode
      );

      setQuantitySold(
        customer.quantitySold?.toString() ||
        ""
      );

      const stockItem =
        paintStock.find(
          (item) =>
            item.productName ===
            customer.productName
        );

      if (stockItem) {

        setBrand(
          stockItem.brand
        );

        setPurchasePrice(
          stockItem.price?.toString() ||
          ""
        );

        setPrice(
          stockItem.sellingPrice?.toString() ||
          stockItem.price?.toString() ||
          ""
        );

        setAvailableStock(
          stockItem.quantity
        );

      }

    }


    setAccessories(
      customer.accessories ||
      []
    );

    setPaidAmount(
      customer.paidAmount.toString()
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  /*
    SEARCH
  */

  const filteredCustomers =
    customers.filter(
      (customer) => {

        const value =
          search
            .toLowerCase()
            .trim();

        return (

          customer.customerName
            .toLowerCase()
            .includes(value)

          ||

          customer.contact
            .includes(value)

          ||

          customer.productName
            .toLowerCase()
            .includes(value)

          ||

          customer.productCode
            .toLowerCase()
            .includes(value)

          ||

          customer.paints?.some(
            (paint) =>
              paint.paintName
                .toLowerCase()
                .includes(value) ||

              paint.shadeCode
                .toLowerCase()
                .includes(value)
          )

        );

      }
    );


  return (

    <div className="min-h-screen bg-[#0f172a] py-10 px-4">

      <div className="max-w-7xl mx-auto bg-[#1e293b] rounded-2xl shadow-2xl border border-green-700 p-8">


        {/* TITLE */}

        <h1 className="text-5xl font-bold text-green-400 text-center mb-10">

          Premium Paints

        </h1>


        {/* CUSTOMER DETAILS */}

        <div className="grid md:grid-cols-2 gap-5">


          {/* CUSTOMER NAME */}

          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
            className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
          />


          {/* CONTACT */}

          <input
            type="text"
            placeholder="Contact Number"
            value={contact}
            onChange={(e) =>
              setContact(
                e.target.value
              )
            }
            className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
          />

        </div>


        {/* PAINT SELECTION */}

        <div className="mt-6 rounded-xl border border-green-600 bg-slate-900 p-5">

          <h2 className="text-xl font-bold text-green-400 mb-5">

            Add Paint

          </h2>


          <div className="grid md:grid-cols-2 gap-5">


            {/* PAINT SELECT */}

            <select
              value={paintName}
              onChange={(e) =>
                handlePaintSelect(
                  e.target.value
                )
              }
              className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
            >

              <option value="">
                Select Paint
              </option>

              {paintStock.map(
                (item) => (

                  <option
                    key={item.id}
                    value={
                      item.productName
                    }
                  >

                    {item.productName} (
                    {item.quantity} Left)

                  </option>

                )
              )}

            </select>


            {/* SHADE CODE */}

            <input
              type="text"
              placeholder="Enter Shade Code"
              value={paintNo}
              onChange={(e) =>
                handleShadeCode(
                  e.target.value
                )
              }
              className="p-4 rounded-xl bg-slate-800 border border-yellow-500 text-white"
            />


            {/* BRAND */}

            <input
              type="text"
              value={brand}
              readOnly
              placeholder="Brand"
              className="p-4 rounded-xl bg-slate-900 border border-blue-500 text-blue-400"
            />


            {/* ORIGINAL PRICE */}

            <input
              type="text"
              value={
                purchasePrice
                  ? `₹${purchasePrice}`
                  : ""
              }
              readOnly
              placeholder="Price Per Unit"
              className="p-4 rounded-xl bg-slate-900 border border-orange-500 text-orange-400"
            />


            {/* SELLING PRICE */}

            <input
              type="text"
              value={
                price
                  ? `₹${price}`
                  : ""
              }
              readOnly
              placeholder="Selling Price Per Unit"
              className="p-4 rounded-xl bg-slate-900 border border-green-500 text-green-400"
            />


            {/* AVAILABLE STOCK */}

            <input
              type="text"
              value={
                `${availableStock} Available`
              }
              readOnly
              className="p-4 rounded-xl bg-slate-900 border border-purple-500 text-purple-400 font-bold"
            />


            {/* QUANTITY */}

            <input
              type="number"
              placeholder="Quantity"
              value={quantitySold}
              onChange={(e) =>
                setQuantitySold(
                  e.target.value
                )
              }
              className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
            />

          </div>


          {/* ADD PAINT BUTTON */}

          <button
            type="button"
            onClick={addPaint}
            className="mt-5 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3 rounded-xl"
          >

            + Add Paint

          </button>


          {/* ADDED PAINTS */}

          {paints.length > 0 && (

            <div className="mt-6 space-y-3">

              <h3 className="text-lg font-bold text-yellow-400">

                Added Paints

              </h3>


              {paints.map(
                (paint, index) => (

                  <div
                    key={`${paint.shadeCode}-${index}`}
                    className="bg-slate-800 rounded-xl border border-slate-700 p-4"
                  >

                    <div className="grid md:grid-cols-6 gap-3 items-center">


                      <div>

                        <p className="text-white font-bold">

                          {paint.paintName}

                        </p>

                        <p className="text-gray-400 text-sm">

                          {paint.brand}

                        </p>

                      </div>


                      <div className="text-yellow-400">

                        Shade:
                        <br />

                        {paint.shadeCode}

                      </div>


                      <div className="text-orange-400">

                        Price:
                        <br />

                        ₹{paint.purchasePrice}

                      </div>


                      <div className="text-green-400">

                        Selling:
                        <br />

                        ₹{paint.sellingPrice}

                      </div>


                      <div className="text-purple-400">

                        Qty:
                        <br />

                        {paint.quantity}

                      </div>


                      <div className="text-right">

                        <p className="text-white font-bold mb-2">

                          ₹
                          {paint.sellingPrice *
                            paint.quantity}

                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            removePaint(
                              index
                            )
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                        >

                          Remove

                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}


              <div className="text-right text-green-400 font-bold text-lg">

                Paints Total: ₹
                {paintsTotal}

              </div>

            </div>

          )}

        </div>


        {/* ACCESSORIES */}

        <div className="mt-6 rounded-xl border border-cyan-500 bg-slate-900 p-5">

          <h2 className="text-xl font-bold text-cyan-400 mb-4">

            Accessories

          </h2>


          <div className="grid md:grid-cols-3 gap-4">


            <input
              type="text"
              placeholder="Accessory Name"
              value={accessoryName}
              onChange={(e) =>
                setAccessoryName(
                  e.target.value
                )
              }
              className="p-4 rounded-xl bg-slate-800 border border-cyan-500 text-white"
            />


            <input
              type="number"
              placeholder="Accessory Price"
              value={accessoryPrice}
              onChange={(e) =>
                setAccessoryPrice(
                  e.target.value
                )
              }
              className="p-4 rounded-xl bg-slate-800 border border-cyan-500 text-white"
            />


            <button
              type="button"
              onClick={
                addAccessory
              }
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl px-6 py-3"
            >

              + Add Accessory

            </button>

          </div>


          {accessories.length >
            0 && (

            <div className="mt-5 space-y-2">

              {accessories.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center justify-between bg-slate-800 rounded-xl p-3 border border-slate-700"
                  >

                    <div>

                      <span className="text-white font-semibold">

                        {item.name}

                      </span>

                      <span className="text-cyan-400 ml-3">

                        ₹{item.price}

                      </span>

                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        removeAccessory(
                          index
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                    >

                      Remove

                    </button>

                  </div>

                )
              )}


              <div className="text-right text-cyan-400 font-bold pt-2">

                Accessories Total: ₹
                {accessoriesTotal}

              </div>

            </div>

          )}

        </div>


        {/* TOTAL */}

        <div className="mt-6">

          <input
            type="text"
            value={
              `Total Amount : ₹ ${totalAmount}`
            }
            readOnly
            className="w-full p-4 rounded-xl bg-slate-900 border border-orange-500 text-orange-400 font-bold"
          />

        </div>


        {/* PAID */}

        <div className="mt-5">

          <input
            type="number"
            placeholder="Amount Paid"
            value={paidAmount}
            onChange={(e) =>
              setPaidAmount(
                e.target.value
              )
            }
            className="w-full p-4 rounded-xl bg-slate-800 border border-green-600 text-white"
          />

        </div>


        {/* DUE */}

        <div className="mt-6">

          <input
            type="text"
            value={
              `Due Amount : ₹ ${dueAmount}`
            }
            readOnly
            className="w-full p-4 rounded-xl bg-slate-900 border border-yellow-500 text-yellow-400 font-bold"
          />

        </div>


        {/* STOCK WARNING */}

        {paints.length === 0 && (

          <div className="mt-4 bg-slate-800 text-gray-300 p-4 rounded-xl text-center">

            Add paint to continue.

          </div>

        )}


        {/* BUTTONS */}

        <div className="mt-6 flex gap-4">

          <button
            type="button"
            onClick={
              saveCustomer
            }
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl"
          >

            {editingId
              ? "Update Customer"
              : "Save Customer"}

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


        {/* SEARCH */}

        <div className="mt-8">

          <input
            type="text"
            placeholder="Search Customer..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full p-4 rounded-xl bg-slate-800 border border-blue-500 text-white"
          />

        </div>


        {/* CUSTOMER TABLE */}

        <CustomerTable
          customers={
            filteredCustomers
          }
          onDelete={
            removeCustomer
          }
          onEdit={
            editCustomer
          }
        />


      </div>

    </div>
  );
}