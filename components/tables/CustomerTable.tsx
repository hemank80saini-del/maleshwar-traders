"use client";

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

          {customers.map((customer) => (

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


              {/* PRODUCT */}

              <td className="p-3">
                {customer.productName}
              </td>


              {/* CODE / CHANNEL */}

              <td className="p-3">

                {customer.category === "pop"
                  ? customer.popChannel ||
                    customer.productCode ||
                    "-"
                  : customer.productCode || "-"
                }

              </td>


              {/* QUANTITY */}

              <td className="p-3 text-center">

                {customer.category === "pop"
                  ? customer.popQuantity ??
                    customer.quantitySold ??
                    "-"
                  : customer.quantitySold ??
                    "-"
                }

              </td>


              {/* ACCESSORIES */}

              <td className="p-3">

                {customer.accessories &&
                customer.accessories.length > 0 ? (

                  <div className="space-y-1">

                    {customer.accessories.map(
                      (item, index) => (

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
                      editCustomer(customer)
                    }
                    className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                  >

                    Edit

                  </button>


                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={() =>
                      onDelete(customer.id)
                    }
                    className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                  >

                    Delete

                  </button>


                  {/* WHATSAPP */}

                  <button
                    type="button"
                    onClick={() =>
                      openWhatsApp(customer)
                    }
                    className="rounded bg-green-600 px-3 py-1 text-white font-semibold hover:bg-green-500"
                  >

                    WhatsApp

                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}