import type { Metadata } from "next";
import "./globals.css";
import AppChrome from "@/components/AppChrome";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryProvider } from "@/components/QueryProvider";
import { AudioProvider } from "@/context/AudioContext";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Sound Buttons Max: Free Meme Soundboard Unblocked",
  description: "Play 100,000+ free meme sound buttons instantly. Vine Boom, Bruh, Goofy Ahh & more. No download, no login. Unblocked on school and work networks.",
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className="antialiased transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AudioProvider>
              <AppChrome>{children}</AppChrome>
              <Toaster position="bottom-right" toastOptions={{
                style: {
                  background: '#333',
                  color: '#fff',
                  borderRadius: '12px',
                },
              }} />
            </AudioProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
