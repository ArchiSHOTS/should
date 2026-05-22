import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your Second Thought",
  description:
    "The space between impulse and regret. A privacy-first mindful buffer for social media — end-to-end encrypted, zero tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
