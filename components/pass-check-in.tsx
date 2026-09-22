"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { checkInByPassCode, checkInByScannedCode, type ActionState } from "@/app/actions/visits";
import { Button } from "@/components/ui/button";

const SCANNER_ID = "visitor-pass-scanner";

const fieldClass =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function PassCheckIn() {
  const [scanError, setScanError] = useState("");
  const [scanning, setScanning] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [formState, formAction, pending] = useActionState<ActionState, FormData>(
    checkInByPassCode,
    {}
  );

  useEffect(() => {
    if (!scanning) {
      return;
    }

    const scanner = new Html5Qrcode(SCANNER_ID);
    scannerRef.current = scanner;
    let stopped = false;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 8, qrbox: { width: 240, height: 240 } },
        async (decodedText) => {
          if (stopped) {
            return;
          }
          stopped = true;
          setScanning(false);
          try {
            await scanner.stop();
          } catch {
            // Camera may already be stopped.
          }
          const result = await checkInByScannedCode(decodedText);
          if (result?.error) {
            setScanError(result.error);
          }
        },
        () => undefined
      )
      .catch(() => {
        setScanError("Camera could not start. Type the pass code instead, or allow camera access.");
      });

    return () => {
      stopped = true;
      scanner
        .stop()
        .catch(() => undefined)
        .finally(() => {
          scanner.clear();
        });
    };
  }, [scanning]);

  const error = scanError || formState.error;

  return (
    <div className="max-w-xl space-y-10">
      {error ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-base font-semibold tracking-tight">Scan QR pass</h2>
        <p className="text-sm text-muted-foreground">
          Hold the e-pass from email or SMS in front of the camera.
        </p>
        <div
          id={SCANNER_ID}
          className="overflow-hidden rounded-xl border border-border bg-muted/40 [&_video]:w-full"
        />
        {!scanning ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              setScanError("");
              setScanning(true);
            }}
          >
            Scan again
          </Button>
        ) : null}
      </section>

      <form action={formAction} className="space-y-3 border-t border-border pt-8">
        <h2 className="text-base font-semibold tracking-tight">Or type the pass code</h2>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Pass code</span>
          <input name="passCode" className={fieldClass} autoComplete="off" />
        </label>
        <Button type="submit" size="lg" className="h-11" disabled={pending}>
          {pending ? "Checking…" : "Check in"}
        </Button>
      </form>
    </div>
  );
}
