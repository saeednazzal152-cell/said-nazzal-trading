import { type Locale } from "@/lib/translations";
import Link from "next/link";
import { Package, LayoutGrid, LogIn, ClipboardList } from "lucide-react";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale: Locale = locale === "en" ? "en" : "ar";
  const isAr = safeLocale === "ar";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#F8F6F0" }}
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: "#0D1F3C" }}
          >
            <LogIn size={28} style={{ color: "#C9A84C" }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "#0D1F3C" }}>
            {isAr ? "لوحة التحكم" : "Admin Panel"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isAr ? "سعيد نزال التجارية" : "Said Nazzal Trading"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link
            href={`/${safeLocale}/admin/orders`}
            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 text-center transition-all hover:shadow-lg hover:scale-105 col-span-2"
            style={{ backgroundColor: "#0D1F3C", borderColor: "#C9A84C44" }}
          >
            <ClipboardList size={36} style={{ color: "#C9A84C" }} />
            <span className="font-semibold text-white">
              {isAr ? "الطلبات" : "Orders"}
            </span>
          </Link>
          <Link
            href={`/${safeLocale}/admin/products`}
            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 text-center transition-all hover:shadow-lg hover:scale-105"
            style={{ backgroundColor: "#fff", borderColor: "#C9A84C44" }}
          >
            <Package size={36} style={{ color: "#C9A84C" }} />
            <span className="font-semibold" style={{ color: "#0D1F3C" }}>
              {isAr ? "المنتجات" : "Products"}
            </span>
          </Link>
          <Link
            href={`/${safeLocale}/admin/sections`}
            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 text-center transition-all hover:shadow-lg hover:scale-105"
            style={{ backgroundColor: "#fff", borderColor: "#C9A84C44" }}
          >
            <LayoutGrid size={36} style={{ color: "#C9A84C" }} />
            <span className="font-semibold" style={{ color: "#0D1F3C" }}>
              {isAr ? "الأقسام" : "Sections"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
