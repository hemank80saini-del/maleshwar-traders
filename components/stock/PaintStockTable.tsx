"use client";

import { Stock } from "@/types/stock";

type Props = {
  stock: Stock[];

  onEdit: (
    item: Stock
  ) => void;

  onEditVariant: (
    item: Stock,
    variant: NonNullable<
      Stock["variants"]
    >[number]
  ) => void;

  onDelete: (
    id: string
  ) => void;
};

export default function PaintStockTable({
  stock,
  onEdit,
  onEditVariant,
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

            <th className="p-3">
              Paint
            </th>

            <th className="p-3">
              Shade
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
              Stock Qty
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
                NEW VARIANT BASED STOCK
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

                      {/* PAINT */}

                      <td className="p-3 font-bold">

                        {index === 0
                          ? item.productName
                          : ""}

                      </td>

                      {/* SHADE */}

                      <td className="p-3 text-yellow-400">

                        {index === 0
                          ? item.productCode
                          : ""}

                      </td>

                      {/* BRAND */}

                      <td className="p-3">

                        {index === 0
                          ? item.brand
                          : ""}

                      </td>

                      {/* SIZE */}

                      <td className="p-3">

                        <span className="font-bold text-cyan-400">

                          {variant.size}{" "}

                          {variant.unit ===
                          "liter"
                            ? "Ltr"
                            : "Gram"}

                        </span>

                      </td>

                      {/* ACTUAL PRICE */}

                      <td className="p-3 text-orange-400">

                        ₹{" "}
                        {variant.price}

                      </td>

                      {/* SELLING PRICE */}

                      <td className="p-3 text-green-400">

                        ₹{" "}
                        {variant.sellingPrice}

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

                        {/* EVERY SIZE HAS ITS OWN EDIT */}

                        <button
                          type="button"
                          onClick={() =>
                            onEditVariant(
                              item,
                              variant
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mr-2"
                        >
                          Edit
                        </button>

                        {/* DELETE ONLY ONCE */}

                        {index === 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              onDelete(
                                item.id
                              )
                            }
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        )}

                      </td>

                    </tr>

                  )
                );
              }

              /*
                OLD STOCK DATA
              */

              return (
                <tr
                  key={item.id}
                  className="border-b border-slate-700 text-center text-white"
                >

                  <td className="p-3 font-bold">
                    {
                      item.productName
                    }
                  </td>

                  <td className="p-3 text-yellow-400">
                    {
                      item.productCode
                    }
                  </td>

                  <td className="p-3">
                    {item.brand}
                  </td>

                  <td className="p-3">
                    1 Ltr
                  </td>

                  <td className="p-3 text-orange-400">
                    ₹{" "}
                    {item.price}
                  </td>

                  <td className="p-3 text-green-400">
                    ₹{" "}
                    {item.sellingPrice}
                  </td>

                  <td
                    className={`p-3 font-bold ${
                      item.quantity <= 5
                        ? "text-red-500"
                        : "text-purple-400"
                    }`}
                  >
                    {
                      item.quantity
                    }
                  </td>

                  <td className="p-3">

                    <button
                      type="button"
                      onClick={() =>
                        onEdit(item)
                      }
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(
                          item.id
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              );

            }
          )}

        </tbody>

      </table>

    </div>
  );
}