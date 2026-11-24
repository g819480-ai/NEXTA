import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NESTA — Your Style. Your Choice.",
  description: "Shop fashion, shoes, bags, electronics and everyday essentials across Ghana."
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
