"use client";















import { useEffect, useState } from "react";







import { v4 as uuid } from "uuid";















import {







  Stock,







  StockUnit,







  StockVariant,







} from "@/types/stock";















import {







  addStock,







  getStock,







  updateStock,







  deleteStock,







} from "@/lib/stockSupabase";















import PaintStockTable from "./PaintStockTable";















export default function PaintStockForm() {







  const [productName, setProductName] = useState("");







  const [productCode, setProductCode] = useState("");







  const [brand, setBrand] = useState("");















  const [size, setSize] = useState("");







  const [unit, setUnit] = useState<StockUnit>("liter");







  const [price, setPrice] = useState("");







  const [sellingPrice, setSellingPrice] = useState("");







  const [quantity, setQuantity] = useState("");















  const [variants, setVariants] = useState<StockVariant[]>([]);















  const [editingId, setEditingId] = useState<string | null>(null);







  const [editingVariantId, setEditingVariantId] =







    useState<string | null>(null);















  const [additionalQuantity, setAdditionalQuantity] = useState("");















  const [stock, setStock] = useState<Stock[]>([]);















  useEffect(() => {







    loadStock();







  }, []);















  async function loadStock() {







    const allStock = await getStock();







    const data = allStock.filter(







      (item) => item.category === "paint"







    );















    setStock(data);







  }















  function clearForm() {







    setProductName("");







    setProductCode("");







    setBrand("");















    setSize("");







    setUnit("liter");







    setPrice("");







    setSellingPrice("");







    setQuantity("");















    setVariants([]);















    setEditingId(null);







    setEditingVariantId(null);







    setAdditionalQuantity("");







  }















  async function addVariant() {







    const sizeValue = Number(size);







    const priceValue = Number(price);







    const sellingValue = Number(sellingPrice);







    const quantityValue = Number(quantity);















    if (!size || sizeValue <= 0) {







      alert("Please enter a valid size.");







      return;







    }















    if (price === "" || priceValue < 0) {







      alert("Please enter actual price.");







      return;







    }















    if (sellingPrice === "" || sellingValue < 0) {







      alert("Please enter selling price.");







      return;







    }















    /* ==========================================







       UPDATE INDIVIDUAL SIZE







    ========================================== */















    if (editingVariantId) {







      const extraStock =







        additionalQuantity === ""







          ? 0







          : Number(additionalQuantity);















      if (







        Number.isNaN(extraStock) ||







        extraStock < 0







      ) {







        alert("Please enter a valid stock to add.");







        return;







      }















      const duplicateSize = variants.some(







        (variant) =>







          variant.id !== editingVariantId &&







          variant.size === sizeValue &&







          variant.unit === unit







      );















      if (duplicateSize) {







        alert("This size already exists for this paint.");







        return;







      }















      const updatedVariants = variants.map(







        (variant) =>







          variant.id === editingVariantId







            ? {







                ...variant,







                size: sizeValue,







                unit,







                price: priceValue,







                sellingPrice: sellingValue,















                // Existing stock + new stock







                quantity:







                  variant.quantity + extraStock,







              }







            : variant







      );















      setVariants(updatedVariants);















      if (editingId) {







        const allStock = await getStock();







        const currentItem = allStock.find(







          (item) => item.id === editingId







        );















        if (currentItem) {







          const totalQuantity =







            updatedVariants.reduce(







              (sum, item) =>







                sum + item.quantity,







              0







            );















          await updateStock({







            ...currentItem,















            productName:







              productName.trim(),















            productCode:







              productCode.trim(),















            brand:







              brand.trim(),















            price:







              updatedVariants[0]?.price ?? 0,















            sellingPrice:







              updatedVariants[0]?.sellingPrice ?? 0,















            quantity:







              totalQuantity,















            variants:







              updatedVariants,







          });







        }







      }















      alert(







        "Paint size updated successfully!"







      );















      setEditingVariantId(null);







      setAdditionalQuantity("");















      setSize("");







      setPrice("");







      setSellingPrice("");







      setQuantity("");















      loadStock();















      return;







    }















    /* ==========================================







       ADD NEW SIZE







    ========================================== */















    if (







      quantity === "" ||







      quantityValue < 0







    ) {







      alert("Please enter stock quantity.");







      return;







    }















    const alreadyExists =







      variants.some(







        (item) =>







          item.size === sizeValue &&







          item.unit === unit







      );















    if (alreadyExists) {







      alert(







        "This size already exists for this paint."







      );















      return;







    }















    const newVariant: StockVariant = {







      id: uuid(),















      size: sizeValue,















      unit,















      price: priceValue,















      sellingPrice: sellingValue,















      quantity: quantityValue,







    };















    setVariants([







      ...variants,







      newVariant,







    ]);















    setSize("");







    setPrice("");







    setSellingPrice("");







    setQuantity("");







  }















  /* ==========================================







     EDIT INDIVIDUAL SIZE







  ========================================== */















  function editVariant(







    item: Stock,







    variant: StockVariant







  ) {







    setEditingId(item.id);















    setEditingVariantId(







      variant.id







    );















    setProductName(







      item.productName







    );















    setProductCode(







      item.productCode







    );















    setBrand(







      item.brand







    );















    setVariants(







      item.variants ?? []







    );















    setSize(







      String(variant.size)







    );















    setUnit(







      variant.unit







    );















    setPrice(







      String(variant.price)







    );















    setSellingPrice(







      String(variant.sellingPrice)







    );















    /*







      Existing stock is shown







      separately and cannot be







      accidentally overwritten.







    */















    setQuantity(







      String(variant.quantity)







    );















    /*







      New stock to add.







    */















    setAdditionalQuantity("");















    window.scrollTo({







      top: 0,







      behavior: "smooth",







    });







  }















  /* ==========================================







     REMOVE SIZE







  ========================================== */















  function removeVariant(







    id: string







  ) {







    setVariants(







      variants.filter(







        (item) =>







          item.id !== id







      )







    );







  }















  /* ==========================================







     SAVE / UPDATE COMPLETE PAINT







  ========================================== */















  async function saveItem() {







    if (







      productName.trim() === ""







    ) {







      alert(







        "Please enter Paint Name."







      );















      return;







    }















    if (







      productCode.trim() === ""







    ) {







      alert(







        "Please enter Shade Code."







      );















      return;







    }















    if (







      brand.trim() === ""







    ) {







      alert(







        "Please enter Brand."







      );















      return;







    }















    if (







      variants.length === 0







    ) {







      alert(







        "Please add at least one size."







      );















      return;







    }















    const totalQuantity =







      variants.reduce(







        (sum, item) =>







          sum + item.quantity,







        0







      );















    const firstVariant =







      variants[0];















    const item: Stock = {







      id:







        editingId ??







        uuid(),















      category:







        "paint",















      productName:







        productName.trim(),















      productCode:







        productCode.trim(),















      brand:







        brand.trim(),















      price:







        firstVariant.price,















      sellingPrice:







        firstVariant.sellingPrice,















      quantity:







        totalQuantity,















      variants,















      createdAt:







        new Date().toISOString(),







    };















    if (editingId) {







      await updateStock(item);















      alert(







        "Paint Updated Successfully!"







      );







    } else {







      await addStock(item);















      alert(







        "Paint Added Successfully!"







      );







    }















    loadStock();















    clearForm();







  }















  /* ==========================================







     EDIT COMPLETE PAINT







  ========================================== */















  function editItem(







    item: Stock







  ) {







    setEditingId(







      item.id







    );















    setEditingVariantId(







      null







    );















    setAdditionalQuantity("");















    setProductName(







      item.productName







    );















    setProductCode(







      item.productCode







    );















    setBrand(







      item.brand







    );















    if (







      item.variants &&







      item.variants.length > 0







    ) {







      setVariants(







        item.variants







      );







    } else {







      /*







        Old stock compatibility







      */















      setVariants([







        {







          id:







            `${item.id}-old`,















          size:







            1,















          unit:







            "liter",















          price:







            item.price,















          sellingPrice:







            item.sellingPrice,















          quantity:







            item.quantity,







        },







      ]);







    }















    window.scrollTo({







      top: 0,







      behavior: "smooth",







    });







  }















  /* ==========================================







     DELETE PAINT







  ========================================== */















  async function removeItem(







    id: string







  ) {







    if (







      !confirm(







        "Delete this paint?"







      )







    ) {







      return;







    }















    await deleteStock(id);















    loadStock();







  }















  return (







    <div className="bg-[#1e293b] rounded-2xl shadow-2xl border border-green-700 p-8">















      <h2 className="text-4xl font-bold text-green-400 mb-8">







        Paint Stock Management







      </h2>















      {/* BASIC DETAILS */}















      <div className="grid md:grid-cols-3 gap-5">















        <input







          type="text"







          placeholder="Paint Name"







          value={productName}







          onChange={(e) =>







            setProductName(







              e.target.value







            )







          }







          className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"







        />















        <input







          type="text"







          placeholder="Shade Code"







          value={productCode}







          onChange={(e) =>







            setProductCode(







              e.target.value







            )







          }







          className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"







        />















        <input







          type="text"







          placeholder="Brand"







          value={brand}







          onChange={(e) =>







            setBrand(







              e.target.value







            )







          }







          className="p-4 rounded-xl bg-slate-800 border border-green-600 text-white"







        />















      </div>















      {/* SIZE SECTION */}















      <div className="mt-6 bg-slate-900 rounded-xl border border-cyan-500 p-5">















        <h3 className="text-xl font-bold text-cyan-400 mb-5">







          Paint Size / Price / Stock







        </h3>















        <div className="grid md:grid-cols-5 gap-4">















          <input







            type="number"







            min="0"







            step="any"







            placeholder="Size e.g. 1 / 5 / 500"







            value={size}







            onChange={(e) =>







              setSize(







                e.target.value







              )







            }







            className="p-4 rounded-xl bg-slate-800 border border-cyan-500 text-white"







          />















          <select







            value={unit}







            onChange={(e) =>







              setUnit(







                e.target.value as StockUnit







              )







            }







            className="p-4 rounded-xl bg-slate-800 border border-cyan-500 text-white"







          >







            <option value="liter">







              Ltr







            </option>















            <option value="gm">







              Gram







            </option>







          </select>















          <input







            type="number"







            min="0"







            step="any"







            placeholder="Actual Price"







            value={price}







            onChange={(e) =>







              setPrice(







                e.target.value







              )







            }







            className="p-4 rounded-xl bg-slate-800 border border-orange-500 text-white"







          />















          <input







            type="number"







            min="0"







            step="any"







            placeholder="Selling Price"







            value={sellingPrice}







            onChange={(e) =>







              setSellingPrice(







                e.target.value







              )







            }







            className="p-4 rounded-xl bg-slate-800 border border-green-500 text-white"







          />















          <input







            type="number"







            min="0"







            step="any"







            placeholder={







              editingVariantId







                ? "Current Stock"







                : "Stock Quantity"







            }







            value={quantity}







            onChange={(e) =>







              setQuantity(







                e.target.value







              )







            }







            readOnly={







              !!editingVariantId







            }







            className="p-4 rounded-xl bg-slate-800 border border-purple-500 text-white"







          />















          {editingVariantId && (







            <input







              type="number"







              min="0"







              step="any"







              placeholder="Add Stock"







              value={







                additionalQuantity







              }







              onChange={(e) =>







                setAdditionalQuantity(







                  e.target.value







                )







              }







              className="p-4 rounded-xl bg-slate-800 border border-yellow-500 text-white"







            />







          )}















        </div>















        {/* ADD / UPDATE SIZE */}















        <button







          type="button"







          onClick={addVariant}







          className="mt-5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 py-3 rounded-xl"







        >







          {editingVariantId







            ? "Update This Size"







            : "+ Add Size"}







        </button>















        {/* ADDED SIZES */}















        {variants.length > 0 && (







          <div className="mt-6 space-y-3">















            <h4 className="text-lg font-bold text-yellow-400">







              Added Sizes







            </h4>















            {variants.map(







              (variant) => (







                <div







                  key={







                    variant.id







                  }







                  className="flex flex-wrap items-center justify-between gap-4 bg-slate-800 border border-slate-700 rounded-xl p-4"







                >















                  <span className="text-cyan-400 font-bold">







                    {variant.size}{" "}







                    {variant.unit ===







                    "liter"







                      ? "Ltr"







                      : "Gram"}







                  </span>















                  <span className="text-orange-400">







                    Actual ₹







                    {variant.price}







                  </span>















                  <span className="text-green-400">







                    Selling ₹







                    {variant.sellingPrice}







                  </span>















                  <span className="text-purple-400">







                    Stock{" "}







                    {variant.quantity}







                  </span>















                  <button







                    type="button"







                    onClick={() =>







                      editVariant(







                        {







                          id:







                            editingId ??







                            "",







                          category:







                            "paint",







                          productName,







                          productCode,







                          brand,







                          price:







                            variant.price,







                          sellingPrice:







                            variant.sellingPrice,







                          quantity:







                            variant.quantity,







                          variants,







                          createdAt:







                            new Date().toISOString(),







                        },







                        variant







                      )







                    }







                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"







                  >







                    Edit







                  </button>















                  <button







                    type="button"







                    onClick={() =>







                      removeVariant(







                        variant.id







                      )







                    }







                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"







                  >







                    Remove







                  </button>















                </div>







              )







            )}















          </div>







        )}















      </div>















      {/* MAIN BUTTONS */}















      <div className="flex gap-4 mt-6">















        <button







          type="button"







          onClick={saveItem}







          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl"







        >







          {editingId







            ? "Update Paint"







            : "Add Paint"}







        </button>















        <button







          type="button"







          onClick={clearForm}







          className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl"







        >







          Clear







        </button>















      </div>















      <PaintStockTable







        stock={stock}







        onEdit={editItem}







        onEditVariant={editVariant}







        onDelete={removeItem}







      />















    </div>







  );







}