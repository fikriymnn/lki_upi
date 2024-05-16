import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarCustom from "@/components/Navbar";
import FooterCustom from "@/components/FooterCustom";
import { UserProvider } from "@/context/userContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://lablkiupi.com"),
  icons: {
    icon: '/logo.svg',
  },
  title: {
    default: "LABORATORIUM KIMIA INSTRUMEN UPI",
    template: `%s | LAB KIMIA INSTRUMEN UPI`,
  },
  description: "Layanan Laboratorium Kimia Instrumen Universitas Pendidikan Indonesia (UPI)",
  openGraph: {
    description: "Layanan Laboratorium Kimia Instrumen Universitas Pendidikan Indonesia (UPI)",
    images: [''],
  },
  keywords: [
    "lab",
    "Lab",
    "laboratorium",
    "Laboratorium",
    "instrument",
    "laboratorium kimia instrument",
    "upi",
    "kimia",
    "kimia upi",
    "kimia instrumen",
    "lab kimia instrumen upi",
    "lab kimia instrumen",
    "Layanan Jasa Analisis LKI UPI",
    "Layanan Pengujian Laboratorium Kimia Instrumen LKI UPI",
    "Laboratorium Kimia Instrumen (LKI)",
    "Layanan analisis ataupun pengujian sampel Laboratorium Kimia Instrumen UPI",
    "Layanan Analisis",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/logo.svg" sizes="any" />
      </head>
      <body className={inter.className}>
        <UserProvider>
          <NavbarCustom />
          <div className="md:pt-[10vh] lg:pt-[10vh] pt-[9vh]">{children}</div>

          <FooterCustom />
        </UserProvider>
      </body>
    </html>
  );
}
