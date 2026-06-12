"use client";

import { useEffect, useState } from "react";
import { supabase, type Section } from "@/lib/supabase";
import { Plus, Pencil, Trash2, X, Check, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const EMPTY = { name_ar: "", name_en: "", slug: "", image_url: "", order: 0 };

export default function AdminSectionsPage() {
  const params = useParams();
  const locale = params.locale === "en" ? "en" : "ar";
  const isAr = locale === "ar";

  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Section | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `sections/${Date.now()}.${ext}`;
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
    const { data } = await supabase.from("sections").select("*").order("order");
    setSections(data ?? []);
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, order: Number(form.order), image_url: form.image_url || null };
    if (editing) {
      await supabase.from("sections").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("sections").insert(payload);
    }
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm(isAr ? "هل أنت متأكد؟" : "Are you sure?")) return;
    await supabase.from("sections").delete().eq("id", id);
    load();
  }

  function openEdit(section: Section) {
    setEditing(section);
    setForm({
      name_ar: section.name_ar,
      name_en: section.name_en,
      slug: section.slug,
      image_url: section.image_url ?? "",
      order: section.order,
    });
    setShowForm(true);
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
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href={`/${locale}/admin`} className="text-sm text-gray-500 hover:underline mb-1 inline-block">
              {isAr ? "← لوحة التحكم" : "← Admin Panel"}
            </Link>
            <h1 className="text-2xl font-bold" style={{ color: "#0D1F3C" }}>
              {isAr ? "إدارة الأقسام" : "Manage Sections"}
            </h1>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white text-sm"
            style={{ backgroundColor: "#C9A84C" }}
          >
            <Plus size={16} />
            {isAr ? "إضافة قسم" : "Add Section"}
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#eee" }}>
                <h2 className="font-bold text-lg" style={{ color: "#0D1F3C" }}>
                  {editing ? (isAr ? "تعديل القسم" : "Edit Section") : (isAr ? "إضافة قسم" : "Add Section")}
                </h2>
                <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400" /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">{isAr ? "الاسم (عربي)" : "Name (Arabic)"}</label>
                    <input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: "#C9A84C66" }} required dir="rtl" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">{isAr ? "الاسم (إنجليزي)" : "Name (English)"}</label>
                    <input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: "#C9A84C66" }} required dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{isAr ? "المعرف (slug) — أحرف إنجليزية وشرطات فقط" : "Slug (English letters and dashes only)"}</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: "#C9A84C66" }} required dir="ltr" placeholder="e.g. restaurants" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">{isAr ? "الصورة" : "Image"}</label>
                    <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed cursor-pointer text-sm font-medium" style={{ borderColor: "#C9A84C66", color: "#C9A84C" }}>
                      {uploading ? (isAr ? "جاري الرفع..." : "Uploading...") : (isAr ? "📁 اختر صورة" : "📁 Choose Image")}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                    {form.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.image_url} alt="preview" className="h-16 w-16 object-cover rounded-lg border mt-2" />
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">{isAr ? "الترتيب" : "Order"}</label>
                    <input type="number" min="0" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: "#C9A84C66" }} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="flex-1 py-2 rounded-lg font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2" style={{ backgroundColor: "#0D1F3C" }}>
                    <Check size={16} />
                    {saving ? "..." : isAr ? "حفظ" : "Save"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg font-semibold border text-gray-600">
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400">{isAr ? "جاري التحميل..." : "Loading..."}</div>
        ) : sections.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <LayoutGrid size={48} className="mx-auto mb-3 opacity-30" />
            <p>{isAr ? "لا توجد أقسام بعد" : "No sections yet"}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: "#0D1F3C", color: "#C9A84C" }}>
                <tr>
                  <th className="px-4 py-3 text-start">{isAr ? "الاسم (عربي)" : "Name (AR)"}</th>
                  <th className="px-4 py-3 text-start">{isAr ? "الاسم (إنجليزي)" : "Name (EN)"}</th>
                  <th className="px-4 py-3 text-start">Slug</th>
                  <th className="px-4 py-3 text-start">{isAr ? "الترتيب" : "Order"}</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section, i) => (
                  <tr key={section.id} className="border-b" style={{ borderColor: "#eee", backgroundColor: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td className="px-4 py-3 font-medium" style={{ color: "#0D1F3C" }}>{section.name_ar}</td>
                    <td className="px-4 py-3 text-gray-600">{section.name_en}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{section.slug}</td>
                    <td className="px-4 py-3 text-gray-500">{section.order}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(section)} className="p-1.5 rounded hover:bg-gray-100"><Pencil size={14} style={{ color: "#C9A84C" }} /></button>
                        <button onClick={() => handleDelete(section.id)} className="p-1.5 rounded hover:bg-gray-100"><Trash2 size={14} className="text-red-400" /></button>
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
