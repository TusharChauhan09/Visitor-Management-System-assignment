import { getAppUrl } from "@/lib/config/app-url";

type VisitPassDisplayProps = {
  qrCode: string;
};

export function VisitPassDisplay({ qrCode }: VisitPassDisplayProps) {
  const checkInUrl = `${getAppUrl()}/entry/scan?code=${encodeURIComponent(qrCode)}`;
  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCode)}`;

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-6">
      <h2 className="text-sm font-medium text-foreground">Visitor pass</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Scan at the desk or use the code below on the check-in screen.
      </p>
      <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrImage}
          alt="QR pass"
          width={200}
          height={200}
          className="rounded-lg border border-border bg-white p-2"
        />
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Pass code</p>
          <p className="mt-1 break-all font-mono text-sm">{qrCode}</p>
          <p className="mt-3 text-xs text-muted-foreground">Check-in link</p>
          <p className="mt-1 break-all text-xs text-muted-foreground">{checkInUrl}</p>
        </div>
      </div>
    </div>
  );
}
