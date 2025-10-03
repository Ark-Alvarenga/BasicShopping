import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Modern E-Commerce Platform",
  description: "A fully-functional e-commerce platform built with Next.js, TypeScript, and Stripe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
