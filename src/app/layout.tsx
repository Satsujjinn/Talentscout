import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NotificationProvider } from "@/components/NotificationProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talent Scout ZA - Discover Western Cape's Finest Athletes",
  description: "Connect athletes with recruiters in the Western Cape. Find your next star player or showcase your talent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NotificationProvider>
            {children}
            <footer className="text-center py-4 text-gray-500 text-sm">
              © 2024 Talent Scout ZA - Created by Leon Jordaan
            </footer>
          </NotificationProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
