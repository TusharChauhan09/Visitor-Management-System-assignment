import { ClipboardList, QrCode } from "lucide-react";
import { EntryOptionCard } from "@/components/entry-option-card";
import { SiteHeader } from "@/components/site-header";

export default function EntryPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <SiteHeader
        trailing={
          <p className="hidden text-sm text-muted-foreground sm:block">
            Front desk check-in
          </p>
        }
      />

      <div className="flex flex-1 flex-col lg:flex-row">
        <aside
          className="border-b border-border bg-muted/30 lg:w-[min(100%,22rem)] lg:shrink-0 lg:border-b-0 lg:border-r lg:px-12 lg:py-14 xl:w-[26rem]"
        >
          <div className="px-6 py-10 lg:px-0 lg:py-0">
            <p className="text-sm font-medium text-muted-foreground">
              Welcome
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-foreground xl:text-[2.125rem] xl:leading-[1.15]">
              Check in for your visit
            </h1>
            <p className="mt-4 max-w-[34ch] text-base leading-relaxed text-muted-foreground">
              Choose how you arrived. New guests register here; pre-approved
              visitors can use the QR pass from their host.
            </p>
            <ul className="mt-8 space-y-3 border-t border-border/80 pt-8 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground/40" />
                Photo and host approval required for walk-ins
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground/40" />
                Pre-approved visits skip the approval wait
              </li>
            </ul>
          </div>
        </aside>

        <main className="flex flex-1 flex-col px-6 py-10 lg:px-12 lg:py-14">
          <div className="mb-6 lg:mb-8">
            <h2 className="text-sm font-medium text-foreground">
              Select an option
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap a row to continue.
            </p>
          </div>

          <div className="flex max-w-2xl flex-col gap-3">
            <EntryOptionCard
              href="/entry/new"
              title="New visitor entry"
              description="Enter your details and photo. Your host will approve before you get a pass."
              icon={ClipboardList}
            />
            <EntryOptionCard
              href="/entry/scan"
              title="I have a pass"
              description="Scan the QR code from email or SMS if your host pre-approved your visit."
              icon={QrCode}
            />
          </div>

          <p className="mt-auto max-w-2xl pt-12 text-sm text-muted-foreground">
            Questions? Ask security at the desk.
          </p>
        </main>
      </div>
    </div>
  );
}
