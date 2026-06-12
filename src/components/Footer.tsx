import { type Locale } from "@/lib/translations";
import { Phone, Mail, MapPin } from "lucide-react";

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.12 5.32H17V2.14C16.67 2.1 15.56 2 14.27 2 11.57 2 9.73 3.66 9.73 6.7V9H6.55v3.41h3.18V21h3.69v-8.59h3.06l.49-3.41h-3.55V7.05c0-1.01.27-1.73 1.97-1.73z" />
  </svg>
);

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
            {isAr ? "سعيد نزال التجارية" : "Said Nazzal Trading"}
          </h3>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            {isAr
              ? "نوفر أفضل المستلزمات والمواد الاستهلاكية للمطاعم والفنادق والمقاهي في الأردن"
              : "Premium disposables and supplies for restaurants, hotels, cafes, and more across Jordan"}
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/saidnazzalest"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{ background: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)" }}
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.facebook.com/share/1Ay7Zv1WgE/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: "#1877F2" }}
            >
              <FacebookIcon />
            </a>
          </div>
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
            <a href="tel:+962788816611" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={14} style={{ color: "#C9A84C" }} />
              <span dir="ltr">+962 7 8881 6611</span>
            </a>
            <a href="tel:+96265356444" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={14} style={{ color: "#C9A84C" }} />
              <span dir="ltr">+962 6 535 6444</span>
            </a>
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
        © {year} {isAr ? "سعيد نزال التجارية. جميع الحقوق محفوظة" : "Said Nazzal Trading. All rights reserved"}
      </div>
    </footer>
  );
}
