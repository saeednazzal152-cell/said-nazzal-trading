"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Locale } from "@/lib/translations";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const otherLocale = locale === "ar" ? "en" : "ar";
  const otherPath = pathname.replace(`/${locale}`, `/${otherLocale}`);
  const [open, setOpen] = useState(false);
  const isAr = locale === "ar";

  return (
    <nav
      style={{ backgroundColor: "#0D1F3C" }}
      className="sticky top-0 z-50 shadow-lg"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20">
          {/* Left: links + language */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href={`/${locale}`}
              className="text-white hover:text-yellow-400 transition-colors text-sm font-medium"
            >
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="text-white hover:text-yellow-400 transition-colors text-sm font-medium"
            >
              {isAr ? "المنتجات" : "Products"}
            </Link>
            <Link
              href={otherPath}
              className="px-3 py-1 rounded border text-sm font-medium transition-colors"
              style={{ borderColor: "#C9A84C", color: "#C9A84C" }}
            >
              {isAr ? "English" : "عربي"}
            </Link>
          </div>

          {/* Mobile menu button (left on mobile) */}
          <button
            className="md:hidden text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Center: logo */}
          <Link
            href={`/${locale}`}
            className="absolute left-1/2 -translate-x-1/2 flex items-center"
          >
            <span className="bg-white rounded-full p-1 flex items-center justify-center shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="Said Nazzal Trading" className="h-12 w-12 object-contain rounded-full" />
            </span>
          </Link>

          {/* Right: business name */}
          <Link
            href={`/${locale}`}
            className="font-bold text-sm sm:text-lg text-end"
            style={{ color: "#C9A84C" }}
          >
            {isAr ? "سعيد نزال للتجارة" : "Said Nazzal Trading"}
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-4 pb-4 flex flex-col gap-3"
          style={{ backgroundColor: "#0D1F3C" }}
        >
          <Link
            href={`/${locale}`}
            className="text-white text-sm font-medium py-2 border-b border-white/10"
            onClick={() => setOpen(false)}
          >
            {isAr ? "الرئيسية" : "Home"}
          </Link>
          <Link
            href={`/${locale}/products`}
            className="text-white text-sm font-medium py-2 border-b border-white/10"
            onClick={() => setOpen(false)}
          >
            {isAr ? "المنتجات" : "Products"}
          </Link>
          <Link
            href={otherPath}
            className="text-sm font-medium py-2"
            style={{ color: "#C9A84C" }}
            onClick={() => setOpen(false)}
          >
            {isAr ? "English" : "عربي"}
          </Link>
        </div>
      )}
    </nav>
  );
}
