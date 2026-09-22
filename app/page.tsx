import Link from "next/link";
import { ClipboardList, QrCode } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { EntryOptionCard } from "@/components/visit/entry-option-card";

export default function EntryPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <SiteHeader
        trailing={
          <div className="flex items-center gap-4">
            <Link
              href="/employee/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Employee
            </Link>
            <Link
              href="/admin/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Admin
            </Link>
          </div>
        }
      />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10 lg:py-14">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Check in for your visit
        </h1>

        <div className="mt-8 flex flex-col gap-3">
          <EntryOptionCard
            href="/entry/new"
            title="New visitor entry"
            description="Register at the desk. Your host approves before you get a pass."
            icon={ClipboardList}
          />
          <EntryOptionCard
            href="/entry/scan"
            title="I have a pass"
            description="Scan your QR or enter your pass code."
            icon={QrCode}
          />
        </div>
      </main>
    </div>
  );
}
