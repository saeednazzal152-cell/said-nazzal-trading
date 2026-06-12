"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Package, Phone, MapPin, Trash2 } from "lucide-react";

type OrderItem = {
  name_ar: string;
  name_en: string;
  unit: "piece" | "package";
  package_size: number | null;
  price: number;
  qty: number;
};

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
};

const STATUSES = ["new", "confirmed", "delivered"];

export default function AdminOrdersPage() {
  const params = useParams();
  const locale = params.locale === "en" ? "en" : "ar";
  const isAr = locale === "ar";
  const cur = isAr ? "د.أ" : "JD";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setAuthed(true);
    });
  }, []);

  useEffect(() => {
    if (!authed) return;
    load();
  }, [authed]);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(isAr ? "بيانات خاطئة" : "Invalid credentials");
    else setAuthed(true);
    setAuthLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("orders").update({ status }).eq("id", id);
    load();
  }

  async function remove(id: string) {
    if (!confirm(isAr ? "حذف الطلب؟" : "Delete order?")) return;
    await supabase.from("orders").delete().eq("id", id);
    load();
  }

  function statusLabel(s: string) {
    const map: Record<string, [string, string]> = {
      new: ["جديد", "New"],
      confirmed: ["مؤكد", "Confirmed"],
      delivered: ["تم التوصيل", "Delivered"],
    };
    const pair = map[s] ?? [s, s];
    return isAr ? pair[0] : pair[1];
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#F8F6F0" }} dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold mb-6 text-center" style={{ color: "#0D1F3C" }}>
            {isAr ? "تسجيل الدخول" : "Admin Login"}
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={isAr ? "البريد الإلكتروني" : "Email"} className="border rounded-lg px-4 py-2 text-sm focus:outline-none" style={{ borderColor: "#C9A84C66" }} required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isAr ? "كلمة المرور" : "Password"} className="border rounded-lg px-4 py-2 text-sm focus:outline-none" style={{ borderColor: "#C9A84C66" }} required />
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <button type="submit" disabled={authLoading} className="py-2 rounded-lg font-semibold text-white disabled:opacity-60" style={{ backgroundColor: "#0D1F3C" }}>
              {authLoading ? "..." : isAr ? "دخول" : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: "#F8F6F0" }} dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href={`/${locale}/admin`} className="text-sm text-gray-500 hover:underline mb-1 inline-block">
            {isAr ? "← لوحة التحكم" : "← Admin Panel"}
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: "#0D1F3C" }}>
            {isAr ? "الطلبات" : "Orders"}
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">{isAr ? "جاري التحميل..." : "Loading..."}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Package size={48} className="mx-auto mb-3 opacity-30" />
            <p>{isAr ? "لا توجد طلبات بعد" : "No orders yet"}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold" style={{ color: "#0D1F3C" }}>{order.customer_name}</p>
                    <a href={`tel:${order.customer_phone}`} className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <Phone size={13} style={{ color: "#C9A84C" }} /> <span dir="ltr">{order.customer_phone}</span>
                    </a>
                    {order.customer_address && (
                      <p className="flex items-start gap-1 text-sm text-gray-500 mt-1">
                        <MapPin size={13} style={{ color: "#C9A84C" }} className="mt-0.5 shrink-0" /> {order.customer_address}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.created_at).toLocaleString(isAr ? "ar-JO" : "en-GB")}
                    </p>
                  </div>
                  <button onClick={() => remove(order.id)} className="text-red-400 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* items */}
                <div className="border-t border-b py-3 my-2 flex flex-col gap-1" style={{ borderColor: "#eee" }}>
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span style={{ color: "#0D1F3C" }}>
                        {it.qty} × {isAr ? it.name_ar : it.name_en}{" "}
                        <span className="text-gray-400">
                          ({it.unit === "package"
                            ? isAr ? `عبوة${it.package_size ? ` ${it.package_size}` : ""}` : `pkg${it.package_size ? ` ${it.package_size}` : ""}`
                            : isAr ? "قطعة" : "pc"})
                        </span>
                      </span>
                      <span className="font-medium" style={{ color: "#C9A84C" }}>
                        {(it.qty * it.price).toFixed(2)} {cur}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold" style={{ color: "#0D1F3C" }}>
                    {isAr ? "الإجمالي:" : "Total:"} {order.total.toFixed(2)} {cur}
                  </span>
                  <div className="flex gap-1">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(order.id, s)}
                        className="text-xs px-2 py-1 rounded-full font-medium transition-colors"
                        style={
                          order.status === s
                            ? { backgroundColor: "#0D1F3C", color: "#fff" }
                            : { backgroundColor: "#F1F1F1", color: "#666" }
                        }
                      >
                        {statusLabel(s)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
