import Image from "next/image";
import type { HostVisitSummaryProps } from "@/lib/types";

export function HostVisitSummary({
  visitorName,
  visitorEmail,
  visitorPhone,
  company,
  purpose,
  photoUrl,
  hostName,
  department,
}: HostVisitSummaryProps) {
  return (
    <div className="max-w-lg space-y-6">
      {photoUrl ? (
        <div className="overflow-hidden rounded-xl border border-border">
          <Image
            src={photoUrl}
            alt={`Photo of ${visitorName}`}
            width={480}
            height={360}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      ) : null}
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Visitor</dt>
          <dd className="font-medium">{visitorName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Host</dt>
          <dd className="font-medium">
            {hostName}
            <span className="block font-normal text-muted-foreground">{department}</span>
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Email</dt>
          <dd className="font-medium">{visitorEmail}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Phone</dt>
          <dd className="font-medium">{visitorPhone}</dd>
        </div>
        {company ? (
          <div>
            <dt className="text-muted-foreground">Company</dt>
            <dd className="font-medium">{company}</dd>
          </div>
        ) : null}
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">Purpose</dt>
          <dd className="font-medium">{purpose}</dd>
        </div>
      </dl>
    </div>
  );
}
