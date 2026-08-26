"use client";

import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import {
  addCustomer,
  getCustomers,
  deleteCustomer,
  updateCustomer,
} from "@/lib/storage";

import { Customer } from "@/types/customer";

export default function PopPage() {

  const [customerName, setCustomerName] =
    useState("");

  const [contact, setContact] =
    useState("");

  const [channel, setChannel] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [paidAmount, setPaidAmount] =
    useState("");

  const [accessoryName, setAccessoryName] =
    useState("");

  const [accessoryPrice, setAccessoryPrice] =
    useState("");

  const [accessories, setAccessories] =
    useState<
      { name: string; price: number }[]
    >([]);

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [search, setSearch] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);


  const popTotal =
    (Number(price) || 0) *
    (Number(quantity) || 0);


  const accessoriesTotal =
    accessories.reduce(
      (sum, item) =>
        sum + item.price,
      0
    );


  const totalAmount =
    popTotal + accessoriesTotal;


  const dueAmount =
    totalAmount -
    (Number(paidAmount) || 0);


  /*
    Load POP customers
  */

  function loadCustomers() {

    const data =
      getCustomers().filter(
        (customer) =>
          customer.category === "pop"
      );

    setCustomers(data);
  }


  /*
    Load customers when page opens
  */

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {

    loadCustomers();

  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */


  /*
    Add accessory
  */

  function addAccessory() {

    const name =
      accessoryName.trim();

    const amount =
      Number(accessoryPrice);


    if (!name) {

      alert(
        "Please enter accessory name."
      );

      return;
    }


    if (
      !accessoryPrice ||
      amount <= 0
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
        price: amount,
      },
    ]);


    setAccessoryName("");
    setAccessoryPrice("");
  }


  /*
    Remove accessory
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
    Clear form
  */

  function clearForm() {

    setCustomerName("");
    setContact("");
    setChannel("");
    setPrice("");
    setQuantity("");
    setPaidAmount("");

    setAccessoryName("");
    setAccessoryPrice("");
    setAccessories([]);

    setEditingId(null);
  }


  /*
    Save / Update POP customer
  */

  function savePopSale() {

    if (
      customerName.trim() === "" ||
      contact.trim() === "" ||
      channel.trim() === "" ||
      price.trim() === "" ||
      quantity.trim() === ""
    ) {

      alert(
        "Please fill all required fields."
      );

      return;
    }


    const customer: Customer = {

      id:
        editingId ??
        uuid(),

      category:
        "pop",

      customerName,

      contact,

      productName:
        "POP",

      productCode:
        channel,

      popChannel:
        channel,

      popPrice:
        Number(price),

      popQuantity:
        Number(quantity),

      quantitySold:
        Number(quantity),

      totalAmount,

      paidAmount:
        Number(paidAmount) || 0,

      dueAmount,

      accessories,

      createdAt:
        new Date().toLocaleString(),

    };


    if (editingId) {

      updateCustomer(
        customer
      );

      alert(
        "POP Customer Updated Successfully!"
      );

    } else {

      addCustomer(
        customer
      );

      alert(
        "POP Sale Saved Successfully!"
      );

    }


    loadCustomers();

    clearForm();
  }


  /*
    Edit POP customer
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


    setChannel(
      customer.popChannel ||
      customer.productCode ||
      ""
    );


    setPrice(
      customer.popPrice?.toString() ||
      ""
    );


    setQuantity(
      customer.popQuantity?.toString() ||
      customer.quantitySold?.toString() ||
      ""
    );


    setPaidAmount(
      customer.paidAmount.toString()
    );


    setAccessories(
      customer.accessories ||
      []
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  /*
    Delete POP customer
  */

  function removeCustomer(
    id: string
  ) {

    if (
      !confirm(
        "Delete this POP customer?"
      )
    ) {

      return;
    }


    deleteCustomer(id);

    loadCustomers();
  }


  /*
    WhatsApp
  */

  function openWhatsApp(
    customer: Customer
  ) {

    let phone =
      customer.contact.replace(
        /\D/g,
        ""
      );


    if (
      phone.length === 10
    ) {

      phone =
        "91" + phone;

    }


    const due =
      customer.dueAmount || 0;


    let message = "";


    if (
      customer.pendingCleared ||
      due <= 0
    ) {

      message =
        `नमस्ते ${customer.customerName},\n\n` +
        `Maleshwar Traders की ओर से आपका भुगतान पूरी तरह साफ़ हो गया है।\n\n` +
        `आपके सहयोग के लिए धन्यवाद। 🙏`;

    } else {

      message =
        `नमस्ते ${customer.customerName},\n\n` +
        `Maleshwar Traders की ओर से आपका ₹${due} भुगतान बाकी है।\n\n` +
        `कृपया अपना बाकी भुगतान जल्द से जल्द जमा कर दें।\n\n` +
        `धन्यवाद 🙏`;

    }


    const whatsappUrl =
      `https://wa.me/${phone}?text=${encodeURIComponent(
        message
      )}`;


    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }


  /*
    Search
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

          (
            customer.popChannel ||
            customer.productCode ||
            ""
          )
            .toLowerCase()
            .includes(value)

        );

      }
    );


  return (

    <div className="min-h-screen bg-[#0f172a] py-10 px-4">

      <div className="max-w-7xl mx-auto bg-[#1e293b] rounded-2xl shadow-2xl border border-green-700 p-8">


        {/* TITLE */}

        <h1 className="text-5xl font-bold text-green-400 text-center mb-10">

          POP Sales

        </h1>


        {/* FORM */}

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


          {/* CHANNEL */}

          <input
            type="text"
            placeholder="Channel"
            value={channel}
            onChange={(e) =>
              setChannel(
                e.target.value
              )
            }
            className="p-4 rounded-xl bg-slate-800 border border-blue-500 text-white"
          />


          {/* PRICE */}

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) =>
              setPrice(
                e.target.value
              )
            }
            className="p-4 rounded-xl bg-slate-800 border border-green-500 text-white"
          />


          {/* QUANTITY */}

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) =>
              setQuantity(
                e.target.value
              )
            }
            className="p-4 rounded-xl bg-slate-800 border border-purple-500 text-white"
          />

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


        {/* BUTTONS */}

        <div className="mt-6 flex gap-4">

          <button
            type="button"
            onClick={
              savePopSale
            }
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl"
          >

            {editingId
              ? "Update Customer"
              : "Save POP Sale"}

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

        <div className="mt-10">

          <input
            type="text"
            placeholder="Search POP Customer..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full p-4 rounded-xl bg-slate-800 border border-blue-500 text-white"
          />

        </div>


        {/* CUSTOMER DETAILS */}

        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-700">

          <table className="w-full">

            <thead className="bg-green-700 text-white">

              <tr>

                <th className="p-3 text-left">
                  Customer
                </th>

                <th className="p-3 text-left">
                  Contact
                </th>

                <th className="p-3 text-left">
                  Channel
                </th>

                <th className="p-3 text-center">
                  Price
                </th>

                <th className="p-3 text-center">
                  Qty
                </th>

                <th className="p-3 text-left">
                  Accessories
                </th>

                <th className="p-3 text-center">
                  Total
                </th>

                <th className="p-3 text-center">
                  Paid
                </th>

                <th className="p-3 text-center">
                  Due
                </th>

                <th className="p-3 text-center">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredCustomers.length ===
              0 ? (

                <tr>

                  <td
                    colSpan={10}
                    className="p-6 text-center text-gray-400"
                  >

                    No POP customers found.

                  </td>

                </tr>

              ) : (

                filteredCustomers.map(
                  (customer) => (

                    <tr
                      key={customer.id}
                      className="border-b border-slate-700 text-white"
                    >


                      {/* CUSTOMER */}

                      <td className="p-3">

                        {customer.customerName}

                      </td>


                      {/* CONTACT */}

                      <td className="p-3">

                        {customer.contact}

                      </td>


                      {/* CHANNEL */}

                      <td className="p-3">

                        {customer.popChannel ||
                          customer.productCode}

                      </td>


                      {/* PRICE */}

                      <td className="p-3 text-center">

                        ₹{customer.popPrice ?? 0}

                      </td>


                      {/* QUANTITY */}

                      <td className="p-3 text-center">

                        {customer.popQuantity ??
                          customer.quantitySold ??
                          0}

                      </td>


                      {/* ACCESSORIES */}

                      <td className="p-3">

                        {customer.accessories &&
                        customer.accessories.length >
                          0 ? (

                          <div className="space-y-1">

                            {customer.accessories.map(
                              (
                                item,
                                index
                              ) => (

                                <div
                                  key={`${item.name}-${index}`}
                                  className="text-sm"
                                >

                                  <span className="text-white">
                                    {item.name}
                                  </span>

                                  <span className="text-cyan-400 ml-2">
                                    ₹{item.price}
                                  </span>

                                </div>

                              )
                            )}

                          </div>

                        ) : (

                          <span className="text-gray-500">
                            None
                          </span>

                        )}

                      </td>


                      {/* TOTAL */}

                      <td className="p-3 text-center">

                        ₹{customer.totalAmount}

                      </td>


                      {/* PAID */}

                      <td className="p-3 text-center text-green-400">

                        ₹{customer.paidAmount}

                      </td>


                      {/* DUE */}

                      <td className="p-3 text-center">

                        {customer.pendingCleared ? (

                          <span className="font-bold text-green-400">
                            CLEAR
                          </span>

                        ) : (

                          <span className="text-red-400">
                            ₹{customer.dueAmount}
                          </span>

                        )}

                      </td>


                      {/* ACTIONS */}

                      <td className="p-3">

                        <div className="flex justify-center gap-2 flex-wrap">


                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              editCustomer(
                                customer
                              )
                            }
                            className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                          >

                            Edit

                          </button>


                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              removeCustomer(
                                customer.id
                              )
                            }
                            className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                          >

                            Delete

                          </button>


                          {/* WHATSAPP */}

                          <button
                            type="button"
                            onClick={() =>
                              openWhatsApp(
                                customer
                              )
                            }
                            className="rounded bg-green-600 px-3 py-1 text-white font-semibold hover:bg-green-500"
                          >

                            WhatsApp

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>


      </div>

    </div>

  );
}