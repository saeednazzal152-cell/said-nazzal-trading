import { type Locale } from "@/lib/translations";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const year = new Date().getFullYear();

  return (
    <footer
      style={{ backgroundColor: "#0D1F3C" }}
      className="text-white mt-16"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-3" style={{ color: "#C9A84C" }}>
            {isAr ? "سعيد نزال للتجارة" : "Said Nazzal Trading"}
          </h3>
          <p className="text-white/70 text-sm leading-relaxed">
            {isAr
              ? "نوفر أفضل المستلزمات والمواد الاستهلاكية للمطاعم والفنادق والمقاهي في الأردن"
              : "Premium disposables and supplies for restaurants, hotels, cafes, and more across Jordan"}
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3" style={{ color: "#C9A84C" }}>
            {isAr ? "تواصل معنا" : "Contact Us"}
          </h4>
          <div className="flex flex-col gap-2 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: "#C9A84C" }} />
              <span>{isAr ? "الأردن" : "Jordan"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} style={{ color: "#C9A84C" }} />
              <span dir="ltr">+962 XX XXX XXXX</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} style={{ color: "#C9A84C" }} />
              <span>info@saidnazzalest.com</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3" style={{ color: "#C9A84C" }}>
            {isAr ? "الفئات" : "Categories"}
          </h4>
          <div className="flex flex-col gap-1 text-sm text-white/70">
            {(isAr
              ? ["مطاعم", "فنادق", "مقاهي", "بيوت القهوة", "الحلويات المنزلية"]
              : ["Restaurants", "Hotels", "Cafes", "Coffee Houses", "Home Bakers"]
            ).map((cat) => (
              <span key={cat}>{cat}</span>
            ))}
          </div>
        </div>
      </div>
      <div
        className="border-t text-center py-4 text-sm text-white/50"
        style={{ borderColor: "#C9A84C33" }}
      >
        © {year} {isAr ? "سعيد نزال للتجارة. جميع الحقوق محفوظة" : "Said Nazzal Trading. All rights reserved"}
      </div>
    </footer>
  );
}
