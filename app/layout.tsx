import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Anuphan, Archivo, Space_Grotesk } from "next/font/google";
import { AppProvider } from "@/lib/store";
import { DEFAULT_LANG, isLang, LANG_COOKIE } from "@/lib/i18n";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const thai = Anuphan({
  subsets: ["thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-anuphan",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tipsy · เกมวงเหล้า",
    template: "%s · Tipsy",
  },
  description: "เกมวงเหล้าในมือถือ: Ladder, Call the Suit, Doraemon · Drinking card games for the table.",
  applicationName: "Tipsy",
  appleWebApp: { capable: true, title: "Tipsy", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0b0a0c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const saved = (await cookies()).get(LANG_COOKIE)?.value;
  const lang = isLang(saved) ? saved : DEFAULT_LANG;

  return (
    <html lang={lang} className={`${display.variable} ${grotesk.variable} ${thai.variable}`}>
      <body className="min-h-dvh bg-ink font-sans text-bone antialiased">
        <div className="glow" aria-hidden="true" />
        <AppProvider initialLang={lang}>{children}</AppProvider>
      </body>
    </html>
  );
}
