import { type Locale } from "@/lib/translations";
import { Phone, Mail, MapPin } from "lucide-react";

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.62c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.22-.94.47-1.35.88-.41.41-.66.8-.88 1.35-.16.41-.35 1.03-.4 2.17-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.22.55.47.94.88 1.35.41.41.8.66 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.22.94-.47 1.35-.88.41-.41.66-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 00-.88-1.35 3.6 3.6 0 00-1.35-.88c-.41-.16-1.03-.35-2.17-.4-1.24-.06-1.59-.07-4.74-.07zm0 2.76a5.42 5.42 0 110 10.84 5.42 5.42 0 010-10.84zm0 1.62a3.8 3.8 0 100 7.6 3.8 3.8 0 000-7.6zm5.6-2.9a1.27 1.27 0 110 2.53 1.27 1.27 0 010-2.53z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
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
