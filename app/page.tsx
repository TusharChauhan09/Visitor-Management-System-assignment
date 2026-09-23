import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { HomeEntryOptions } from "@/components/visit/home-entry-options";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function EntryPage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-background">
      <SiteHeader
        trailing={
          <Link href="/login" className={cn(buttonVariants({ variant: "default" }))}>
            Login
          </Link>
        }
      />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Check in for your visit</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Register as a walk-in guest or scan the QR from your host.
          </p>
        </header>
        <HomeEntryOptions />
      </main>
    </div>
  );
}
