"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const MOUNT_ID = "vms-qr-scanner-mount";

let releaseCamera: Promise<void> = Promise.resolve();

async function pickCameraId() {
  try {
    const cameras = await Html5Qrcode.getCameras();
    if (cameras.length === 0) {
      return { facingMode: "environment" as const };
    }
    const back = cameras.find((c) => /back|rear|environment/i.test(c.label));
    return back?.id ?? cameras[0].id;
  } catch {
    return { facingMode: "environment" as const };
  }
}

async function stopInstance(scanner: Html5Qrcode | null) {
  if (!scanner) {
    return;
  }
  try {
    if (scanner.isScanning) {
      await scanner.stop();
    }
  } catch {
    // already stopped
  }
  try {
    scanner.clear();
  } catch {
    // ignore
  }
}

type QrPassScannerProps = {
  onDecode: (text: string) => void;
  onError: (message: string) => void;
};

export function QrPassScanner({ onDecode, onError }: QrPassScannerProps) {
  const onDecodeRef = useRef(onDecode);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onDecodeRef.current = onDecode;
    onErrorRef.current = onError;
  }, [onDecode, onError]);

  useEffect(() => {
    let scanner: Html5Qrcode | null = null;
    let cancelled = false;
    let decoded = false;

    const run = async () => {
      await releaseCamera;
      if (cancelled) {
        return;
      }

      const mount = document.getElementById(MOUNT_ID);
      if (!mount) {
        return;
      }
      mount.replaceChildren();

      scanner = new Html5Qrcode(MOUNT_ID, { verbose: false });

      const camera = await pickCameraId();
      if (cancelled) {
        await stopInstance(scanner);
        return;
      }

      try {
        await scanner.start(
          camera,
          { fps: 8, qrbox: { width: 260, height: 260 } },
          (text) => {
            if (cancelled || decoded) {
              return;
            }
            decoded = true;
            onDecodeRef.current(text);
          },
          () => undefined
        );
      } catch {
        if (!cancelled) {
          onErrorRef.current(
            "Camera could not start. Allow camera access or type the pass code below."
          );
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
      const instance = scanner;
      releaseCamera = stopInstance(instance).then(() => {
        const mount = document.getElementById(MOUNT_ID);
        mount?.replaceChildren();
      });
    };
  }, []);

  return (
    <div
      id={MOUNT_ID}
      className="min-h-[280px] overflow-hidden rounded-xl border border-border bg-muted/40 [&_video]:max-h-[320px] [&_video]:w-full [&_video~video]:hidden"
    />
  );
}
