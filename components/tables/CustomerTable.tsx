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

  return (
    <div className="mt-8 overflow-x-auto rounded-xl border border-slate-700">
      <table className="w-full">
        <thead className="bg-green-700 text-white">
          <tr>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Contact</th>
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Code</th>
            <th className="p-3 text-center">Total</th>
            <th className="p-3 text-center">Paid</th>
            <th className="p-3 text-center">Due</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="border-b border-slate-700 text-white"
            >
              <td className="p-3">{customer.customerName}</td>
              <td className="p-3">{customer.contact}</td>
              <td className="p-3">{customer.productName}</td>
              <td className="p-3">{customer.productCode}</td>
              <td className="p-3 text-center">
                ₹{customer.totalAmount}
              </td>
              <td className="p-3 text-center text-green-400">
                ₹{customer.paidAmount}
              </td>
              <td className="p-3 text-center text-red-400">
                ₹{customer.dueAmount}
              </td>

              <td className="p-3">
                <div className="flex justify-center gap-2">

                  <button
                   onClick={() => {

  localStorage.setItem(
    "editCustomer",
    JSON.stringify(customer)
  );

  if (customer.category === "paint") {

    router.push("/paints");

  } else {

    router.push("/timbers");

  }

}}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(customer.id)}
                    className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                  >
                    Delete
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