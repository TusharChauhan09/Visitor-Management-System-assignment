"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { checkInByPassCode } from "@/app/actions/visits";
import { QrPassScanner } from "@/components/visit/qr-pass-scanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function runCheckIn(code: string) {
  const response = await fetch("/api/check-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = (await response.json()) as { visitId?: string; error?: string };
  if (!response.ok || data.error) {
    return { error: data.error ?? "Check-in failed." };
  }
  if (!data.visitId) {
    return { error: "Check-in did not return a visit." };
  }
  return { visitId: data.visitId };
}

export function PassCheckIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledCode = searchParams.get("code")?.trim() ?? "";
  const scanLockRef = useRef(false);
  const [scanError, setScanError] = useState("");
  const [scanning, setScanning] = useState(!prefilledCode);
  const [scannerKey, setScannerKey] = useState(0);
  const [formState, formAction, pending] = useActionState(checkInByPassCode, {});

  const handleCheckIn = useCallback(
    async (code: string) => {
      if (scanLockRef.current) return;
      scanLockRef.current = true;
      setScanError("");
      setScanning(false);

      const result = await runCheckIn(code);
      if (result.error) {
        setScanError(result.error);
        scanLockRef.current = false;
        return;
      }
      router.push(`/entry/status/${result.visitId}`);
    },
    [router]
  );

  useEffect(() => {
    if (!prefilledCode) return;
    const timer = window.setTimeout(() => {
      void handleCheckIn(prefilledCode);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [prefilledCode, handleCheckIn]);

  const error = scanError || formState.error;

  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      {error ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive md:col-span-2"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {prefilledCode && !scanning && !error ? (
        <p className="text-sm text-muted-foreground">Checking in from your pass link…</p>
      ) : null}

      <section className="space-y-3 rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 className="text-base font-semibold tracking-tight">Scan QR pass</h2>
        {scanning ? (
          <QrPassScanner
            key={scannerKey}
            onDecode={(text) => void handleCheckIn(text)}
            onError={(message) => {
              setScanError(message);
              setScanning(false);
              scanLockRef.current = false;
            }}
          />
        ) : (
          <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
            Camera is off. Scan again or enter the pass code below.
          </div>
        )}
        {!scanning ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              setScanError("");
              scanLockRef.current = false;
              setScannerKey((k) => k + 1);
              setScanning(true);
            }}
          >
            Scan again
          </Button>
        ) : null}
      </section>

      <form action={formAction} className="space-y-3 rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 className="text-base font-semibold tracking-tight">Enter pass code</h2>
        <div className="space-y-1.5">
          <Label htmlFor="pass-code">Pass code</Label>
          <Input id="pass-code" name="passCode" autoComplete="off" defaultValue={prefilledCode} />
        </div>
        <Button type="submit" size="lg" className="h-11 w-full" disabled={pending}>
          {pending ? "Checking…" : "Check in"}
        </Button>
      </form>
    </div>
  );
}
