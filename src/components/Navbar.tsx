"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Locale } from "@/lib/translations";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";

export default function Navbar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const otherLocale = locale === "ar" ? "en" : "ar";
  const otherPath = pathname.replace(`/${locale}`, `/${otherLocale}`);
  const [open, setOpen] = useState(false);
  const isAr = locale === "ar";
  const { totalCount } = useCart();

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

          {/* Right: cart + business name */}
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/cart`}
              className="relative text-white hover:text-yellow-400 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={24} />
              {totalCount > 0 && (
                <span
                  className="absolute -top-2 -end-2 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  style={{ backgroundColor: "#C9A84C", color: "#0D1F3C" }}
                >
                  {totalCount}
                </span>
              )}
            </Link>
            <Link
              href={`/${locale}`}
              className="font-bold text-xs sm:text-lg text-end hidden sm:block"
              style={{ color: "#C9A84C" }}
            >
              {isAr ? "سعيد نزال التجارية" : "Said Nazzal Trading"}
            </Link>
          </div>
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
