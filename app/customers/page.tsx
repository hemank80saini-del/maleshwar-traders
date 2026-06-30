"use client";

import { useEffect, useMemo, useState } from "react";

import CustomerTable from "@/components/tables/CustomerTable";

import {
  getCustomers,
  deleteCustomer,
} from "@/lib/storage";

import { Customer } from "@/types/customer";

export default function CustomersPage() {

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    setCustomers(getCustomers());

  }, []);

  function refreshCustomers() {

    setCustomers(getCustomers());

  }

  function removeCustomer(id: string) {

    if (!confirm("Delete this customer?")) return;

    deleteCustomer(id);

    refreshCustomers();

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

      ||

      customer.productCode
        .toLowerCase()
        .includes(value)

    );

  }, [customers, search]);

  const totalCustomers =
    customers.length;

  const totalSales =
    customers.reduce(
      (sum, customer) =>
        sum + customer.totalAmount,
      0
    );

  const totalPaid =
    customers.reduce(
      (sum, customer) =>
        sum + customer.paidAmount,
      0
    );

  const totalPending =
    customers.reduce(
      (sum, customer) =>
        sum + customer.dueAmount,
      0
    );
      return (

    <div className="min-h-screen bg-[#0f172a] p-8">

      <div className="max-w-7xl mx-auto bg-[#1e293b] rounded-2xl border border-green-700 shadow-xl p-8">

        <h1 className="text-5xl font-bold text-green-400 text-center mb-10">

          Customers

        </h1>

        <div className="grid md:grid-cols-4 gap-5 mb-8">

          <div className="bg-slate-900 border border-blue-500 rounded-xl p-5">

            <p className="text-gray-400">
              Total Customers
            </p>

            <h2 className="text-4xl font-bold text-blue-400 mt-2">
              {totalCustomers}
            </h2>

          </div>

          <div className="bg-slate-900 border border-green-500 rounded-xl p-5">

            <p className="text-gray-400">
              Total Sales
            </p>

            <h2 className="text-4xl font-bold text-green-400 mt-2">
              ₹ {totalSales}
            </h2>

          </div>

          <div className="bg-slate-900 border border-yellow-500 rounded-xl p-5">

            <p className="text-gray-400">
              Total Paid
            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-2">
              ₹ {totalPaid}
            </h2>

          </div>

          <div className="bg-slate-900 border border-red-500 rounded-xl p-5">

            <p className="text-gray-400">
              Pending Amount
            </p>

            <h2 className="text-4xl font-bold text-red-400 mt-2">
              ₹ {totalPending}
            </h2>

          </div>

        </div>

        <input
          type="text"
          placeholder="Search Customer..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
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