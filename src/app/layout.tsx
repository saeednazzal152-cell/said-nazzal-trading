import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Said Nazzal Trading | سعيد نزال التجارية",
  description: "Disposables and supplies for restaurants, hotels, cafes, and more in Jordan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
