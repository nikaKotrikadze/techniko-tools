import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "TechNiko Tools: AI tools I've actually tested", template: "%s | TechNiko Tools" },
  description: "A directory of AI tools reviewed by @thetechniko, with honest ratings, pricing, and video reviews.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border">
          <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
            <Link href="/" className="font-bold tracking-tight">
              TechNiko <span className="text-accent">Tools</span>
            </Link>
            <a href="https://instagram.com/thetechniko" className="text-sm text-muted hover:text-foreground">
              @thetechniko
            </a>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
