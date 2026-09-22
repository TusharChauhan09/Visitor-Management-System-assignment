import { getAppUrl } from "@/lib/config/app-url";
import { buildCheckInUrl } from "@/lib/visits/pass-code";

type VisitPassDisplayProps = {
  qrCode: string;
};

export function VisitPassDisplay({ qrCode }: VisitPassDisplayProps) {
  const checkInUrl = buildCheckInUrl(qrCode, getAppUrl());
  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(checkInUrl)}`;

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-6">
      <h2 className="text-sm font-medium text-foreground">Visitor pass</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Show this QR at the desk scanner, or enter the pass code on the check-in screen.
      </p>
      <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrImage}
          alt="Check-in QR code"
          width={240}
          height={240}
          className="rounded-lg border border-border bg-white p-2"
        />
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Pass code</p>
          <p className="mt-1 break-all font-mono text-sm">{qrCode}</p>
        </div>
      </div>
    </div>
  );
}
