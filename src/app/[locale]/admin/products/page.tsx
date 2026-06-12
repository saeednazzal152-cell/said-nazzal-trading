"use client";

import { useEffect, useState } from "react";
import { supabase, type Product, type Section } from "@/lib/supabase";
import { Plus, Pencil, Trash2, X, Check, Package } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const EMPTY_PRODUCT = {
  name_ar: "",
  name_en: "",
  description_ar: "",
  description_en: "",
  price: 0,
  stock: 0,
  image_url: "",
  is_active: true,
  section_id: "",
};

export default function AdminProductsPage() {
  const params = useParams();
  const locale = params.locale === "en" ? "en" : "ar";
  const isAr = locale === "ar";

  const [products, setProducts] = useState<Product[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("products").upload(fileName, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("products").getPublicUrl(fileName);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
    }
    setUploading(false);
  }

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
    const [{ data: p }, { data: s }] = await Promise.all([
      supabase.from("products").select("*, sections(*)").order("created_at", { ascending: false }),
      supabase.from("sections").select("*").order("order"),
    ]);
    setProducts(p ?? []);
    setSections(s ?? []);
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(isAr ? "بيانات خاطئة" : "Invalid credentials");
    } else {
      setAuthed(true);
    }
    setAuthLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      image_url: form.image_url || null,
    };
    if (editing) {
      await supabase.from("products").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("products").insert(payload);
    }
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_PRODUCT);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm(isAr ? "هل أنت متأكد؟" : "Are you sure?")) return;
    await supabase.from("products").delete().eq("id", id);
    load();
  }

  function openEdit(product: Product) {
    setEditing(product);
    setForm({
      name_ar: product.name_ar,
      name_en: product.name_en,
      description_ar: product.description_ar ?? "",
      description_en: product.description_en ?? "",
      price: product.price,
      stock: product.stock,
      image_url: product.image_url ?? "",
      is_active: product.is_active,
      section_id: product.section_id,
    });
    setShowForm(true);
  }

  if (!authed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#F8F6F0" }}
        dir={isAr ? "rtl" : "ltr"}
      >
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold mb-6 text-center" style={{ color: "#0D1F3C" }}>
            {isAr ? "تسجيل الدخول" : "Admin Login"}
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isAr ? "البريد الإلكتروني" : "Email"}
              className="border rounded-lg px-4 py-2 text-sm focus:outline-none"
              style={{ borderColor: "#C9A84C66" }}
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isAr ? "كلمة المرور" : "Password"}
              className="border rounded-lg px-4 py-2 text-sm focus:outline-none"
              style={{ borderColor: "#C9A84C66" }}
              required
            />
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="py-2 rounded-lg font-semibold text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "#0D1F3C" }}
            >
              {authLoading ? "..." : isAr ? "دخول" : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ backgroundColor: "#F8F6F0" }}
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              href={`/${locale}/admin`}
              className="text-sm text-gray-500 hover:underline mb-1 inline-block"
            >
              {isAr ? "← لوحة التحكم" : "← Admin Panel"}
            </Link>
            <h1 className="text-2xl font-bold" style={{ color: "#0D1F3C" }}>
              {isAr ? "إدارة المنتجات" : "Manage Products"}
            </h1>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY_PRODUCT); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white text-sm"
            style={{ backgroundColor: "#C9A84C" }}
          >
            <Plus size={16} />
            {isAr ? "إضافة منتج" : "Add Product"}
          </button>
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#eee" }}>
                <h2 className="font-bold text-lg" style={{ color: "#0D1F3C" }}>
                  {editing ? (isAr ? "تعديل المنتج" : "Edit Product") : (isAr ? "إضافة منتج" : "Add Product")}
                </h2>
                <button onClick={() => setShowForm(false)}>
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">{isAr ? "الاسم (عربي)" : "Name (Arabic)"}</label>
                    <input
                      value={form.name_ar}
                      onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                      style={{ borderColor: "#C9A84C66" }}
                      required
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">{isAr ? "الاسم (إنجليزي)" : "Name (English)"}</label>
                    <input
                      value={form.name_en}
                      onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                      style={{ borderColor: "#C9A84C66" }}
                      required
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">{isAr ? "الوصف (عربي)" : "Desc (Arabic)"}</label>
                    <textarea
                      value={form.description_ar}
                      onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                      style={{ borderColor: "#C9A84C66" }}
                      rows={2}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">{isAr ? "الوصف (إنجليزي)" : "Desc (English)"}</label>
                    <textarea
                      value={form.description_en}
                      onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                      style={{ borderColor: "#C9A84C66" }}
                      rows={2}
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">{isAr ? "السعر (د.أ)" : "Price (JD)"}</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                      style={{ borderColor: "#C9A84C66" }}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">{isAr ? "المخزون" : "Stock"}</label>
                    <input
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                      style={{ borderColor: "#C9A84C66" }}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">{isAr ? "القسم" : "Section"}</label>
                    <select
                      value={form.section_id}
                      onChange={(e) => setForm({ ...form, section_id: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                      style={{ borderColor: "#C9A84C66" }}
                      required
                    >
                      <option value="">{isAr ? "اختر..." : "Choose..."}</option>
                      {sections.map((s) => (
                        <option key={s.id} value={s.id}>
                          {isAr ? s.name_ar : s.name_en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{isAr ? "الصورة" : "Image"}</label>
                  <div className="flex flex-col gap-2">
                    <label
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed cursor-pointer text-sm font-medium transition-colors"
                      style={{ borderColor: "#C9A84C66", color: "#C9A84C" }}
                    >
                      {uploading
                        ? (isAr ? "جاري الرفع..." : "Uploading...")
                        : (isAr ? "📁 اختر صورة" : "📁 Choose Image")}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                    {form.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.image_url} alt="preview" className="h-20 w-20 object-cover rounded-lg border" />
                    )}
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  />
                  {isAr ? "نشط (يظهر للزوار)" : "Active (visible to visitors)"}
                </label>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2 rounded-lg font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#0D1F3C" }}
                  >
                    <Check size={16} />
                    {saving ? "..." : isAr ? "حفظ" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2 rounded-lg font-semibold border text-gray-600"
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products table */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            {isAr ? "جاري التحميل..." : "Loading..."}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Package size={48} className="mx-auto mb-3 opacity-30" />
            <p>{isAr ? "لا توجد منتجات بعد" : "No products yet"}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: "#0D1F3C", color: "#C9A84C" }}>
                <tr>
                  <th className="px-4 py-3 text-start">{isAr ? "الاسم" : "Name"}</th>
                  <th className="px-4 py-3 text-start">{isAr ? "القسم" : "Section"}</th>
                  <th className="px-4 py-3 text-start">{isAr ? "السعر" : "Price"}</th>
                  <th className="px-4 py-3 text-start">{isAr ? "المخزون" : "Stock"}</th>
                  <th className="px-4 py-3 text-start">{isAr ? "الحالة" : "Status"}</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <tr
                    key={product.id}
                    className="border-b"
                    style={{ borderColor: "#eee", backgroundColor: i % 2 === 0 ? "#fff" : "#FAFAFA" }}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: "#0D1F3C" }}>
                      {isAr ? product.name_ar : product.name_en}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {product.sections
                        ? isAr ? product.sections.name_ar : product.sections.name_en
                        : "-"}
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "#C9A84C" }}>
                      {product.price} {isAr ? "د.أ" : "JD"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={
                          product.stock > 0
                            ? { backgroundColor: "#E8F5E9", color: "#2E7D32" }
                            : { backgroundColor: "#FFEBEE", color: "#C62828" }
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={
                          product.is_active
                            ? { backgroundColor: "#E3F2FD", color: "#1565C0" }
                            : { backgroundColor: "#F5F5F5", color: "#757575" }
                        }
                      >
                        {product.is_active ? (isAr ? "نشط" : "Active") : (isAr ? "مخفي" : "Hidden")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                        >
                          <Pencil size={14} style={{ color: "#C9A84C" }} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
