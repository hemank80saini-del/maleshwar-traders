"use client";

import PaintStockForm from "@/components/stock/PaintStockForm";
import EnamelStockForm from "@/components/stock/EnamelStockForm";

export default function StockPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] py-10 px-4">

      <div className="max-w-7xl mx-auto">

        {/* PAGE TITLE */}

        <h1 className="text-5xl font-bold text-green-400 text-center mb-10">
          Stock Management
        </h1>


        {/* PAINT STOCK */}

        <PaintStockForm />


        {/* ENAMEL STOCK */}

        <EnamelStockForm />

      </div>

    </div>
  );
}