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
        <body className={`${inter.className} bg-[#fefefe] min-h-screen flex flex-col`}>
          <NotificationProvider>
            <main className="flex-1">
              {children}
            </main>
            <footer className="text-center py-6 text-sm text-[#9a8558] border-t border-[#f5f1e6] bg-[#fdfcf9]">
              © 2024 Talent Scout ZA - Created by Leon Jordaan
            </footer>
          </NotificationProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
