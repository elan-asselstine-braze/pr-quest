import type { Metadata } from "next";
import "./globals.css";
import { TabNav } from "@/components/TabNav";

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
      <body className="min-h-screen antialiased flex">
        <TabNav />
        <div className="flex-1 min-w-0 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
