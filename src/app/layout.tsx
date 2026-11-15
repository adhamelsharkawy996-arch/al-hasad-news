import { Metadata } from "next";
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
  title: "وكالة الحصاد نيوز | Al Hasad News",
  description: "وكالة الحصاد نيوز — أخبار محلية ودولية، رياضة، المرأة والمجتمع، حوادث",
  keywords: ["أخبار", "وكالة حصاد", "أخبار محلية", "أخبار دولية", "رياضة"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "وكالة الحصاد نيوز | Al Hasad News",
    description: "وكالة الحصاد نيوز — أخبار محلية ودولية، رياضة، المرأة والمجتمع، حوادث",
    type: "website",
    locale: "ar_EG",
    siteName: "وكالة الحصاد نيوز",
  },
  twitter: {
    card: "summary_large_image",
    title: "وكالة الحصاد نيوز | Al Hasad News",
    description: "وكالة الحصاد نيوز — أخبار محلية ودولية، رياضة، المرأة والمجتمع، حوادث",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${ibmPlex.variable} ${notoKufi.variable}`}>
      <head>
        <meta name="theme-color" content="#1a1a2e" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
