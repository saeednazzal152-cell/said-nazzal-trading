"use client";

import { type Product } from "@/lib/supabase";
import { useCart } from "@/lib/cart";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

export default function AddToCart({
  product,
  locale,
}: {
  product: Product;
  locale: "ar" | "en";
}) {
  const isAr = locale === "ar";
  const { addItem } = useCart();
  const [added, setAdded] = useState<string | null>(null);

  if (product.stock <= 0) return null;

  function add(unit: "piece" | "package", price: number) {
    addItem({
      productId: product.id,
      name_ar: product.name_ar,
      name_en: product.name_en,
      unit,
      packageSize: unit === "package" ? product.package_size : null,
      price,
      image_url: product.image_url,
    });
    setAdded(unit);
    setTimeout(() => setAdded(null), 1200);
  }

  return (
    <div className="flex flex-col gap-2 mt-3">
      <button
        onClick={() => add("piece", product.price)}
        className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#0D1F3C" }}
      >
        {added === "piece" ? <Check size={15} /> : <ShoppingCart size={15} />}
        {isAr ? "أضف قطعة" : "Add piece"}
      </button>
      {product.package_price ? (
        <button
          onClick={() => add("package", product.package_price!)}
          className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#C9A84C", color: "#fff" }}
        >
          {added === "package" ? <Check size={15} /> : <ShoppingCart size={15} />}
          {isAr ? "أضف عبوة" : "Add package"}
        </button>
      ) : null}
    </div>
  );
}
