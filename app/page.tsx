import Link from "next/link";
import { AppCanvas } from "@/components/layout/app-canvas";
import { SiteHeader } from "@/components/layout/site-header";
import { HomeEntryOptions } from "@/components/visit/home-entry-options";
import { HomeHero } from "@/components/visit/home-hero";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function EntryPage() {
  return (
    <AppCanvas variant="lobby">
      <SiteHeader
        trailing={
          <div className="flex items-center gap-2">
            <Link
              href="/employee/login"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Employee
            </Link>
            <Link
              href="/admin/login"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Admin
            </Link>
          </div>
        }
      />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-10 lg:py-16">
        <HomeHero />

        <HomeEntryOptions />

        <Separator className="my-10" />

        <p className="text-center text-xs text-muted-foreground">
          Need host access?{" "}
          <Link href="/employee/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            Register as an employee
          </Link>
        </p>
      </main>
    </AppCanvas>
  );
}
