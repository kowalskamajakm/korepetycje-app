import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Panel korepetytora",
  description: "Grafik, uczniowie, płatności, prace domowe i materiały w jednym miejscu.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
