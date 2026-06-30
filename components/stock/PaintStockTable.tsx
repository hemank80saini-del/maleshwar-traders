"use client";

import { Stock } from "@/types/stock";

type Props = {
  stock: Stock[];
  onEdit: (item: Stock) => void;
  onDelete: (id: string) => void;
};

export default function PaintStockTable({
  stock,
  onEdit,
  onDelete,
}: Props) {
  if (stock.length === 0) {
    return (
      <div className="mt-8 bg-slate-800 rounded-xl p-6 text-center text-gray-300">
        No Paint Stock Available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-8 rounded-xl border border-slate-700">
      <table className="w-full">

        <thead className="bg-green-700 text-white">
          <tr>
            <th className="p-3">Paint</th>
            <th className="p-3">Shade</th>
            <th className="p-3">Brand</th>
            <th className="p-3">Qty</th>
            <th className="p-3">Price</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>

          {stock.map((item) => (

            <tr
              key={item.id}
              className="border-b border-slate-700 text-center text-white"
            >

              <td className="p-3">{item.productName}</td>

              <td className="p-3">{item.productCode}</td>

              <td className="p-3">{item.brand}</td>

              <td
                className={`p-3 font-bold ${
                  item.quantity <= 5
                    ? "text-red-500"
                    : "text-green-400"
                }`}
              >
                {item.quantity}
              </td>

              <td className="p-3">
                ₹ {item.price}
              </td>

              <td className="p-3">

                <button
                  onClick={() => onEdit(item)}
                  className="bg-blue-600 px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(item.id)}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>
    </div>
  );
}