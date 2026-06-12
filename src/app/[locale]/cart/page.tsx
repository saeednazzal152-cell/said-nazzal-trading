"use client";

import { useCart } from "@/lib/cart";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Trash2, Plus, Minus, ShoppingCart, CheckCircle } from "lucide-react";

export default function CartPage() {
  const params = useParams();
  const locale = params.locale === "en" ? "en" : "ar";
  const isAr = locale === "ar";
  const { items, setQty, removeItem, totalPrice, clear } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const cur = isAr ? "د.أ" : "JD";

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const { error } = await supabase.from("orders").insert({
      customer_name: name,
      customer_phone: phone,
      customer_address: address,
      items: items.map((i) => ({
        name_ar: i.name_ar,
        name_en: i.name_en,
        unit: i.unit,
        package_size: i.packageSize,
        price: i.price,
        qty: i.qty,
      })),
      total: totalPrice,
      status: "new",
    });
    if (error) {
      setError(isAr ? "حدث خطأ، حاول مرة أخرى" : "Something went wrong, please try again");
      setSubmitting(false);
      return;
    }
    clear();
    setDone(true);
    setSubmitting(false);
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center" dir={isAr ? "rtl" : "ltr"}>
        <CheckCircle size={64} className="mx-auto mb-4" style={{ color: "#2E7D32" }} />
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#0D1F3C" }}>
          {isAr ? "تم استلام طلبك!" : "Order received!"}
        </h1>
        <p className="text-gray-500 mb-6">
          {isAr
            ? "سنتواصل معك قريباً لتأكيد الطلب. الدفع عند الاستلام."
            : "We'll contact you shortly to confirm. Payment is cash on delivery."}
        </p>
        <Link
          href={`/${locale}/products`}
          className="inline-block px-6 py-3 rounded-full font-semibold text-white"
          style={{ backgroundColor: "#C9A84C" }}
        >
          {isAr ? "متابعة التسوق" : "Continue shopping"}
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center" dir={isAr ? "rtl" : "ltr"}>
        <ShoppingCart size={64} className="mx-auto mb-4 opacity-30" />
        <p className="text-gray-400 mb-6">{isAr ? "سلة التسوق فارغة" : "Your cart is empty"}</p>
        <Link
          href={`/${locale}/products`}
          className="inline-block px-6 py-3 rounded-full font-semibold text-white"
          style={{ backgroundColor: "#C9A84C" }}
        >
          {isAr ? "تصفح المنتجات" : "Browse products"}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10" dir={isAr ? "rtl" : "ltr"}>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "#0D1F3C" }}>
        {isAr ? "سلة التسوق" : "Shopping Cart"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Items */}
        <div className="md:col-span-2 flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-3 bg-white rounded-xl border p-3"
              style={{ borderColor: "#C9A84C33" }}
            >
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: "#0D1F3C" }}>
                  {isAr ? item.name_ar : item.name_en}
                </p>
                <p className="text-xs text-gray-500">
                  {item.unit === "package"
                    ? isAr
                      ? `عبوة${item.packageSize ? ` (${item.packageSize} قطعة)` : ""}`
                      : `Package${item.packageSize ? ` (${item.packageSize} pcs)` : ""}`
                    : isAr ? "قطعة" : "Piece"}
                  {" · "}
                  {item.price} {cur}
                </p>
              </div>
              {/* qty */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty(item.key, item.qty - 1)}
                  className="w-7 h-7 rounded-full border flex items-center justify-center"
                  style={{ borderColor: "#C9A84C66" }}
                >
                  <Minus size={13} />
                </button>
                <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                <button
                  onClick={() => setQty(item.key, item.qty + 1)}
                  className="w-7 h-7 rounded-full border flex items-center justify-center"
                  style={{ borderColor: "#C9A84C66" }}
                >
                  <Plus size={13} />
                </button>
              </div>
              <span className="font-bold text-sm w-16 text-end" style={{ color: "#C9A84C" }}>
                {(item.qty * item.price).toFixed(2)} {cur}
              </span>
              <button onClick={() => removeItem(item.key)} className="text-red-400 p-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Checkout */}
        <div className="bg-white rounded-xl border p-5 h-fit" style={{ borderColor: "#C9A84C33" }}>
          <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{ borderColor: "#eee" }}>
            <span className="font-semibold" style={{ color: "#0D1F3C" }}>
              {isAr ? "الإجمالي" : "Total"}
            </span>
            <span className="font-bold text-lg" style={{ color: "#C9A84C" }}>
              {totalPrice.toFixed(2)} {cur}
            </span>
          </div>
          <form onSubmit={placeOrder} className="flex flex-col gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isAr ? "الاسم الكامل" : "Full name"}
              required
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: "#C9A84C66" }}
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={isAr ? "رقم الهاتف" : "Phone number"}
              required
              type="tel"
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: "#C9A84C66" }}
              dir="ltr"
            />
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={isAr ? "العنوان بالتفصيل" : "Delivery address"}
              required
              rows={3}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
              style={{ borderColor: "#C9A84C66" }}
            />
            <p className="text-xs text-gray-500">
              {isAr ? "الدفع عند الاستلام" : "Payment: Cash on delivery"}
            </p>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="py-3 rounded-lg font-bold text-white disabled:opacity-60"
              style={{ backgroundColor: "#0D1F3C" }}
            >
              {submitting ? "..." : isAr ? "تأكيد الطلب" : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
