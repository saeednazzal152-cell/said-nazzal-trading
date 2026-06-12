export const dynamic = "force-dynamic";

import { type Locale } from "@/lib/translations";
import { supabase, type Section, type Product } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { Package, ChevronRight, ChevronLeft } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale: Locale = locale === "en" ? "en" : "ar";
  const isAr = safeLocale === "ar";

  const [{ data: sections }, { data: products }] = await Promise.all([
    supabase.from("sections").select("*").order("order", { ascending: true }),
    supabase
      .from("products")
      .select("*, sections(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const ChevronIcon = isAr ? ChevronLeft : ChevronRight;

  return (
    <div dir={isAr ? "rtl" : "ltr"}>
      {/* Hero */}
      <section
        className="relative flex items-center justify-center min-h-[500px] overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #080F1E 0%, #0D1F3C 50%, #1B3460 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, #C9A84C 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C9A84C 0%, transparent 40%)"
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <div
            className="inline-block text-xs font-semibold px-4 py-1 rounded-full mb-6 tracking-widest uppercase"
            style={{ backgroundColor: "#C9A84C22", color: "#C9A84C", border: "1px solid #C9A84C44" }}
          >
            {isAr ? "الأردن" : "Jordan"}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {isAr ? "كل ما تحتاجه" : "Everything Your"}
            <br />
            <span style={{ color: "#C9A84C" }}>
              {isAr ? "لمطبخك ومطعمك" : "Kitchen Needs"}
            </span>
          </h1>
          <p className="text-white/70 text-lg mb-8 leading-relaxed">
            {isAr
              ? "مستلزمات ومواد استهلاكية عالية الجودة للمطاعم والفنادق والمقاهي وبيوت القهوة وأصحاب الحلويات في الأردن"
              : "Premium disposables and supplies for restaurants, hotels, cafes, coffee houses, and home bakers across Jordan"}
          </p>
          <Link
            href={`/${safeLocale}/products`}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white transition-all hover:scale-105"
            style={{ backgroundColor: "#C9A84C" }}
          >
            {isAr ? "تسوق الآن" : "Shop Now"}
            <ChevronIcon size={18} />
          </Link>
        </div>
      </section>

      {/* Sections */}
      {sections && sections.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: "#0D1F3C" }}>
            {isAr ? "تصفح حسب الفئة" : "Browse by Category"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sections.map((section: Section) => (
              <Link
                key={section.id}
                href={`/${safeLocale}/products?section=${section.slug}`}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 text-center transition-all hover:scale-105 hover:shadow-lg group"
                style={{ borderColor: "#C9A84C33" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#F8F4EC" }}
                >
                  {section.image_url ? (
                    <Image
                      src={section.image_url}
                      alt={isAr ? section.name_ar : section.name_en}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  ) : (
                    <Package size={28} style={{ color: "#C9A84C" }} />
                  )}
                </div>
                <span
                  className="text-sm font-semibold group-hover:text-yellow-700 transition-colors"
                  style={{ color: "#0D1F3C" }}
                >
                  {isAr ? section.name_ar : section.name_en}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {products && products.length > 0 && (
        <section
          className="py-16"
          style={{ backgroundColor: "#F8F6F0" }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold" style={{ color: "#0D1F3C" }}>
                {isAr ? "منتجات مميزة" : "Featured Products"}
              </h2>
              <Link
                href={`/${safeLocale}/products`}
                className="flex items-center gap-1 text-sm font-medium transition-colors hover:underline"
                style={{ color: "#C9A84C" }}
              >
                {isAr ? "عرض الكل" : "View All"}
                <ChevronIcon size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} locale={safeLocale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {(!products || products.length === 0) && (!sections || sections.length === 0) && (
        <div className="text-center py-24 text-gray-400">
          <Package size={64} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">{isAr ? "قريباً..." : "Coming soon..."}</p>
        </div>
      )}
    </div>
  );
}
