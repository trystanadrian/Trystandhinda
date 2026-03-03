import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import AuthGuard from "@/components/AuthGuard";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "trystandhinda - Our Love Story",
  description: "Digital Time Capsule Relationship. No Distance Can Downgrade Us ❤️",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path fill='%23E89B9B' d='M50,85 C20,70 5,55 5,40 C5,25 15,15 25,15 C35,15 45,25 50,35 C55,25 65,15 75,15 C85,15 95,25 95,40 C95,55 80,70 50,85 Z'/></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${playfair.variable} antialiased min-h-screen flex flex-col bg-transparent text-teal-800 overflow-x-hidden`}
      >

        {/* WRAPPER UTAMA */}
        <main className="flex-1 w-full">
          <AuthGuard>{children}</AuthGuard>
        </main>

      </body>
    </html>
  );
}