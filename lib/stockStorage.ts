import { Stock, StockVariant } from "@/types/stock";

const STORAGE_KEY = "maleshwar_stock";

export function getStock(): Stock[] {
  if (typeof window === "undefined") {
    return [];
  }

  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveStock(stock: Stock[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(stock)
  );
}

export function addStock(item: Stock) {
  const stock = getStock();

  stock.unshift(item);

  saveStock(stock);
}

export function updateStock(updated: Stock) {
  const stock = getStock().map((item) =>
    item.id === updated.id
      ? updated
      : item
  );

  saveStock(stock);
}

export function deleteStock(id: string) {
  const stock = getStock().filter(
    (item) => item.id !== id
  );

  saveStock(stock);
}


/* =====================================================
   PAINT STOCK
===================================================== */

export function getPaintStock(): Stock[] {
  return getStock().filter(
    (item) => item.category === "paint"
  );
}


/* =====================================================
   ENAMEL STOCK
===================================================== */

export function getEnamelStock(): Stock[] {
  return getStock().filter(
    (item) => item.category === "enamel"
  );
}


/* =====================================================
   FIND PAINT BY SHADE CODE
===================================================== */

export function findPaintByCode(
  code: string
): Stock | undefined {

  const searchCode =
    code.trim().toLowerCase();

  return getStock().find(
    (item) =>
      item.category === "paint" &&
      item.productCode
        .trim()
        .toLowerCase() === searchCode
  );
}


/* =====================================================
   FIND ENAMEL BY NAME
===================================================== */

export function findEnamelByName(
  name: string
): Stock | undefined {

  const searchName =
    name.trim().toLowerCase();

  return getStock().find(
    (item) =>
      item.category === "enamel" &&
      item.productName
        .trim()
        .toLowerCase() === searchName
  );
}


/* =====================================================
   FIND VARIANT
===================================================== */

export function findStockVariant(
  stock: Stock,
  size: number,
  unit: "liter" | "gm"
): StockVariant | undefined {

  /*
    New size-wise stock
  */

  if (
    stock.variants &&
    stock.variants.length > 0
  ) {

    return stock.variants.find(
      (variant) =>
        variant.size === size &&
        variant.unit === unit
    );
  }


  /*
    Old stock compatibility

    Purane stock ko 1 Ltr maana jayega.
  */

  if (
    stock.quantity >= 0 &&
    stock.price >= 0 &&
    stock.sellingPrice >= 0
  ) {

    if (
      size === 1 &&
      unit === "liter"
    ) {

      return {
        id:
          `${stock.id}-old`,

        size: 1,

        unit: "liter",

        price:
          stock.price,

        sellingPrice:
          stock.sellingPrice,

        quantity:
          stock.quantity,
      };
    }
  }


  return undefined;
}


/* =====================================================
   REDUCE SELECTED STOCK VARIANT
===================================================== */

export function reduceStockVariant(
  stockId: string,
  variantId: string,
  amount: number
) {

  if (
    amount <= 0
  ) {
    return;
  }


  const stock =
    getStock();


  const index =
    stock.findIndex(
      (item) =>
        item.id === stockId
    );


  if (
    index === -1
  ) {
    return;
  }


  const item =
    stock[index];


  /*
    New variant system
  */

  if (
    item.variants &&
    item.variants.length > 0
  ) {

    const variants =
      item.variants.map(
        (variant) => {

          if (
            variant.id ===
            variantId
          ) {

            return {
              ...variant,

              quantity:
                Math.max(
                  0,
                  variant.quantity -
                    amount
                ),
            };
          }

          return variant;
        }
      );


    /*
      Total quantity
      synchronize kar rahe hain.
    */

    const totalQuantity =
      variants.reduce(
        (sum, variant) =>
          sum + variant.quantity,
        0
      );


    stock[index] = {

      ...item,

      variants,

      quantity:
        totalQuantity,
    };


    saveStock(stock);

    return;
  }


  /*
    Old stock system
  */

  stock[index] = {

    ...item,

    quantity:
      Math.max(
        0,
        item.quantity - amount
      ),
  };


  saveStock(stock);
}


/* =====================================================
   OLD REDUCE STOCK FUNCTION
   Timber / old code compatibility
===================================================== */

export function reduceStock(
  productName: string,
  amount: number
) {

  if (
    amount <= 0
  ) {
    return;
  }


  const stock =
    getStock();


  const index =
    stock.findIndex(
      (item) =>
        item.productName
          .toLowerCase()
          .trim() ===
        productName
          .toLowerCase()
          .trim()
    );


  if (
    index === -1
  ) {
    return;
  }


  const item =
    stock[index];


  stock[index] = {

    ...item,

    quantity:
      Math.max(
        0,
        item.quantity - amount
      ),
  };


  saveStock(stock);
}