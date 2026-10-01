"use client";

import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import CustomerTable from "@/components/tables/CustomerTable";

import {
  addCustomer,
  getCustomers,
  deleteCustomer,
  updateCustomer,
} from "@/lib/storage";

import {
  getPaintStock,
  getEnamelStock,
  reduceStockVariant,
} from "@/lib/stockSupabase";

import { Customer } from "@/types/customer";
import { Stock } from "@/types/stock";

type PaintUnit = "liter" | "ml" | "gm";

type SalePaint = {
  paintName: string;
  shadeCode: string;
  brand: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  unit: PaintUnit;
  variantId?: string;
};

type SaleEnamel = {
  enamelName: string;
  brand: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  unit: PaintUnit;
  variantId?: string;
};

export default function PaintsPage() {
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");

  const [paintName, setPaintName] = useState("");
  const [paintNo, setPaintNo] = useState("");
  const [brand, setBrand] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [price, setPrice] = useState("");
  const [availableStock, setAvailableStock] = useState(0);
  const [quantitySold, setQuantitySold] = useState("");

  const [paintUnit, setPaintUnit] =
    useState<PaintUnit>("liter");

  const [paintSize, setPaintSize] = useState(1);
  const [paintVariantId, setPaintVariantId] = useState("");

  const [paints, setPaints] = useState<SalePaint[]>([]);

  const [enamelName, setEnamelName] = useState("");
  const [enamelBrand, setEnamelBrand] = useState("");
  const [enamelPurchasePrice, setEnamelPurchasePrice] =
    useState("");
  const [enamelSellingPrice, setEnamelSellingPrice] =
    useState("");
  const [enamelAvailableStock, setEnamelAvailableStock] =
    useState(0);
  const [enamelQuantity, setEnamelQuantity] = useState("");

  const [enamelUnit, setEnamelUnit] =
    useState<PaintUnit>("liter");

  const [enamelVariantId, setEnamelVariantId] =
    useState("");

  const [selectedEnamelStockId, setSelectedEnamelStockId] =
    useState("");

  const [enamels, setEnamels] =
    useState<SaleEnamel[]>([]);

  const [accessoryName, setAccessoryName] =
    useState("");

  const [accessoryPrice, setAccessoryPrice] =
    useState("");

  const [accessories, setAccessories] =
    useState<
      { name: string; price: number }[]
    >([]);

  const [paidAmount, setPaidAmount] =
    useState("");

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [paintStock, setPaintStock] =
    useState<Stock[]>([]);

  const [enamelStock, setEnamelStock] =
    useState<Stock[]>([]);

  const [selectedStockId, setSelectedStockId] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const paintsTotal =
    paints.reduce(
      (sum, paint) =>
        sum +
        paint.sellingPrice *
          paint.quantity,
      0
    );

  const accessoriesTotal =
    accessories.reduce(
      (sum, item) =>
        sum + item.price,
      0
    );

  const enamelsTotal =
    enamels.reduce(
      (sum, enamel) =>
        sum +
        enamel.sellingPrice *
          enamel.quantity,
      0
    );

  const totalAmount =
    paintsTotal +
    enamelsTotal +
    accessoriesTotal;

  const dueAmount =
    totalAmount -
    (Number(paidAmount) || 0);

async function loadCustomers() {
  const allCustomers = await getCustomers();

  const customerData = allCustomers.filter(
    (item) =>
      item.category === "paint"
  );

    const stockData =
      await getPaintStock();

    const enamelData =
      await getEnamelStock();

    setCustomers(customerData);
    setPaintStock(stockData);
    setEnamelStock(enamelData);
  }

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {
    const refreshStock = () => {
      void loadCustomers();
    };

    window.addEventListener(
      "focus",
      refreshStock
    );

    document.addEventListener(
      "visibilitychange",
      refreshStock
    );

    const initialize = async () => {

    await loadCustomers();

    const data =
      localStorage.getItem(
        "editCustomer"
      );

    if (!data) {
      return;
    }

    const customer: Customer =
      JSON.parse(data);

    setEditingId(customer.id);

    setCustomerName(
      customer.customerName
    );

    setContact(
      customer.contact
    );

    if (
      customer.paints &&
      customer.paints.length > 0
    ) {
      const loadedPaints =
        customer.paints.map(
          (paint) => ({
            ...paint,
            unit:
              paint.unit ||
              "liter",
          })
        );

      setPaints(
        loadedPaints
      );

      const firstPaint =
        loadedPaints[0];

      setPaintName(
        firstPaint.paintName
      );

      setPaintNo(
        firstPaint.shadeCode
      );

      setBrand(
        firstPaint.brand
      );

      setPurchasePrice(
        firstPaint.purchasePrice.toString()
      );

      setPrice(
        firstPaint.sellingPrice.toString()
      );

      setPaintUnit(
        firstPaint.unit
      );

      const stockItem =
        (await getPaintStock()).find(
          (item) =>
            item.productCode
              .toLowerCase()
              .trim() ===
            firstPaint.shadeCode
              .toLowerCase()
              .trim()
        );

      if (stockItem) {
        const variant =
          stockItem.variants?.find(
            (item) =>
              (firstPaint as SalePaint).variantId
                ? item.id ===
                  (firstPaint as SalePaint).variantId
                : item.unit ===
                  firstPaint.unit
          );

        if (variant) {
          setPaintVariantId(
            variant.id
          );

          setPaintSize(
            variant.size
          );

          setAvailableStock(
            variant.quantity
          );
        } else {
          setAvailableStock(
            stockItem.quantity
          );
        }
      }

      setQuantitySold(
        firstPaint.quantity.toString()
      );
    } else {
      setPaintName(
        customer.productName
      );

      setPaintNo(
        customer.productCode
      );

      const stockItem =
        (await getPaintStock()).find(
          (item) =>
            item.productName ===
            customer.productName
        );

      if (stockItem) {
        setBrand(
          stockItem.brand
        );

        setPurchasePrice(
          stockItem.price?.toString() ||
          ""
        );

        setPrice(
          stockItem.sellingPrice?.toString() ||
          stockItem.price?.toString() ||
          ""
        );

        setAvailableStock(
          stockItem.quantity
        );
      }

      setQuantitySold(
        customer.quantitySold?.toString() ||
        ""
      );

      setPaintUnit("liter");
    }

    setEnamels(
      customer.enamels ||
      []
    );

    if (
      customer.enamels &&
      customer.enamels.length > 0
    ) {
      const firstEnamel =
        customer.enamels[0];

      const currentEnamelStock =
        await getEnamelStock();

      const stockItem =
        currentEnamelStock.find(
          (item) =>
            item.productName
              .toLowerCase()
              .trim() ===
            firstEnamel.enamelName
              .toLowerCase()
              .trim()
        );

      setEnamelName(
        firstEnamel.enamelName
      );

      setEnamelBrand(
        firstEnamel.brand
      );

      setEnamelPurchasePrice(
        firstEnamel.purchasePrice.toString()
      );

      setEnamelSellingPrice(
        firstEnamel.sellingPrice.toString()
      );

      setEnamelQuantity(
        firstEnamel.quantity.toString()
      );

      setEnamelUnit(
        firstEnamel.unit ||
        "liter"
      );

      if (stockItem) {
        setSelectedEnamelStockId(
          stockItem.id
        );

        const variant =
          stockItem.variants?.find(
            (item) =>
              (firstEnamel as SaleEnamel).variantId
                ? item.id ===
                  (firstEnamel as SaleEnamel).variantId
                : item.unit ===
                  firstEnamel.unit
          );

        if (variant) {
          setEnamelVariantId(
            variant.id
          );

          setEnamelAvailableStock(
            variant.quantity
          );
        } else {
          setEnamelAvailableStock(
            stockItem.quantity
          );
        }
      }
    }

    setAccessories(
      customer.accessories ||
      []
    );

    setPaidAmount(
      customer.paidAmount?.toString() ||
      ""
    );


    };

    void initialize();

    return () => {
      window.removeEventListener(
        "focus",
        refreshStock
      );

      document.removeEventListener(
        "visibilitychange",
        refreshStock
      );
    };
  }, []);

  /* eslint-enable react-hooks/set-state-in-effect */

  async function getFreshPaintStock() {
    const latest =
      await getPaintStock();

    setPaintStock(latest);

    return latest;
  }

  async function getFreshEnamelStock() {
    const latest =
      await getEnamelStock();

    setEnamelStock(latest);

    return latest;
  }

  function getReservedPaintQuantity(
    variantId: string,
    shadeCode: string,
    unit: PaintUnit
  ) {
    return paints
      .filter(
        (paint) =>
          paint.shadeCode
            .toLowerCase()
            .trim() ===
            shadeCode
              .toLowerCase()
              .trim() &&
          paint.unit === unit &&
          (
            paint.variantId
              ? paint.variantId ===
                variantId
              : true
          )
      )
      .reduce(
        (sum, paint) =>
          sum + paint.quantity,
        0
      );
  }

  function getReservedEnamelQuantity(
    variantId: string,
    enamelNameValue: string,
    unit: PaintUnit
  ) {
    return enamels
      .filter(
        (enamel) =>
          enamel.enamelName
            .toLowerCase()
            .trim() ===
            enamelNameValue
              .toLowerCase()
              .trim() &&
          enamel.unit === unit &&
          (
            enamel.variantId
              ? enamel.variantId ===
                variantId
              : true
          )
      )
      .reduce(
        (sum, enamel) =>
          sum + enamel.quantity,
        0
      );
  }

  async function selectPaint(
    selected: Stock,
    selectedUnit?: PaintUnit
  ) {
    const latestStock =
      await getFreshPaintStock();

    const freshSelected =
      latestStock.find(
        (item) =>
          item.id ===
          selected.id
      ) || selected;

    setPaintName(
      freshSelected.productName
    );

    setPaintNo(
      freshSelected.productCode
    );

    setBrand(
      freshSelected.brand
    );

    const variants =
      freshSelected.variants ||
      [];

    const variant =
      selectedUnit
        ? variants.find(
            (item) =>
              item.unit ===
              selectedUnit
          )
        : variants[0];

    if (variant) {
      const reserved =
        getReservedPaintQuantity(
          variant.id,
          freshSelected.productCode,
          variant.unit as PaintUnit
        );

      setPaintVariantId(
        variant.id
      );

      setPaintSize(
        variant.size
      );

      setPaintUnit(
        variant.unit as PaintUnit
      );

      setPurchasePrice(
        variant.price?.toString() ||
        ""
      );

      setPrice(
        variant.sellingPrice?.toString() ||
        ""
      );

      setAvailableStock(
        Math.max(
          0,
          variant.quantity -
            reserved
        )
      );
    } else {
      const reserved =
        getReservedPaintQuantity(
          `${freshSelected.id}-old`,
          freshSelected.productCode,
          "liter"
        );

      setPaintVariantId(
        ""
      );

      setPaintUnit(
        "liter"
      );

      setPaintSize(
        1
      );

      setPurchasePrice(
        freshSelected.price?.toString() ||
        ""
      );

      setPrice(
        freshSelected.sellingPrice?.toString() ||
        freshSelected.price?.toString() ||
        ""
      );

      setAvailableStock(
        Math.max(
          0,
          freshSelected.quantity -
            reserved
        )
      );
    }
  }

  async function handlePaintSelect(
    value: string
  ) {
    setSelectedStockId(
      value
    );

    const latestStock =
      await getFreshPaintStock();

    const selected =
      latestStock.find(
        (item) =>
          item.id === value
      );

    if (!selected) {
      setPaintName("");
      setPaintNo("");
      setBrand("");
      setPurchasePrice("");
      setPrice("");
      setAvailableStock(0);
      setPaintVariantId("");
      setPaintSize(1);
      return;
    }

    setPaintName(
      selected.productName
    );

    setPaintNo(
      selected.productCode
    );

    setBrand(
      selected.brand
    );

    const variants =
      selected.variants ||
      [];

    if (
      variants.length > 0
    ) {
      const variant =
        variants[0];

      const reserved =
        getReservedPaintQuantity(
          variant.id,
          selected.productCode,
          variant.unit as PaintUnit
        );

      setPaintVariantId(
        variant.id
      );

      setPaintUnit(
        variant.unit as PaintUnit
      );

      setPaintSize(
        variant.size
      );

      setPurchasePrice(
        variant.price?.toString() ||
        ""
      );

      setPrice(
        variant.sellingPrice?.toString() ||
        ""
      );

      setAvailableStock(
        Math.max(
          0,
          variant.quantity -
            reserved
        )
      );
    } else {
      const reserved =
        getReservedPaintQuantity(
          `${selected.id}-old`,
          selected.productCode,
          "liter"
        );

      setPaintVariantId(
        ""
      );

      setPaintUnit(
        "liter"
      );

      setPaintSize(
        1
      );

      setPurchasePrice(
        selected.price?.toString() ||
        ""
      );

      setPrice(
        selected.sellingPrice?.toString() ||
        selected.price?.toString() ||
        ""
      );

      setAvailableStock(
        Math.max(
          0,
          selected.quantity -
            reserved
        )
      );
    }
  }

  async function handlePaintUnitSelect(
    value: string
  ) {
    const latestStock =
      await getFreshPaintStock();

    const selected =
      latestStock.find(
        (item) =>
          item.id ===
          selectedStockId
      );

    if (!selected) return;

    const variant =
      selected.variants?.find(
        (item) =>
          item.id === value
      );

    if (variant) {
      const reserved =
        getReservedPaintQuantity(
          variant.id,
          selected.productCode,
          variant.unit as PaintUnit
        );

      setPaintVariantId(
        variant.id
      );

      setPaintUnit(
        variant.unit as PaintUnit
      );

      setPaintSize(
        variant.size
      );

      setPurchasePrice(
        variant.price?.toString() ||
        ""
      );

      setPrice(
        variant.sellingPrice?.toString() ||
        ""
      );

      setAvailableStock(
        Math.max(
          0,
          variant.quantity -
            reserved
        )
      );

      return;
    }

    const reserved =
      getReservedPaintQuantity(
        `${selected.id}-old`,
        selected.productCode,
        value as PaintUnit
      );

    setPaintVariantId(
      ""
    );

    setPaintUnit(
      value as PaintUnit
    );

    setPaintSize(
      1
    );

    setPurchasePrice(
      selected.price?.toString() ||
      ""
    );

    setPrice(
      selected.sellingPrice?.toString() ||
      selected.price?.toString() ||
      ""
    );

    setAvailableStock(
      Math.max(
        0,
        selected.quantity -
          reserved
      )
    );
  }

  async function handleShadeCode(
    code: string
  ) {
    setPaintNo(code);

    const latestStock =
      await getFreshPaintStock();

    const selected =
      latestStock.find(
        (item) =>
          item.productCode
            .toLowerCase()
            .trim() ===
          code
            .toLowerCase()
            .trim()
      );

    if (selected) {
      setSelectedStockId(
        selected.id
      );

      selectPaint(
        selected
      );
    } else {
      setSelectedStockId("");
      setPaintName("");
      setBrand("");
      setPurchasePrice("");
      setPrice("");
      setAvailableStock(0);
      setPaintVariantId("");
    }
  }

  async function addPaint() {
    if (
      !paintName ||
      !paintNo ||
      !price ||
      !quantitySold
    ) {
      alert(
        "Please select a paint, shade code and quantity."
      );
      return;
    }

    const quantity =
      Number(quantitySold);

    if (quantity <= 0) {
      alert(
        "Please enter a valid quantity."
      );
      return;
    }

    const latestStock =
      await getFreshPaintStock();

    const stockItem =
      latestStock.find(
        (item) =>
          item.productCode
            .toLowerCase()
            .trim() ===
          paintNo
            .toLowerCase()
            .trim()
      );

    if (!stockItem) {
      alert(
        "Paint stock not found."
      );
      return;
    }

    const variant =
      stockItem.variants?.find(
        (item) =>
          paintVariantId
            ? item.id ===
              paintVariantId
            : item.unit ===
              paintUnit
      );

    const stockQuantity =
      variant
        ? variant.quantity
        : stockItem.quantity;

    const variantKey =
      variant?.id ||
      `${stockItem.id}-old`;

    const alreadyReserved =
      getReservedPaintQuantity(
        variantKey,
        stockItem.productCode,
        paintUnit
      );

    const availableForThisSale =
      Math.max(
        0,
        stockQuantity -
          alreadyReserved
      );

    if (
      quantity >
      availableForThisSale
    ) {
      alert(
        `Not enough ${paintUnit} stock available. Available: ${availableForThisSale}`
      );
      return;
    }

    const existingIndex =
      paints.findIndex(
        (paint) =>
          paint.shadeCode
            .toLowerCase()
            .trim() ===
            paintNo
              .toLowerCase()
              .trim() &&
          paint.unit ===
            paintUnit &&
          (
            paintVariantId
              ? paint.variantId ===
                paintVariantId
              : !paint.variantId
          )
      );

    let updatedPaints:
      SalePaint[];

    if (
      existingIndex !==
      -1
    ) {
      updatedPaints =
        [...paints];

      updatedPaints[
        existingIndex
      ] = {
        ...updatedPaints[
          existingIndex
        ],
        quantity:
          updatedPaints[
            existingIndex
          ].quantity +
          quantity,
      };
    } else {
      const newPaint:
        SalePaint = {
        paintName,
        shadeCode:
          paintNo,
        brand,
        purchasePrice:
          Number(
            purchasePrice
          ) || 0,
        sellingPrice:
          Number(price),
        quantity,
        unit:
          paintUnit,
        variantId:
          paintVariantId ||
          undefined,
      };

      updatedPaints = [
        ...paints,
        newPaint,
      ];
    }

    setPaints(
      updatedPaints
    );

    setAvailableStock(
      Math.max(
        0,
        availableForThisSale -
          quantity
      )
    );

    setQuantitySold("");
  }

  async function removePaint(
    index: number
  ) {
    const removedPaint =
      paints[index];

    if (!removedPaint) {
      return;
    }

    const updated =
      paints.filter(
        (_, i) =>
          i !== index
      );

    setPaints(
      updated
    );

    const latestStock =
      await getPaintStock();

    const stockItem =
      latestStock.find(
        (item) =>
          item.productCode
            .toLowerCase()
            .trim() ===
          removedPaint.shadeCode
            .toLowerCase()
            .trim()
      );

    if (!stockItem) {
      return;
    }

    const variant =
      stockItem.variants?.find(
        (item) =>
          removedPaint.variantId
            ? item.id ===
              removedPaint.variantId
            : item.unit ===
              removedPaint.unit
      );

    const totalStock =
      variant
        ? variant.quantity
        : stockItem.quantity;

    const remainingUsed =
      updated
        .filter(
          (item) =>
            item.shadeCode
              .toLowerCase()
              .trim() ===
            removedPaint.shadeCode
              .toLowerCase()
              .trim() &&
            item.unit ===
              removedPaint.unit &&
            (
              removedPaint.variantId
                ? item.variantId ===
                  removedPaint.variantId
                : !item.variantId
            )
        )
        .reduce(
          (sum, item) =>
            sum +
            item.quantity,
          0
        );

    setAvailableStock(
      Math.max(
        0,
        totalStock -
          remainingUsed
      )
    );
  }
    /* =======================================================
     SELECT ENAMEL
  ======================================================= */

  async function handleEnamelSelect(value: string) {
    setSelectedEnamelStockId(value);

    const latestStock = await getFreshEnamelStock();

    const selected = latestStock.find(
      (item) => item.id === value
    );

    if (!selected) {
      setEnamelName("");
      setEnamelBrand("");
      setEnamelPurchasePrice("");
      setEnamelSellingPrice("");
      setEnamelAvailableStock(0);
      setEnamelQuantity("");
      setEnamelVariantId("");
      setSelectedEnamelStockId("");
      setEnamelUnit("liter");
      return;
    }

    setEnamelName(
      selected.productName
    );

    setEnamelBrand(
      selected.brand
    );

    const variants =
      selected.variants || [];

    if (variants.length > 0) {
      const variant =
        variants[0];

      const reserved =
        getReservedEnamelQuantity(
          variant.id,
          selected.productName,
          variant.unit as PaintUnit
        );

      setEnamelVariantId(
        variant.id
      );

      setEnamelUnit(
        variant.unit as PaintUnit
      );

      setEnamelPurchasePrice(
        variant.price?.toString() || ""
      );

      setEnamelSellingPrice(
        variant.sellingPrice?.toString() || ""
      );

      setEnamelAvailableStock(
        Math.max(
          0,
          variant.quantity -
            reserved
        )
      );
    } else {
      const reserved =
        getReservedEnamelQuantity(
          `${selected.id}-old`,
          selected.productName,
          "liter"
        );

      setEnamelVariantId("");

      setEnamelUnit("liter");

      setEnamelPurchasePrice(
        selected.price?.toString() || ""
      );

      setEnamelSellingPrice(
        selected.sellingPrice?.toString() ||
        selected.price?.toString() ||
        ""
      );

      setEnamelAvailableStock(
        Math.max(
          0,
          selected.quantity -
            reserved
        )
      );
    }
  }


  /* =======================================================
     SELECT ENAMEL SIZE / UNIT
  ======================================================= */

  async function handleEnamelUnitSelect(
    value: string
  ) {
    const latestStock =
      await getFreshEnamelStock();

    const selected =
      latestStock.find(
        (item) =>
          item.id ===
          selectedEnamelStockId
      );

    if (!selected) return;

    const variant =
      selected.variants?.find(
        (item) =>
          item.id === value
      );

    if (variant) {
      const reserved =
        getReservedEnamelQuantity(
          variant.id,
          selected.productName,
          variant.unit as PaintUnit
        );

      setEnamelVariantId(
        variant.id
      );

      setEnamelUnit(
        variant.unit as PaintUnit
      );

      setEnamelPurchasePrice(
        variant.price?.toString() ||
        ""
      );

      setEnamelSellingPrice(
        variant.sellingPrice?.toString() ||
        ""
      );

      setEnamelAvailableStock(
        Math.max(
          0,
          variant.quantity -
            reserved
        )
      );

      return;
    }

    let selectedUnit:
      PaintUnit = "liter";

    if (
      value === "legacy-liter" ||
      value === "liter"
    ) {
      selectedUnit =
        "liter";
    } else if (
      value === "legacy-ml" ||
      value === "ml"
    ) {
      selectedUnit =
        "ml";
    } else if (
      value === "legacy-gm" ||
      value === "gm"
    ) {
      selectedUnit =
        "gm";
    }

    const reserved =
      getReservedEnamelQuantity(
        `${selected.id}-old`,
        selected.productName,
        selectedUnit
      );

    setEnamelUnit(
      selectedUnit
    );

    setEnamelVariantId(
      ""
    );

    setEnamelPurchasePrice(
      selected.price?.toString() ||
      ""
    );

    setEnamelSellingPrice(
      selected.sellingPrice?.toString() ||
      selected.price?.toString() ||
      ""
    );

    setEnamelAvailableStock(
      Math.max(
        0,
        selected.quantity -
          reserved
      )
    );
  }


  /* =======================================================
     ADD ENAMEL
  ======================================================= */

  async function addEnamel() {
    if (
      !enamelName ||
      !enamelSellingPrice ||
      !enamelQuantity
    ) {
      alert(
        "Please select an enamel and enter quantity."
      );
      return;
    }

    const quantity =
      Number(enamelQuantity);

    if (quantity <= 0) {
      alert(
        "Please enter a valid enamel quantity."
      );
      return;
    }

    const latestStock =
      await getFreshEnamelStock();

    const stockItem =
      latestStock.find(
        (item) =>
          item.productName
            .toLowerCase()
            .trim() ===
          enamelName
            .toLowerCase()
            .trim()
      );

    if (!stockItem) {
      alert(
        "Enamel stock not found."
      );
      return;
    }

    const variant =
      stockItem.variants?.find(
        (item) =>
          enamelVariantId
            ? item.id ===
              enamelVariantId
            : item.unit ===
              enamelUnit
      );

    const stockQuantity =
      variant
        ? variant.quantity
        : stockItem.quantity;

    const variantKey =
      variant?.id ||
      `${stockItem.id}-old`;

    const alreadyReserved =
      getReservedEnamelQuantity(
        variantKey,
        stockItem.productName,
        enamelUnit
      );

    const availableForThisSale =
      Math.max(
        0,
        stockQuantity -
          alreadyReserved
      );

    if (
      quantity >
      availableForThisSale
    ) {
      alert(
        `Not enough enamel stock available. Available: ${availableForThisSale}`
      );
      return;
    }

    const existingIndex =
      enamels.findIndex(
        (enamel) =>
          enamel.enamelName
            .toLowerCase()
            .trim() ===
          enamelName
            .toLowerCase()
            .trim() &&
          enamel.unit ===
            enamelUnit &&
          (
            enamelVariantId
              ? enamel.variantId ===
                enamelVariantId
              : !enamel.variantId
          )
      );

    let updatedEnamels:
      SaleEnamel[];

    if (
      existingIndex !==
      -1
    ) {
      updatedEnamels =
        [...enamels];

      updatedEnamels[
        existingIndex
      ] = {
        ...updatedEnamels[
          existingIndex
        ],

        quantity:
          updatedEnamels[
            existingIndex
          ].quantity +
          quantity,
      };
    } else {
      updatedEnamels = [
        ...enamels,

        {
          enamelName,

          brand:
            enamelBrand,

          purchasePrice:
            Number(
              enamelPurchasePrice
            ) || 0,

          sellingPrice:
            Number(
              enamelSellingPrice
            ),

          quantity,

          unit:
            enamelUnit,

          variantId:
            enamelVariantId ||
            undefined,
        },
      ];
    }

    setEnamels(
      updatedEnamels
    );

    /*
      IMPORTANT:
      Add karte hi available stock
      turant kam hoga.
    */
    setEnamelAvailableStock(
      Math.max(
        0,
        availableForThisSale -
          quantity
      )
    );

    setEnamelQuantity("");
  }


  /* =======================================================
     REMOVE ENAMEL
  ======================================================= */

  async function removeEnamel(
    index: number
  ) {
    const removed =
      enamels[index];

    if (!removed) {
      return;
    }

    const updated =
      enamels.filter(
        (_, i) =>
          i !== index
      );

    setEnamels(
      updated
    );

    if (
      removed.enamelName
        .toLowerCase()
        .trim() !==
        enamelName
          .toLowerCase()
          .trim() ||
      removed.unit !==
        enamelUnit
    ) {
      return;
    }

    const latestStock =
      await getFreshEnamelStock();

    const stockItem =
      latestStock.find(
        (item) =>
          item.productName
            .toLowerCase()
            .trim() ===
          removed.enamelName
            .toLowerCase()
            .trim()
      );

    if (!stockItem) {
      return;
    }

    const variant =
      stockItem.variants?.find(
        (item) =>
          removed.variantId
            ? item.id ===
              removed.variantId
            : item.unit ===
              removed.unit
      );

    const stockQuantity =
      variant
        ? variant.quantity
        : stockItem.quantity;

    const remainingReserved =
      updated
        .filter(
          (item) =>
            item.enamelName
              .toLowerCase()
              .trim() ===
            removed.enamelName
              .toLowerCase()
              .trim() &&
            item.unit ===
              removed.unit &&
            (
              removed.variantId
                ? item.variantId ===
                  removed.variantId
                : !item.variantId
            )
        )
        .reduce(
          (sum, item) =>
            sum +
            item.quantity,
          0
        );

    setEnamelAvailableStock(
      Math.max(
        0,
        stockQuantity -
          remainingReserved
      )
    );
  }


  /* =======================================================
     ADD ACCESSORY
  ======================================================= */

  function addAccessory() {
    const name =
      accessoryName.trim();

    const priceValue =
      Number(
        accessoryPrice
      );

    if (!name) {
      alert(
        "Please enter accessory name."
      );
      return;
    }

    if (
      !accessoryPrice ||
      priceValue <= 0
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

        price:
          priceValue,
      },
    ]);

    setAccessoryName("");

    setAccessoryPrice("");
  }


  /* =======================================================
     REMOVE ACCESSORY
  ======================================================= */

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


  /* =======================================================
     CLEAR FORM
  ======================================================= */

  function clearForm() {
    setCustomerName("");

    setContact("");

    setPaintName("");

    setPaintNo("");

    setBrand("");

    setPurchasePrice("");

    setPrice("");

    setAvailableStock(0);

    setQuantitySold("");

    setPaintUnit("liter");

    setPaintSize(1);

    setPaintVariantId("");

    setSelectedStockId("");

    setPaints([]);

    setEnamelName("");

    setEnamelBrand("");

    setEnamelPurchasePrice("");

    setEnamelSellingPrice("");

    setEnamelAvailableStock(0);

    setEnamelQuantity("");

    setEnamelUnit("liter");

    setEnamelVariantId("");

    setSelectedEnamelStockId("");

    setEnamels([]);

    setAccessoryName("");

    setAccessoryPrice("");

    setAccessories([]);

    setPaidAmount("");

    setEditingId(null);
  }


  /* =======================================================
     SAVE CUSTOMER
  ======================================================= */

  async function saveCustomer() {
    if (
      customerName.trim() === "" ||
      contact.trim() === ""
    ) {
      alert(
        "Please fill customer details."
      );
      return;
    }

    if (
      paints.length === 0 &&
      enamels.length === 0
    ) {
      alert(
        "Please add at least one paint or enamel."
      );
      return;
    }

    /*
      Refresh stock before final validation.
      Isse latest price/quantity use hogi.
    */
    const latestPaintStock =
      await getPaintStock();

    const latestEnamelStock =
      await getEnamelStock();

    setPaintStock(
      latestPaintStock
    );

    setEnamelStock(
      latestEnamelStock
    );

    /* =====================================================
       FINAL PAINT STOCK VALIDATION
    ===================================================== */

    for (
      const paint of paints
    ) {
      const stockItem =
        latestPaintStock.find(
          (item) =>
            item.productCode
              .toLowerCase()
              .trim() ===
            paint.shadeCode
              .toLowerCase()
              .trim()
        );

      if (!stockItem) {
        alert(
          `${paint.paintName} stock not found.`
        );
        return;
      }

      if (!editingId) {
        const variant =
          stockItem.variants?.find(
            (item) =>
              paint.variantId
                ? item.id ===
                  paint.variantId
                : item.unit ===
                  paint.unit
          );

        const stockQuantity =
          variant
            ? variant.quantity
            : stockItem.quantity;

        if (
          paint.quantity >
          stockQuantity
        ) {
          alert(
            `Not enough ${paint.unit} stock for ${paint.paintName}. Available: ${stockQuantity}`
          );
          return;
        }
      }
    }

    /* =====================================================
       FINAL ENAMEL STOCK VALIDATION
    ===================================================== */

    for (
      const enamel of enamels
    ) {
      const stockItem =
        latestEnamelStock.find(
          (item) =>
            item.productName
              .toLowerCase()
              .trim() ===
            enamel.enamelName
              .toLowerCase()
              .trim()
        );

      if (!stockItem) {
        alert(
          `${enamel.enamelName} enamel stock not found.`
        );
        return;
      }

      if (!editingId) {
        const variant =
          stockItem.variants?.find(
            (item) =>
              enamel.variantId
                ? item.id ===
                  enamel.variantId
                : item.unit ===
                  enamel.unit
          );

        const stockQuantity =
          variant
            ? variant.quantity
            : stockItem.quantity;

        if (
          enamel.quantity >
          stockQuantity
        ) {
          alert(
            `Not enough ${enamel.unit} enamel stock for ${enamel.enamelName}. Available: ${stockQuantity}`
          );
          return;
        }
      }
    }

    const firstItem =
      paints[0];

    const firstEnamel =
      enamels[0];

    const customer: Customer = {
      id:
        editingId ??
        uuid(),

      category:
        "paint",

      customerName,

      contact,

      productName:
        firstItem?.paintName ||
        firstEnamel?.enamelName ||
        "Enamel",

      productCode:
        firstItem?.shadeCode ||
        "",

      quantitySold:
        firstItem?.quantity ||
        firstEnamel?.quantity ||
        0,

      paints,

      enamels,

      totalAmount,

      paidAmount:
        Number(
          paidAmount
        ) || 0,

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
        "Customer Updated Successfully!"
      );
    } else {
      addCustomer(
        customer
      );

      /* ==================================================
         REDUCE PAINT STOCK
      ================================================== */

      for (
        const paint of paints
      ) {
        const stockItem =
          latestPaintStock.find(
            (item) =>
              item.productCode
                .toLowerCase()
                .trim() ===
              paint.shadeCode
                .toLowerCase()
                .trim()
          );

        if (stockItem) {
          const variant =
            stockItem.variants?.find(
              (item) =>
                paint.variantId
                  ? item.id ===
                    paint.variantId
                  : item.unit ===
                    paint.unit
            );

          await reduceStockVariant(
            stockItem.id,

            paint.variantId ||
              variant?.id ||
              `${stockItem.id}-old`,

            paint.quantity
          );
        }
      }

      /* ==================================================
         REDUCE ENAMEL STOCK
      ================================================== */

      for (
        const enamel of enamels
      ) {
        const stockItem =
          latestEnamelStock.find(
            (item) =>
              item.productName
                .toLowerCase()
                .trim() ===
              enamel.enamelName
                .toLowerCase()
                .trim()
          );

        if (stockItem) {
          const variant =
            stockItem.variants?.find(
              (item) =>
                enamel.variantId
                  ? item.id ===
                    enamel.variantId
                  : item.unit ===
                    enamel.unit
            );

          await reduceStockVariant(
            stockItem.id,

            enamel.variantId ||
              variant?.id ||
              `${stockItem.id}-old`,

            enamel.quantity
          );
        }
      }

      alert(
        "Customer Saved Successfully!"
      );
    }

    loadCustomers();

    clearForm();
  }


  /* =======================================================
     DELETE CUSTOMER
  ======================================================= */

  function removeCustomer(
    id: string
  ) {
    if (
      !confirm(
        "Delete this customer?"
      )
    ) {
      return;
    }

    deleteCustomer(id);

    loadCustomers();
  }


  /* =======================================================
     EDIT CUSTOMER
  ======================================================= */

  async function editCustomer(
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

    if (
      customer.paints &&
      customer.paints.length > 0
    ) {
      const loadedPaints =
        customer.paints.map(
          (paint) => ({
            ...paint,

            unit:
              paint.unit ||
              "liter",
          })
        );

      setPaints(
        loadedPaints
      );

      const firstPaint =
        loadedPaints[0];

      setPaintName(
        firstPaint.paintName
      );

      setPaintNo(
        firstPaint.shadeCode
      );

      setBrand(
        firstPaint.brand
      );

      setPurchasePrice(
        firstPaint.purchasePrice.toString()
      );

      setPrice(
        firstPaint.sellingPrice.toString()
      );

      setPaintUnit(
        firstPaint.unit
      );

      setQuantitySold(
        firstPaint.quantity.toString()
      );

      const latestStock =
        await getPaintStock();

      const stockItem =
        latestStock.find(
          (item) =>
            item.productCode
              .toLowerCase()
              .trim() ===
            firstPaint.shadeCode
              .toLowerCase()
              .trim()
        );

      if (stockItem) {
        const variant =
          stockItem.variants?.find(
            (item) =>
              (firstPaint as SalePaint).variantId
                ? item.id ===
                  (firstPaint as SalePaint).variantId
                : item.unit ===
                  firstPaint.unit
          );

        if (variant) {
          setPaintVariantId(
            variant.id
          );

          setPaintSize(
            variant.size
          );

          setAvailableStock(
            Math.max(
              0,
              variant.quantity
            )
          );
        } else {
          setAvailableStock(
            Math.max(
              0,
              stockItem.quantity
            )
          );
        }
      }
    } else {
      setPaintName(
        customer.productName
      );

      setPaintNo(
        customer.productCode
      );

      setQuantitySold(
        customer.quantitySold?.toString() ||
        ""
      );

      setPaintUnit(
        "liter"
      );

      const latestStock =
        await getPaintStock();

      const stockItem =
        latestStock.find(
          (item) =>
            item.productName ===
            customer.productName
        );

      if (stockItem) {
        setBrand(
          stockItem.brand
        );

        setPurchasePrice(
          stockItem.price?.toString() ||
          ""
        );

        setPrice(
          stockItem.sellingPrice?.toString() ||
          stockItem.price?.toString() ||
          ""
        );

        setAvailableStock(
          stockItem.quantity
        );
      }
    }

    setAccessories(
      customer.accessories ||
      []
    );

    setPaidAmount(
      customer.paidAmount.toString()
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  /* =======================================================
     SEARCH
  ======================================================= */

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

          customer.productName
            .toLowerCase()
            .includes(value)

          ||

          customer.productCode
            .toLowerCase()
            .includes(value)

          ||

          customer.paints?.some(
            (paint) =>
              paint.paintName
                .toLowerCase()
                .includes(value)

              ||

              paint.shadeCode
                .toLowerCase()
                .includes(value)
          )
        );
      }
    );


  /* =======================================================
     UI STARTS IN PART 3
  ======================================================= */

  return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            Paint Sales
          </h1>

          <p className="text-slate-400 mt-1">
            Paint, Enamel, Accessories & Customer Sales
          </p>
        </div>


        {/* ================= CUSTOMER DETAILS ================= */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Customer Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Customer Name
              </label>

              <input
                type="text"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(e.target.value)
                }
                placeholder="Enter customer name"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Contact Number
              </label>

              <input
                type="text"
                value={contact}
                onChange={(e) =>
                  setContact(e.target.value)
                }
                placeholder="Enter contact number"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

          </div>
        </div>


        {/* =====================================================
            PAINT SECTION
        ===================================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">

          <h2 className="text-xl font-semibold mb-4">
            Paint
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* SELECT PAINT */}

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Select Paint
              </label>

              <select
                value={selectedStockId}
                onChange={(e) =>
                  handlePaintSelect(e.target.value)
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none"
              >
                <option value="">
                  Select Paint
                </option>

                {paintStock.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.productName}
                    {item.productCode
                      ? ` - ${item.productCode}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>


            {/* SHADE CODE */}

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Shade Code
              </label>

              <input
                type="text"
                value={paintNo}
                onChange={(e) =>
                  handleShadeCode(e.target.value)
                }
                placeholder="Shade code"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none"
              />
            </div>


            {/* BRAND */}

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Brand
              </label>

              <input
                type="text"
                value={brand}
                readOnly
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300"
              />
            </div>


            {/* SIZE */}

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Size
              </label>

              <select
                value={
                  paintVariantId ||
                  `legacy-${paintUnit}`
                }
                onChange={(e) =>
                  handlePaintUnitSelect(
                    e.target.value
                  )
                }
                disabled={!selectedStockId}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none disabled:opacity-50"
              >
                {selectedStockId &&
                paintStock
                  .find(
                    (item) =>
                      item.id ===
                      selectedStockId
                  )
                  ?.variants?.length ? (
                  paintStock
                    .find(
                      (item) =>
                        item.id ===
                        selectedStockId
                    )
                    ?.variants?.map(
                      (variant) => (
                        <option
                          key={variant.id}
                          value={variant.id}
                        >
                          {variant.size}{" "}
                          {variant.unit}
                        </option>
                      )
                    )
                ) : (
                  <>
                    <option value="legacy-liter">
                      Liter
                    </option>

                    <option value="legacy-ml">
                      ML
                    </option>

                    <option value="legacy-gm">
                      GM
                    </option>
                  </>
                )}
              </select>
            </div>


            {/* PURCHASE PRICE */}

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Purchase Price
              </label>

              <input
                type="number"
                value={purchasePrice}
                readOnly
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300"
              />
            </div>


            {/* SELLING PRICE */}

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Selling Price
              </label>

              <input
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                placeholder="Selling price"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none"
              />
            </div>


            {/* AVAILABLE STOCK */}

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Available Stock
              </label>

              <div className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
                <span className="font-semibold text-green-400">
                  {availableStock}
                </span>{" "}
                <span className="text-slate-400">
                  {paintSize} {paintUnit}
                </span>
              </div>
            </div>


            {/* QUANTITY */}

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={quantitySold}
                onChange={(e) =>
                  setQuantitySold(
                    e.target.value
                  )
                }
                placeholder="Quantity"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none"
              />
            </div>


            {/* ADD PAINT */}

            <div className="flex items-end">
              <button
                type="button"
                onClick={addPaint}
                className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
              >
                + Add Paint
              </button>
            </div>

          </div>


          {/* ================= ADDED PAINTS ================= */}

          {paints.length > 0 && (
            <div className="mt-6 overflow-x-auto">

              <h3 className="font-semibold mb-3">
                Added Paints
              </h3>

              <table className="w-full min-w-[800px] border-collapse">

                <thead>
                  <tr className="bg-slate-800 text-left">

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
                      Purchase
                    </th>

                    <th className="p-3">
                      Selling
                    </th>

                    <th className="p-3">
                      Qty
                    </th>

                    <th className="p-3">
                      Total
                    </th>

                    <th className="p-3">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {paints.map(
                    (paint, index) => (
                      <tr
                        key={`${paint.shadeCode}-${paint.variantId || paint.unit}-${index}`}
                        className="border-b border-slate-800"
                      >
                        <td className="p-3">
                          {paint.paintName}
                        </td>

                        <td className="p-3">
                          {paint.shadeCode}
                        </td>

                        <td className="p-3">
                          {paint.brand}
                        </td>

                        <td className="p-3">
                          {paint.unit}
                        </td>

                        <td className="p-3">
                          ₹{paint.purchasePrice}
                        </td>

                        <td className="p-3">
                          ₹{paint.sellingPrice}
                        </td>

                        <td className="p-3">
                          {paint.quantity}
                        </td>

                        <td className="p-3 font-semibold">
                          ₹
                          {paint.sellingPrice *
                            paint.quantity}
                        </td>

                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() =>
                              removePaint(
                                index
                              )
                            }
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>
          )}
        </div>


        {/* =====================================================
            ENAMEL SECTION
        ===================================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">

          <h2 className="text-xl font-semibold mb-4">
            Enamel
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* SELECT ENAMEL */}

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Select Enamel
              </label>

              <select
                value={selectedEnamelStockId}
                onChange={(e) =>
                  handleEnamelSelect(
                    e.target.value
                  )
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none"
              >
                <option value="">
                  Select Enamel
                </option>

                {enamelStock.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.productName}
                      {item.brand
                        ? ` - ${item.brand}`
                        : ""}
                    </option>
                  )
                )}
              </select>
            </div>


            {/* BRAND */}

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Brand
              </label>

              <input
                type="text"
                value={enamelBrand}
                readOnly
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300"
              />
            </div>


            {/* ENAMEL SIZE */}

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Size
              </label>

              <select
                value={
                  enamelVariantId ||
                  `legacy-${enamelUnit}`
                }
                onChange={(e) =>
                  handleEnamelUnitSelect(
                    e.target.value
                  )
                }
                disabled={
                  !selectedEnamelStockId
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none disabled:opacity-50"
              >
                {selectedEnamelStockId &&
                enamelStock
                  .find(
                    (item) =>
                      item.id ===
                      selectedEnamelStockId
                  )
                  ?.variants?.length ? (
                  enamelStock
                    .find(
                      (item) =>
                        item.id ===
                        selectedEnamelStockId
                    )
                    ?.variants?.map(
                      (variant) => (
                        <option
                          key={variant.id}
                          value={variant.id}
                        >
                          {variant.size}{" "}
                          {variant.unit}
                        </option>
                      )
                    )
                ) : (
                  <>
                    <option value="legacy-liter">
                      Liter
                    </option>

                    <option value="legacy-ml">
                      ML
                    </option>

                    <option value="legacy-gm">
                      GM
                    </option>
                  </>
                )}
              </select>
            </div>


            {/* PURCHASE PRICE */}

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Purchase Price
              </label>

              <input
                type="number"
                value={enamelPurchasePrice}
                readOnly
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300"
              />
            </div>


            {/* SELLING PRICE */}

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Selling Price
              </label>

              <input
                type="number"
                value={enamelSellingPrice}
                onChange={(e) =>
                  setEnamelSellingPrice(
                    e.target.value
                  )
                }
                placeholder="Selling price"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none"
              />
            </div>


            {/* AVAILABLE ENAMEL STOCK */}

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Available Stock
              </label>

              <div className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
                <span className="font-semibold text-green-400">
                  {enamelAvailableStock}
                </span>{" "}
                <span className="text-slate-400">
                  {enamelUnit}
                </span>
              </div>
            </div>


            {/* ENAMEL QUANTITY */}

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={enamelQuantity}
                onChange={(e) =>
                  setEnamelQuantity(
                    e.target.value
                  )
                }
                placeholder="Quantity"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none"
              />
            </div>


            {/* ADD ENAMEL */}

            <div className="flex items-end">
              <button
                type="button"
                onClick={addEnamel}
                className="w-full bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg font-semibold"
              >
                + Add Enamel
              </button>
            </div>

          </div>


          {/* ================= ADDED ENAMELS ================= */}

          {enamels.length > 0 && (
            <div className="mt-6 overflow-x-auto">

              <h3 className="font-semibold mb-3">
                Added Enamels
              </h3>

              <table className="w-full min-w-[750px] border-collapse">

                <thead>
                  <tr className="bg-slate-800 text-left">

                    <th className="p-3">
                      Enamel
                    </th>

                    <th className="p-3">
                      Brand
                    </th>

                    <th className="p-3">
                      Size
                    </th>

                    <th className="p-3">
                      Purchase
                    </th>

                    <th className="p-3">
                      Selling
                    </th>

                    <th className="p-3">
                      Qty
                    </th>

                    <th className="p-3">
                      Total
                    </th>

                    <th className="p-3">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {enamels.map(
                    (enamel, index) => (
                      <tr
                        key={`${enamel.enamelName}-${enamel.variantId || enamel.unit}-${index}`}
                        className="border-b border-slate-800"
                      >
                        <td className="p-3">
                          {enamel.enamelName}
                        </td>

                        <td className="p-3">
                          {enamel.brand}
                        </td>

                        <td className="p-3">
                          {enamel.unit}
                        </td>

                        <td className="p-3">
                          ₹
                          {enamel.purchasePrice}
                        </td>

                        <td className="p-3">
                          ₹
                          {enamel.sellingPrice}
                        </td>

                        <td className="p-3">
                          {enamel.quantity}
                        </td>

                        <td className="p-3 font-semibold">
                          ₹
                          {enamel.sellingPrice *
                            enamel.quantity}
                        </td>

                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() =>
                              removeEnamel(
                                index
                              )
                            }
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                          >
                            Remove
                          </button>
                        </td>

                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>
          )}
        </div>


        {/* =====================================================
            ACCESSORIES
        ===================================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">

          <h2 className="text-xl font-semibold mb-4">
            Accessories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Accessory Name
              </label>

              <input
                type="text"
                value={accessoryName}
                onChange={(e) =>
                  setAccessoryName(
                    e.target.value
                  )
                }
                placeholder="Brush, Roller, Tape..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Price
              </label>

              <input
                type="number"
                value={accessoryPrice}
                onChange={(e) =>
                  setAccessoryPrice(
                    e.target.value
                  )
                }
                placeholder="Price"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={addAccessory}
                className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold"
              >
                + Add Accessory
              </button>
            </div>

          </div>


          {accessories.length > 0 && (
            <div className="mt-5 space-y-2">

              {accessories.map(
                (item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center justify-between bg-slate-800 rounded-lg p-3"
                  >
                    <div>
                      <span className="font-medium">
                        {item.name}
                      </span>

                      <span className="text-slate-400 ml-3">
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
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                )
              )}

            </div>
          )}
        </div>


        {/* =====================================================
            PAYMENT SUMMARY
        ===================================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">

          <h2 className="text-xl font-semibold mb-4">
            Payment
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-sm text-slate-400">
                Paint Total
              </p>

              <p className="text-xl font-bold mt-1">
                ₹{paintsTotal}
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-sm text-slate-400">
                Enamel Total
              </p>

              <p className="text-xl font-bold mt-1">
                ₹{enamelsTotal}
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-sm text-slate-400">
                Accessories
              </p>

              <p className="text-xl font-bold mt-1">
                ₹{accessoriesTotal}
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-sm text-slate-400">
                Total Amount
              </p>

              <p className="text-xl font-bold text-green-400 mt-1">
                ₹{totalAmount}
              </p>
            </div>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Paid Amount
              </label>

              <input
                type="number"
                min="0"
                value={paidAmount}
                onChange={(e) =>
                  setPaidAmount(
                    e.target.value
                  )
                }
                placeholder="Paid amount"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Due Amount
              </label>

              <div className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
                <span
                  className={
                    dueAmount > 0
                      ? "font-bold text-red-400"
                      : "font-bold text-green-400"
                  }
                >
                  ₹{dueAmount}
                </span>
              </div>
            </div>

          </div>
        </div>


        {/* =====================================================
            SAVE / UPDATE
        ===================================================== */}

        <div className="flex flex-col sm:flex-row gap-3 mb-8">

          <button
            type="button"
            onClick={saveCustomer}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
          >
            {editingId
              ? "Update Customer"
              : "Save Customer"}
          </button>

          <button
            type="button"
            onClick={clearForm}
            className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg font-semibold"
          >
            Clear Form
          </button>

        </div>


        {/* =====================================================
            CUSTOMER HISTORY
        ===================================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

            <div>
              <h2 className="text-xl font-semibold">
                Paint Customers
              </h2>

              <p className="text-sm text-slate-400">
                Saved customer sales records
              </p>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search customer, paint or shade..."
              className="w-full md:w-80 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none"
            />

          </div>

          <CustomerTable
            customers={filteredCustomers}
            onDelete={removeCustomer}
            onEdit={editCustomer}
          />

        </div>

      </div>
    </div>
  );
}