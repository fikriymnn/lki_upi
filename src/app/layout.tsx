import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import NavbarCustom from "@/components/Navbar";
import FooterCustom from "@/components/FooterCustom";
import { UserProvider } from "@/context/userContext";

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['200', '300', '400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lablkiupi.com"),
  icons: {
    icon: '/public/logo.svg',
  },
  title: {
    default: "LABORATORIUM KIMIA INSTRUMEN UPI",
    template: `%s | LAB KIMIA INSTRUMEN UPI`,
  },
  description: "Layanan Laboratorium Kimia Instrumen Universitas Pendidikan Indonesia (UPI)",
  openGraph: {
    title: "LABORATORIUM KIMIA INSTRUMEN UPI",
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
      <body className={jakarta.className}>
        <UserProvider>
          <NavbarCustom />
          <div>{children}</div>

          <FooterCustom />
        </UserProvider>
      </body>
    </html>
  );
}
