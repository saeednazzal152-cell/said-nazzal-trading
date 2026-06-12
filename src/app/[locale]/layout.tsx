import type { Locale } from "@/lib/translations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale: Locale = locale === "en" ? "en" : "ar";

  return (
    <html lang={safeLocale} dir={safeLocale === "ar" ? "rtl" : "ltr"}>
      <body className="min-h-screen flex flex-col bg-white">
        <Navbar locale={safeLocale} />
        <main className="flex-1">{children}</main>
        <Footer locale={safeLocale} />
        <WhatsAppButton locale={safeLocale} />
      </body>
    </html>
  );
}
