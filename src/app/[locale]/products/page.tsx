export const dynamic = "force-dynamic";

import { type Locale } from "@/lib/translations";
import { supabase, type Section, type Product } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Package } from "lucide-react";

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ section?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { section: sectionSlug, q: query } = await searchParams;
  const safeLocale: Locale = locale === "en" ? "en" : "ar";
  const isAr = safeLocale === "ar";

  const [{ data: sections }, productsResult] = await Promise.all([
    supabase.from("sections").select("*").order("order", { ascending: true }),
    (() => {
      let q = supabase
        .from("products")
        .select("*, sections(*)")
        .eq("is_active", true);
      if (sectionSlug) {
        q = q.eq("sections.slug", sectionSlug);
      }
      return q.order("created_at", { ascending: false });
    })(),
  ]);

  let products = productsResult.data as Product[] | null;

  if (query && products) {
    const lower = query.toLowerCase();
    products = products.filter(
      (p) =>
        p.name_ar.toLowerCase().includes(lower) ||
        p.name_en.toLowerCase().includes(lower)
    );
  }

  const activeSection = sections?.find((s: Section) => s.slug === sectionSlug);

  return (
    <div
      className="max-w-7xl mx-auto px-4 py-10"
      dir={isAr ? "rtl" : "ltr"}
    >
      <h1 className="text-2xl font-bold mb-2" style={{ color: "#0D1F3C" }}>
        {activeSection
          ? isAr ? activeSection.name_ar : activeSection.name_en
          : isAr ? "جميع المنتجات" : "All Products"}
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        {products?.length ?? 0} {isAr ? "منتج" : "products"}
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-52 shrink-0">
          <h2 className="font-semibold text-sm mb-3 uppercase tracking-wide text-gray-500">
            {isAr ? "الفئات" : "Categories"}
          </h2>
          <div className="flex flex-col gap-1">
            <Link
              href={`/${safeLocale}/products`}
              className="text-sm px-3 py-2 rounded-lg transition-colors font-medium"
              style={
                !sectionSlug
                  ? { backgroundColor: "#0D1F3C", color: "#fff" }
                  : { color: "#0D1F3C" }
              }
            >
              {isAr ? "الكل" : "All"}
            </Link>
            {sections?.map((section: Section) => (
              <Link
                key={section.id}
                href={`/${safeLocale}/products?section=${section.slug}`}
                className="text-sm px-3 py-2 rounded-lg transition-colors font-medium"
                style={
                  sectionSlug === section.slug
                    ? { backgroundColor: "#0D1F3C", color: "#fff" }
                    : { color: "#0D1F3C" }
                }
              >
                {isAr ? section.name_ar : section.name_en}
              </Link>
            ))}
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {/* Search */}
          <form className="mb-6">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder={isAr ? "ابحث عن منتج..." : "Search products..."}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "#C9A84C66", outlineColor: "#C9A84C" }}
            />
          </form>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={safeLocale}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Package size={48} className="mx-auto mb-3 opacity-30" />
              <p>{isAr ? "لا توجد منتجات" : "No products found"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
