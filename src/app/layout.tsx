import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import Nav from "@/components/Nav";
import AppProvider from "@/providers/AppProvider";
import ProtectedPages from "@/components/ProtectedPages";
import { Toaster } from "@/components/ui/sonner";

import { cn } from "@/lib/utils";
import "./globals.css";

const roboto_condensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Phrase Locker",
  description:
    "A secure platform for storing and managing phrases or paskeys used in various scenarios, including crypto wallets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(roboto_condensed.className)}>
        <AppProvider>
          <ProtectedPages>
            <Nav />
            {children}
          </ProtectedPages>
        </AppProvider>

        <Toaster
          position="bottom-right"
          theme="light"
          duration={8000}
          closeButton={true}
          richColors
          expand
        />
      </body>
    </html>
  );
}
