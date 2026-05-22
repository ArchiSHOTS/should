import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yoursecondthought.com"),
  title: "Your Second Thought — Think Before You Post",
  description:
    "Write your draft. Answer three honest questions. Get a verdict — and post from a calmer place. No sign-up, no email, no tracking.",
  openGraph: {
    title: "Your Second Thought — Think Before You Post",
    description:
      "Write your draft. Answer three honest questions. Get a verdict — and post from a calmer place. No sign-up, no email, no tracking.",
    url: "https://yoursecondthought.com",
    siteName: "Your Second Thought",
    images: [
      {
        url: "/og-image.png",
        width: 1500,
        height: 1000,
        alt: "Your Second Thought — The space between impulse and regret",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Second Thought — Think Before You Post",
    description:
      "Write your draft. Answer three honest questions. Get a verdict — and post from a calmer place. No sign-up, no email, no tracking.",
    images: ["/og-image.png"],
  },
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
