"use client";

import { useState } from "react";
import { v4 as uuid } from "uuid";
import { Customer } from "@/types/customer";
import { addCustomer } from "@/lib/storage";

type Props = {
  category: "paint" | "timber";
};

export default function CustomerForm({ category }: Props) {
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");

  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");

  const [quantity, setQuantity] = useState("");

  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");

  const dueAmount =
const handleSave = () => {
  const customer: Customer = {
    id: uuid(),

    customerName,
    contact,

    productName,
    productCode,

    quantity:
      category === "timber"
        ? Number(quantity)
        : undefined,

    totalAmount: Number(totalAmount),
    paidAmount: Number(paidAmount),
    dueAmount,

    category,

    createdAt: new Date().toLocaleString(),
  };

  addCustomer(customer);

  alert("Customer Saved Successfully ✅");

  setCustomerName("");
  setContact("");
  setProductName("");
  setProductCode("");
  setQuantity("");
  setTotalAmount("");
  setPaidAmount("");
};