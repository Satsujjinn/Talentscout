import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { NotificationProvider } from "@/components/NotificationProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Talent Scout ZA",
  description: "Connect athletes with recruiters in South Africa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-cream-50 min-h-screen flex flex-col`}>
          <NotificationProvider>
            <main className="flex-1">
              {children}
            </main>
            <footer className="text-center py-6 text-sm text-warm-brown-600 border-t border-cream-300 bg-cream-100">
              © 2024 Talent Scout ZA - Created by Leon Jordaan
            </footer>
          </NotificationProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
