import type { Metadata } from "next";
import "./globals.css";
import { nunito } from "@/styles/fonts";
import { MyCvJson, MyWorksJson } from "@/constants/ExternalResources";
import { ServerProvider } from "@/providers/ServerContext";

export const metadata: Metadata = {
  title: "Me-2025",
  description: "Personal Page for 2025",
};

async function getExternalData(url: string) {
  try {
    const res = await fetch(url, {
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
  const myWorksData = await getExternalData(MyWorksJson);
  const myCvData = await getExternalData(MyCvJson);

  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased overflow-hidden`}>
        <ServerProvider value={{ myWorks: myWorksData, cv: myCvData }}>
          {children}
        </ServerProvider>
      </body>
    </html>
  );
}
