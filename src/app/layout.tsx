import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";

const ibmPlex = IBM_Plex_Sans_Arabic({
  variable: "--font-body",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoKufi = Noto_Kufi_Arabic({
  variable: "--font-display",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "وكالة أنباء الحسد | Al Hasad News",
  description: "وكالة أنباء الحسد — أخبار محلية ودولية، رياضة، المرأة والمجتمع، حوادث",
  keywords: ["أخبار", "وكالة أنباء", "أخبار محلية", "أخبار دولية", "رياضة"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${ibmPlex.variable} ${notoKufi.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
