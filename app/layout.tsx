import type { Metadata } from "next";
import { Inria_Serif } from "next/font/google";
import "./globals.css";

const inriaSerif = Inria_Serif({
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-inria-serif", // CSS variable to use later
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vivijournal.vercel.app"),
  title: "vivi's journal!",
  description: "she be eating this up ngl",
  icons: {
    icon: "/durama-favicon.png",
  },
  openGraph: {
    title: "vivi's journal!",
    description: "she be eating this up ngl",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inriaSerif.variable} antialiased`}>{children}</body>
    </html>
  );
}
