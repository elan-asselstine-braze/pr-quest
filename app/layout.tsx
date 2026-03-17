import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PR Quest",
  description: "Learn to submit pull requests. Built for designers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
