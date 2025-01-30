import type { Metadata } from "next";
import "./globals.css";
import { nunito } from "@/styles/fonts";

export const metadata: Metadata = {
  title: "Me-2025",
  description: "Personal Page for 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased overflow-hidden`}>{children}</body>
    </html>
  );
}
