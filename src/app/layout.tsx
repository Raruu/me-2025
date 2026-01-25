import type { Metadata } from "next";
import "./globals.css";
import { nunito } from "@/styles/fonts";
import { MyCvJson, MyWorksJson } from "@/constants/ExternalResources";
import { ServerProvider } from "@/providers/ServerContext";
import { DBusProvider } from "@/providers/DBusContext";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Raruu 2K25",
  description: "Personal Page from 2025",
  openGraph: {
    title: "Raruu 2K25",
    description: "Personal Page from 2025",
    images: [
      {
        url: "/og-image.png",
        width: 1326,
        height: 825,
        alt: "Raruu 2K25",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raruu 2K25",
    description: "Personal Page from 2025",
    images: ["/og-image.png"],
  },
};

async function getExternalData(url: string) {
  try {
    const res = await fetch(url, {
      cache: "no-store",
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
          <DBusProvider>
            {children}
          </DBusProvider>
        </ServerProvider>
      </body>
    </html>
  );
}
