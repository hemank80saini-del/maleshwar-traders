"use client";

import { useState } from "react";
import { Customer } from "@/types/customer";
import { useRouter } from "next/navigation";

type Props = {
  customers: Customer[];
  onDelete: (id: string) => void;
  onEdit: (customer: Customer) => void;
};

export default function CustomerTable({
  customers,
  onDelete,
  onEdit,
}: Props) {
  const router = useRouter();

  const [expandedCustomer, setExpandedCustomer] =
    useState<string | null>(null);

  if (customers.length === 0) {
    return (
      <div className="mt-8 rounded-xl bg-slate-800 p-6 text-center text-gray-300">
        No customers found.
      </div>
    );
  }

  /*
    WhatsApp
  */

  function openWhatsApp(customer: Customer) {
    let phone =
      customer.contact.replace(/\D/g, "");

    if (phone.length === 10) {
      phone = "91" + phone;
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
    Edit customer
  */

  function editCustomer(
    customer: Customer
  ) {
    localStorage.setItem(
      "editCustomer",
      JSON.stringify(customer)
    );

    if (
      customer.category === "paint"
    ) {
      router.push("/paints");
    } else if (
      customer.category === "pop"
    ) {
      router.push("/pop");
    } else {
      router.push("/timbers");
    }
  }

  /*
    Toggle customer details
  */

  function toggleDetails(
    customerId: string
  ) {
    setExpandedCustomer(
      expandedCustomer === customerId
        ? null
        : customerId
    );
  }

  return (
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
              Product
            </th>

            <th className="p-3 text-left">
              Code
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

          {customers.map((customer) => {

            const isExpanded =
              expandedCustomer ===
              customer.id;

            return (
              <>

                {/* ================= MAIN CUSTOMER ROW ================= */}

                <tr
                  key={customer.id}
                  className="border-b border-slate-700 text-white hover:bg-slate-900/70"
                >

                  {/* CUSTOMER */}

                  <td className="p-3">
                    <div className="font-semibold">
                      {customer.customerName}
                    </div>
                  </td>


                  {/* CONTACT */}

                  <td className="p-3">
                    {customer.contact}
                  </td>


                  {/* PRODUCT */}

                  <td className="p-3">

                    <div className="font-medium">
                      {customer.productName}
                    </div>

                    {customer.category ===
                      "paint" &&
                      customer.paints &&
                      customer.paints.length >
                        0 && (
                        <div className="text-xs text-slate-400 mt-1">
                          {customer.paints.length}{" "}
                          paint item
                          {customer.paints.length >
                          1
                            ? "s"
                            : ""}
                        </div>
                      )}

                    {customer.category ===
                      "paint" &&
                      customer.enamels &&
                      customer.enamels.length >
                        0 && (
                        <div className="text-xs text-orange-400 mt-1">
                          {customer.enamels.length}{" "}
                          enamel item
                          {customer.enamels.length >
                          1
                            ? "s"
                            : ""}
                        </div>
                      )}

                  </td>


                  {/* CODE / CHANNEL */}

                  <td className="p-3">

                    {customer.category ===
                    "pop"
                      ? customer.popChannel ||
                        customer.productCode ||
                        "-"
                      : customer.productCode ||
                        "-"}

                  </td>


                  {/* QUANTITY */}

                  <td className="p-3 text-center">

                    {customer.category ===
                    "pop"
                      ? customer.popQuantity ??
                        customer.quantitySold ??
                        "-"
                      : customer.quantitySold ??
                        "-"}

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
                              className="text-sm whitespace-nowrap"
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
                        -
                      </span>

                    )}

                  </td>


                  {/* TOTAL */}

                  <td className="p-3 text-center font-semibold">
                    ₹{customer.totalAmount}
                  </td>


                  {/* PAID */}

                  <td className="p-3 text-center text-green-400 font-semibold">
                    ₹{customer.paidAmount}
                  </td>


                  {/* DUE */}

                  <td className="p-3 text-center">

                    {customer.pendingCleared ? (

                      <span className="font-bold text-green-400">
                        CLEAR
                      </span>

                    ) : (

                      <span className="text-red-400 font-semibold">
                        ₹{customer.dueAmount}
                      </span>

                    )}

                  </td>


                  {/* ACTIONS */}

                  <td className="p-3">

                    <div className="flex justify-center gap-2 flex-wrap">

                      {/* VIEW DETAILS */}

                      <button
                        type="button"
                        onClick={() =>
                          toggleDetails(
                            customer.id
                          )
                        }
                        className="rounded bg-purple-600 px-3 py-1 text-white font-semibold hover:bg-purple-700"
                      >
                        {isExpanded
                          ? "Hide Details"
                          : "View Details"}
                      </button>


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
                          onDelete(
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


                {/* =====================================================
                    EXPANDED CUSTOMER DETAILS
                ===================================================== */}

                {isExpanded && (

                  <tr
                    key={`${customer.id}-details`}
                    className="border-b border-slate-700"
                  >

                    <td
                      colSpan={10}
                      className="p-0"
                    >

                      <div className="bg-slate-950 p-5">

                        {/* ================= HEADER ================= */}

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">

                          <div>

                            <h3 className="text-xl font-bold text-white">
                              Purchase Details
                            </h3>

                            <p className="text-sm text-slate-400 mt-1">
                              {customer.customerName}
                              {" • "}
                              {customer.contact}
                            </p>

                          </div>

                          <div className="text-right">

                            <p className="text-sm text-slate-400">
                              Total Purchase
                            </p>

                            <p className="text-2xl font-bold text-green-400">
                              ₹
                              {
                                customer.totalAmount
                              }
                            </p>

                          </div>

                        </div>


                        {/* =================================================
                            PAINT DETAILS
                        ================================================= */}

                        {customer.paints &&
                        customer.paints.length >
                          0 && (

                          <div className="mb-5">

                            <div className="flex items-center gap-2 mb-3">

                              <div className="h-8 w-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                                🎨
                              </div>

                              <h4 className="text-lg font-semibold text-white">
                                Paints Purchased
                              </h4>

                            </div>


                            <div className="overflow-x-auto rounded-xl border border-slate-700">

                              <table className="w-full min-w-[800px]">

                                <thead className="bg-slate-800">

                                  <tr>

                                    <th className="p-3 text-left text-slate-300">
                                      Paint
                                    </th>

                                    <th className="p-3 text-left text-slate-300">
                                      Shade Code
                                    </th>

                                    <th className="p-3 text-left text-slate-300">
                                      Brand
                                    </th>

                                    <th className="p-3 text-center text-slate-300">
                                      Unit
                                    </th>

                                    <th className="p-3 text-center text-slate-300">
                                      Qty
                                    </th>

                                    <th className="p-3 text-right text-slate-300">
                                      Selling Price
                                    </th>

                                    <th className="p-3 text-right text-slate-300">
                                      Total
                                    </th>

                                  </tr>

                                </thead>


                                <tbody>

                                  {customer.paints.map(
                                    (
                                      paint,
                                      index
                                    ) => (

                                      <tr
                                        key={`paint-${customer.id}-${index}`}
                                        className="border-t border-slate-700"
                                      >

                                        <td className="p-3 text-white font-medium">
                                          {
                                            paint.paintName
                                          }
                                        </td>

                                        <td className="p-3 text-cyan-400">
                                          {
                                            paint.shadeCode
                                          }
                                        </td>

                                        <td className="p-3 text-slate-300">
                                          {
                                            paint.brand
                                          }
                                        </td>

                                        <td className="p-3 text-center text-slate-300">
                                          {
                                            paint.unit
                                          }
                                        </td>

                                        <td className="p-3 text-center text-white font-semibold">
                                          {
                                            paint.quantity
                                          }
                                        </td>

                                        <td className="p-3 text-right text-green-400">
                                          ₹
                                          {
                                            paint.sellingPrice
                                          }
                                        </td>

                                        <td className="p-3 text-right text-white font-semibold">
                                          ₹
                                          {paint.sellingPrice *
                                            paint.quantity}
                                        </td>

                                      </tr>

                                    )
                                  )}

                                </tbody>

                              </table>

                            </div>

                          </div>

                        )}


                        {/* =================================================
                            ENAMEL DETAILS
                        ================================================= */}

                        {customer.enamels &&
                        customer.enamels.length >
                          0 && (

                          <div className="mb-5">

                            <div className="flex items-center gap-2 mb-3">

                              <div className="h-8 w-8 rounded-lg bg-orange-600/20 flex items-center justify-center">
                                🟥
                              </div>

                              <h4 className="text-lg font-semibold text-white">
                                Enamel Purchased
                              </h4>

                            </div>


                            <div className="overflow-x-auto rounded-xl border border-slate-700">

                              <table className="w-full min-w-[750px]">

                                <thead className="bg-slate-800">

                                  <tr>

                                    <th className="p-3 text-left text-slate-300">
                                      Enamel
                                    </th>

                                    <th className="p-3 text-left text-slate-300">
                                      Brand
                                    </th>

                                    <th className="p-3 text-center text-slate-300">
                                      Unit
                                    </th>

                                    <th className="p-3 text-center text-slate-300">
                                      Qty
                                    </th>

                                    <th className="p-3 text-right text-slate-300">
                                      Selling Price
                                    </th>

                                    <th className="p-3 text-right text-slate-300">
                                      Total
                                    </th>

                                  </tr>

                                </thead>


                                <tbody>

                                  {customer.enamels.map(
                                    (
                                      enamel,
                                      index
                                    ) => (

                                      <tr
                                        key={`enamel-${customer.id}-${index}`}
                                        className="border-t border-slate-700"
                                      >

                                        <td className="p-3 text-white font-medium">
                                          {
                                            enamel.enamelName
                                          }
                                        </td>

                                        <td className="p-3 text-slate-300">
                                          {
                                            enamel.brand
                                          }
                                        </td>

                                        <td className="p-3 text-center text-slate-300">
                                          {
                                            enamel.unit
                                          }
                                        </td>

                                        <td className="p-3 text-center text-white font-semibold">
                                          {
                                            enamel.quantity
                                          }
                                        </td>

                                        <td className="p-3 text-right text-green-400">
                                          ₹
                                          {
                                            enamel.sellingPrice
                                          }
                                        </td>

                                        <td className="p-3 text-right text-white font-semibold">
                                          ₹
                                          {enamel.sellingPrice *
                                            enamel.quantity}
                                        </td>

                                      </tr>

                                    )
                                  )}

                                </tbody>

                              </table>

                            </div>

                          </div>

                        )}


                        {/* =================================================
                            ACCESSORIES DETAILS
                        ================================================= */}

                        {customer.accessories &&
                        customer.accessories.length >
                          0 && (

                          <div className="mb-5">

                            <div className="flex items-center gap-2 mb-3">

                              <div className="h-8 w-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
                                🧰
                              </div>

                              <h4 className="text-lg font-semibold text-white">
                                Accessories
                              </h4>

                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                              {customer.accessories.map(
                                (
                                  item,
                                  index
                                ) => (

                                  <div
                                    key={`accessory-${customer.id}-${index}`}
                                    className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-3"
                                  >

                                    <span className="text-white font-medium">
                                      {
                                        item.name
                                      }
                                    </span>

                                    <span className="text-purple-400 font-semibold">
                                      ₹
                                      {
                                        item.price
                                      }
                                    </span>

                                  </div>

                                )
                              )}

                            </div>

                          </div>

                        )}


                        {/* =================================================
                            PAYMENT DETAILS
                        ================================================= */}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">

                          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">

                            <p className="text-sm text-slate-400">
                              Total Amount
                            </p>

                            <p className="text-xl font-bold text-white mt-1">
                              ₹
                              {
                                customer.totalAmount
                              }
                            </p>

                          </div>


                          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">

                            <p className="text-sm text-slate-400">
                              Paid Amount
                            </p>

                            <p className="text-xl font-bold text-green-400 mt-1">
                              ₹
                              {
                                customer.paidAmount
                              }
                            </p>

                          </div>


                          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">

                            <p className="text-sm text-slate-400">
                              Due Amount
                            </p>

                            {customer.pendingCleared ? (

                              <p className="text-xl font-bold text-green-400 mt-1">
                                CLEAR
                              </p>

                            ) : (

                              <p className="text-xl font-bold text-red-400 mt-1">
                                ₹
                                {
                                  customer.dueAmount
                                }
                              </p>

                            )}

                          </div>

                        </div>


                        {/* ================= CLOSE ================= */}

                        <div className="flex justify-end mt-5">

                          <button
                            type="button"
                            onClick={() =>
                              toggleDetails(
                                customer.id
                              )
                            }
                            className="rounded-lg bg-slate-700 px-5 py-2 text-white font-semibold hover:bg-slate-600"
                          >
                            Hide Details
                          </button>

                        </div>

                      </div>

                    </td>

                  </tr>

                )}

              </>
            );
          })}

        </tbody>

      </table>

    </div>
  );
}