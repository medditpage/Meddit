import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider"; // <-- 1. Import the provider
 
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Medit | Medical Intelligence",
  description: "Clinical intelligence and patient management simplified.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}
      >
        {/* 2. Wrap the children inside the AuthProvider */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
