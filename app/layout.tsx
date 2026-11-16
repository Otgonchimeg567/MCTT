import type { Metadata } from "next";
// Self-hosted variable fonts. Their index.css carries every subset, incl. cyrillic-ext for the Mongolian letters
// Ө ө Ү ү. next/font/google can't build against the current Google Fonts responses on this Next.js version
// (font URLs no longer end in .woff2), so the files ship from node_modules — no network needed at build time.
import "@fontsource-variable/golos-text";
import "@fontsource-variable/montserrat";
import "./globals.css";

export const metadata: Metadata = {
  title: "Эм Си Ти Ти ХХК — Флотацийн жоншны баяжмал",
  description:
    "Говьсүмбэрт агуулга багатай жоншны хүдрийг флотацийн аргаар баяжуулж, 95–97%-ийн ФФ-95, ФФ-97 баяжмал экспортолдог.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
