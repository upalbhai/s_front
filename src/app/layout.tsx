import type { Metadata } from "next";
import "./globals.css";
import AppChrome from "@/components/AppChrome";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryProvider } from "@/components/QueryProvider";

export const metadata: Metadata = {
  title: "Sound Buttons Max: Free Meme Soundboard Unblocked",
  description: "Play 100,000+ free meme sound buttons instantly. Vine Boom, Bruh, Goofy Ahh & more. Unblocked on school and work networks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AppChrome>{children}</AppChrome>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
