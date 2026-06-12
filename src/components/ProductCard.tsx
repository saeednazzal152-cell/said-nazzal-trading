import { type Product } from "@/lib/supabase";
import { Package } from "lucide-react";

type Props = {
  product: Product;
  locale: "ar" | "en";
};

export default function ProductCard({ product, locale }: Props) {
  const isAr = locale === "ar";
  const name = isAr ? product.name_ar : product.name_en;
  const description = isAr ? product.description_ar : product.description_en;

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden border transition-transform hover:-translate-y-1 hover:shadow-xl"
      style={{ borderColor: "#C9A84C33" }}
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Image */}
      <div
        className="relative h-48 w-full flex items-center justify-center"
        style={{ backgroundColor: "#F8F4EC" }}
      >
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Package size={48} style={{ color: "#C9A84C" }} />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-bold text-base mb-1 line-clamp-2"
          style={{ color: "#0D1F3C" }}
        >
          {name}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>
        )}

        {/* Prices */}
        <div className="flex flex-col gap-1 mt-2 mb-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{isAr ? "القطعة" : "Piece"}</span>
            <span className="font-bold" style={{ color: "#C9A84C" }}>
              {product.price} {isAr ? "د.أ" : "JD"}
            </span>
          </div>
          {product.package_price ? (
            <div className="flex items-center justify-between text-sm border-t pt-1" style={{ borderColor: "#C9A84C22" }}>
              <span className="text-gray-500">
                {isAr ? "العبوة" : "Package"}
                {product.package_size ? ` (${product.package_size}${isAr ? " قطعة" : " pcs"})` : ""}
              </span>
              <span className="font-bold" style={{ color: "#0D1F3C" }}>
                {product.package_price} {isAr ? "د.أ" : "JD"}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end mt-1">
          <span
            className="text-xs px-2 py-1 rounded-full font-medium"
            style={
              product.stock > 0
                ? { backgroundColor: "#E8F5E9", color: "#2E7D32" }
                : { backgroundColor: "#FFEBEE", color: "#C62828" }
            }
          >
            {product.stock > 0
              ? isAr ? `متوفر (${product.stock})` : `In Stock (${product.stock})`
              : isAr ? "غير متوفر" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
}
