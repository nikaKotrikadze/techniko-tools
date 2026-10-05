import type { Metadata } from "next";
import Link from "next/link";
import { SubmitToolForm } from "@/components/SubmitToolForm";

export const metadata: Metadata = {
  title: "Submit a tool",
  description: "Know an AI tool @thetechniko should review? Send it in.",
};

export default function SubmitPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-10 sm:py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Submit a tool</h1>
        <p className="text-muted">
          Found an AI tool I should test? Built one? Send it over. I read every submission, but I only add tools I&apos;ve
          actually tried. Want a guaranteed spot? See{" "}
          <Link href="/advertise" className="text-accent hover:underline">
            advertising
          </Link>
          .
        </p>
      </div>
      <SubmitToolForm />
    </main>
  );
}
