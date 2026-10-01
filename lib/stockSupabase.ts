import { Stock, StockVariant } from "@/types/stock";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type StockRow = {
  id: string;
  category: Stock["category"];
  product_name: string;
  product_code: string;
  brand: string;
  price: number;
  selling_price: number;
  quantity: number;
  variants: Stock["variants"] | null;
  created_at: string;
  user_id: string;
};

function rowToStock(row: StockRow): Stock {
  return {
    id: row.id,
    category: row.category,
    productName: row.product_name,
    productCode: row.product_code,
    brand: row.brand,
    price: row.price,
    sellingPrice: row.selling_price,
    quantity: row.quantity,
    variants: row.variants ?? [],
    createdAt: row.created_at,
  };
}

function stockToRow(stock: Stock, userId: string) {
  return {
    id: stock.id,
    category: stock.category,
    product_name: stock.productName,
    product_code: stock.productCode,
    brand: stock.brand,
    price: stock.price,
    selling_price: stock.sellingPrice,
    quantity: stock.quantity,
    variants: stock.variants ?? [],
    created_at: stock.createdAt,
    user_id: userId,
  };
}

async function getUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error("User is not logged in");
  }

  return user.id;
}

/* =====================================================
   GET ALL STOCK
===================================================== */

export async function getStock(): Promise<Stock[]> {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("stock")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching stock:", error);
    throw error;
  }

  return (data as StockRow[]).map(rowToStock);
}

/* =====================================================
   SAVE ALL STOCK
===================================================== */

export async function saveStock(stock: Stock[]) {
  if (stock.length === 0) {
    return;
  }

  const userId = await getUserId();

  const rows = stock.map((item) =>
    stockToRow(item, userId)
  );

  const { error } = await supabase
    .from("stock")
    .upsert(rows, {
      onConflict: "id",
    });

  if (error) {
    console.error("Error saving stock:", error);
    throw error;
  }
}

/* =====================================================
   ADD STOCK
===================================================== */

export async function addStock(item: Stock) {
  const userId = await getUserId();

  const row = stockToRow(item, userId);

  const { error } = await supabase
    .from("stock")
    .insert(row);

  if (error) {
    console.error("Error adding stock:", error);
    throw error;
  }
}

/* =====================================================
   UPDATE STOCK
===================================================== */

export async function updateStock(updated: Stock) {
  const userId = await getUserId();

  const row = stockToRow(updated, userId);

  const { error } = await supabase
    .from("stock")
    .update(row)
    .eq("id", updated.id)
    .eq("user_id", userId);

  if (error) {
    console.error("Error updating stock:", error);
    throw error;
  }
}

/* =====================================================
   DELETE STOCK
===================================================== */

export async function deleteStock(id: string) {
  const userId = await getUserId();

  const { error } = await supabase
    .from("stock")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting stock:", error);
    throw error;
  }
}

/* =====================================================
   PAINT STOCK
===================================================== */

export async function getPaintStock(): Promise<Stock[]> {
  const stock = await getStock();

  return stock.filter(
    (item) => item.category === "paint"
  );
}

/* =====================================================
   ENAMEL STOCK
===================================================== */

export async function getEnamelStock(): Promise<Stock[]> {
  const stock = await getStock();

  return stock.filter(
    (item) => item.category === "enamel"
  );
}

/* =====================================================
   FIND PAINT BY CODE
===================================================== */

export async function findPaintByCode(
  code: string
): Promise<Stock | undefined> {
  const stock = await getPaintStock();

  const searchCode = code.trim().toLowerCase();

  return stock.find(
    (item) =>
      item.productCode.trim().toLowerCase() ===
      searchCode
  );
}

/* =====================================================
   FIND ENAMEL BY NAME
===================================================== */

export async function findEnamelByName(
  name: string
): Promise<Stock | undefined> {
  const stock = await getEnamelStock();

  const searchName = name.trim().toLowerCase();

  return stock.find(
    (item) =>
      item.productName.trim().toLowerCase() ===
      searchName
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
        id: `${stock.id}-old`,
        size: 1,
        unit: "liter",
        price: stock.price,
        sellingPrice: stock.sellingPrice,
        quantity: stock.quantity,
      };
    }
  }

  return undefined;
}

/* =====================================================
   REDUCE STOCK VARIANT
===================================================== */

export async function reduceStockVariant(
  stockId: string,
  variantId: string,
  amount: number
) {
  if (amount <= 0) {
    return;
  }

  const stock = await getStock();

  const item = stock.find(
    (item) => item.id === stockId
  );

  if (!item) {
    return;
  }

  if (
    item.variants &&
    item.variants.length > 0
  ) {
    const variants = item.variants.map(
      (variant) =>
        variant.id === variantId
          ? {
              ...variant,
              quantity: Math.max(
                0,
                variant.quantity - amount
              ),
            }
          : variant
    );

    const totalQuantity =
      variants.reduce(
        (sum, variant) =>
          sum + variant.quantity,
        0
      );

    await updateStock({
      ...item,
      variants,
      quantity: totalQuantity,
    });

    return;
  }

  await updateStock({
    ...item,
    quantity: Math.max(
      0,
      item.quantity - amount
    ),
  });
}

/* =====================================================
   OLD REDUCE STOCK
===================================================== */

export async function reduceStock(
  productName: string,
  amount: number
) {
  if (amount <= 0) {
    return;
  }

  const stock = await getStock();

  const item = stock.find(
    (item) =>
      item.productName
        .toLowerCase()
        .trim() ===
      productName
        .toLowerCase()
        .trim()
  );

  if (!item) {
    return;
  }

  await updateStock({
    ...item,
    quantity: Math.max(
      0,
      item.quantity - amount
    ),
  });
}