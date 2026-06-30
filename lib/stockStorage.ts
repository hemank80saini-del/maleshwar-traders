import { Stock } from "@/types/stock";

const STORAGE_KEY = "maleshwar_stock";

export function getStock(): Stock[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : [];
}

export function saveStock(stock: Stock[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stock));
}

export function addStock(item: Stock) {
  const stock = getStock();

  stock.unshift(item);

  saveStock(stock);
}

export function updateStock(updated: Stock) {
  const stock = getStock().map((item) =>
    item.id === updated.id ? updated : item
  );

  saveStock(stock);
}

export function deleteStock(id: string) {
  const stock = getStock().filter((item) => item.id !== id);

  saveStock(stock);
}
export function getPaintStock(): Stock[] {
  return getStock().filter(
    (item) => item.category === "paint"
  );
}

export function reduceStock(
  productName: string,
  quantitySold: number
) {
  const stock = getStock();

  const updatedStock = stock.map((item) => {
    if (item.productName === productName) {
      return {
        ...item,
        quantity: item.quantity - quantitySold,
      };
    }

    return item;
  });

  saveStock(updatedStock);
}