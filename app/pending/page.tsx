"use client";

import { useEffect, useMemo, useState } from "react";

import CustomerTable from "@/components/tables/CustomerTable";

import {
  getCustomers,
  deleteCustomer,
} from "@/lib/storage";

import { Customer } from "@/types/customer";

export default function PendingPage() {

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    loadPending();

  }, []);

  function loadPending() {

    const data = getCustomers().filter(
      (customer) => customer.dueAmount > 0
    );

    setCustomers(data);

  }

  function removeCustomer(id: string) {

    if (!confirm("Delete this customer?"))
      return;

    deleteCustomer(id);

    loadPending();

  }

  const filteredCustomers = useMemo(() => {

    const value = search.toLowerCase();

    return customers.filter((customer) =>

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

    );

  }, [customers, search]);

  const totalPending =
    customers.reduce(
      (sum, customer) =>
        sum + customer.dueAmount,
      0
    );
      return (

    <div className="min-h-screen bg-[#0f172a] p-8">

      <div className="max-w-7xl mx-auto bg-[#1e293b] rounded-2xl border border-green-700 shadow-xl p-8">

        <h1 className="text-5xl font-bold text-yellow-400 text-center mb-10">

          Pending Payments

        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="bg-slate-900 border border-red-500 rounded-xl p-6">

            <p className="text-gray-400">

              Total Pending Customers

            </p>

            <h2 className="text-4xl font-bold text-red-400 mt-2">

              {customers.length}

            </h2>

          </div>

          <div className="bg-slate-900 border border-yellow-500 rounded-xl p-6">

            <p className="text-gray-400">

              Total Pending Amount

            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-2">

              ₹ {totalPending}

            </h2>

          </div>

        </div>

        <input
          type="text"
          placeholder="Search Pending Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 rounded-xl bg-slate-900 border border-blue-500 text-white mb-8"
        />
                <CustomerTable
          customers={filteredCustomers}
          onDelete={removeCustomer}
          onEdit={() => {}}
        />

      </div>

    </div>

  );

}