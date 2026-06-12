"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type Product } from "@/lib/supabase";
import { Package } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SlideShow({
  products,
  locale,
}: {
  products: Product[];
  locale: "ar" | "en";
}) {
  const isAr = locale === "ar";
  // Start with server order (no hydration mismatch), then shuffle on mount.
  const [items, setItems] = useState<Product[]>(products);

  useEffect(() => {
    setItems(shuffle(products));
  }, [products]);

  if (!items || items.length === 0) return null;

  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...items, ...items];

  return (
    <section className="py-10 overflow-hidden" style={{ backgroundColor: "#0D1F3C" }}>
      <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "#C9A84C" }}>
        {isAr ? "تشكيلتنا" : "Our Collection"}
      </h2>
      <div className="relative">
        <div className="flex gap-4 w-max snt-marquee px-4">
          {loop.map((p, idx) => (
            <Link
              key={idx}
              href={`/${locale}/products`}
              className="shrink-0 w-44 bg-white rounded-xl overflow-hidden shadow-md"
              dir={isAr ? "rtl" : "ltr"}
            >
              <div
                className="h-32 w-full flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: "#F8F4EC" }}
              >
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={isAr ? p.name_ar : p.name_en} className="h-full w-full object-cover" />
                ) : (
                  <Package size={36} style={{ color: "#C9A84C" }} />
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm line-clamp-1" style={{ color: "#0D1F3C" }}>
                  {isAr ? p.name_ar : p.name_en}
                </p>
                <p className="font-bold text-sm mt-1" style={{ color: "#C9A84C" }}>
                  {p.price} {isAr ? "د.أ" : "JD"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
