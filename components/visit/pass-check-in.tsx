"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { checkInByPassCode } from "@/app/actions/visits";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/lib/types";

const SCANNER_ID = "visitor-pass-scanner";

const fieldClass =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

async function pickCameraId() {
  try {
    const cameras = await Html5Qrcode.getCameras();
    if (cameras.length === 0) {
      return { facingMode: "environment" as const };
    }
    const back = cameras.find((c) => /back|rear|environment/i.test(c.label));
    if (back) {
      return back.id;
    }
    return cameras[0].id;
  } catch {
    return { facingMode: "user" as const };
  }
}

export function PassCheckIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledCode = searchParams.get("code") ?? "";
  const [scanError, setScanError] = useState("");
  const [scanning, setScanning] = useState(true);
  const processingRef = useRef(false);
  const [formState, formAction, pending] = useActionState<ActionState, FormData>(
    checkInByPassCode,
    {}
  );

  useEffect(() => {
    if (!scanning) {
      return;
    }

    let scanner: Html5Qrcode | null = null;
    let cancelled = false;

    async function run() {
      scanner = new Html5Qrcode(SCANNER_ID);
      const camera = await pickCameraId();

      try {
        await scanner.start(
          camera,
          { fps: 10, qrbox: { width: 260, height: 260 } },
          async (decodedText) => {
            if (cancelled || processingRef.current) {
              return;
            }
            processingRef.current = true;
            setScanning(false);

            try {
              await scanner?.stop();
            } catch {
              // ignore
            }

            const response = await fetch("/api/check-in", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code: decodedText }),
            });
            const data = (await response.json()) as {
              visitId?: string;
              error?: string;
            };

            if (!response.ok || data.error) {
              setScanError(data.error ?? "Check-in failed.");
              processingRef.current = false;
              return;
            }

            if (data.visitId) {
              router.push(`/entry/status/${data.visitId}`);
            }
          },
          () => undefined
        );
      } catch {
        setScanError(
          "Camera could not start. Allow camera access or type the pass code below."
        );
      }
    }

    void run();

    return () => {
      cancelled = true;
      if (scanner?.isScanning) {
        scanner
          .stop()
          .catch(() => undefined)
          .finally(() => {
            scanner?.clear();
          });
      } else {
        scanner?.clear();
      }
    };
  }, [scanning, router]);

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
          className="min-h-[280px] overflow-hidden rounded-xl border border-border bg-muted/40 [&_video]:w-full"
        />
        {!scanning ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              setScanError("");
              processingRef.current = false;
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
          <input
            name="passCode"
            className={fieldClass}
            autoComplete="off"
            defaultValue={prefilledCode}
          />
        </label>
        <Button type="submit" size="lg" className="h-11" disabled={pending}>
          {pending ? "Checking…" : "Check in"}
        </Button>
      </form>
    </div>
  );
}
