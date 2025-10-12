import type { Metadata } from "next";
import "./globals.css";
import { nunito } from "@/styles/fonts";
import { MyWorksJson } from "@/constants/ExternalResources";
import {  ServerProvider } from "@/providers/ServerContext";

export const metadata: Metadata = {
  title: "Me-2025",
  description: "Personal Page for 2025",
};

async function getMyWorksData() {
  try {
    const res = await fetch(MyWorksJson, {
      cache: "no-cache",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch MyWorks data:", error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const myWorksData = await getMyWorksData();

  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased overflow-hidden`}>
        <ServerProvider value={{ myWorks: myWorksData }}>
          {children}
        </ServerProvider>
      </body>
    </html>
  );
}
