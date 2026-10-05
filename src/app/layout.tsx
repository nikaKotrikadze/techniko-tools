import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@/components/Analytics";
import { WaitlistForm } from "@/components/WaitlistForm";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "TechNiko Tools: AI tools I've actually tested", template: "%s | TechNiko Tools" },
  description: "A directory of AI tools reviewed by @thetechniko, with honest ratings, pricing, and video reviews.",
  openGraph: { siteName: "TechNiko Tools", type: "website" },
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
            <nav className="flex items-center gap-4 text-sm text-muted">
              <Link href="/submit" className="hover:text-foreground">
                Submit a tool
              </Link>
              <Link href="/advertise" className="hover:text-foreground">
                Advertise
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="mt-16 border-t border-border">
          <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <p className="font-semibold">Get new AI tool reviews by email</p>
              <WaitlistForm />
            </div>
            <div className="flex flex-col gap-2 text-sm text-muted sm:items-end">
              <a href="https://instagram.com/thetechniko" className="hover:text-foreground">
                Instagram @thetechniko
              </a>
              <Link href="/submit" className="hover:text-foreground">
                Submit a tool
              </Link>
              <Link href="/advertise" className="hover:text-foreground">
                Advertise
              </Link>
              <p className="mt-2">Sponsored placements are always labeled. Some links are affiliate links.</p>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
