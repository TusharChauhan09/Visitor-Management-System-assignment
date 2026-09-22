"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PhotoCaptureProps = {
  onPhotoChange?: (hasPhoto: boolean) => void;
  onCapture?: (dataUrl: string) => void;
  compact?: boolean;
};

export function PhotoCapture({ onPhotoChange, onCapture, compact }: PhotoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setError("Camera access is needed to capture a visitor photo.");
      }
    }

    if (!photo) {
      void startCamera();
    }

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [photo]);

  function capture() {
    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      setError("Wait for the camera to start, then capture again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const context = canvas.getContext("2d");
    if (!context) {
      setError("Could not capture the photo.");
      return;
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPhoto(dataUrl);
    onPhotoChange?.(true);
    onCapture?.(dataUrl);
    setError("");
  }

  function retake() {
    setPhoto("");
    onPhotoChange?.(false);
    onCapture?.("");
    setError("");
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border border-border bg-muted/40">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt="Captured visitor"
            className={cn("w-full object-cover", compact ? "aspect-square max-h-56" : "aspect-[4/3]")}
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={cn("w-full bg-black object-cover", compact ? "aspect-square max-h-56" : "aspect-[4/3]")}
          />
        )}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {photo ? (
        <Button type="button" variant="outline" size="lg" className="w-full" onClick={retake}>
          <RefreshCw data-icon="inline-start" />
          Retake photo
        </Button>
      ) : (
        <Button type="button" size="lg" className="w-full" onClick={capture}>
          <Camera data-icon="inline-start" />
          Capture photo
        </Button>
      )}
    </div>
  );
}
