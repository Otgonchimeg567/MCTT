import type { Metadata } from "next";
import { Golos_Text, Montserrat } from "next/font/google";
import "./globals.css";

const golos = Golos_Text({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-golos",
});

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Эм Си Ти Ти ХХК — Флотацийн жоншны баяжмал",
  description:
    "Говьсүмбэрт агуулга багатай жоншны хүдрийг флотацийн аргаар баяжуулж, 95–97%-ийн ФФ-95, ФФ-97 баяжмал экспортолдог.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn" className={`${golos.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
