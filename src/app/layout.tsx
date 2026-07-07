import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Student Hub — India's Open Student Community",
    template: "%s | Student Hub",
  },
  description:
    "India's largest open student community. Discover hackathons, internships, workshops, scholarships, and connect with 5,000+ students. Learn. Build. Grow Together.",
  keywords: [
    "student community",
    "hackathons India",
    "internships",
    "coding contests",
    "student opportunities",
    "tech community",
    "Student Hub",
  ],
  openGraph: {
    title: "Student Hub — India's Open Student Community",
    description:
      "Discover hackathons, internships, workshops, and connect with students across India.",
    url: "https://studenthub.in",
    siteName: "Student Hub",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Hub — India's Open Student Community",
    description:
      "Discover hackathons, internships, workshops, and connect with students across India.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-surface text-text-primary font-sans">
        <ThemeProvider>
          <CustomCursor />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
