"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface VanaWidgetProps {
  appId: string;
  onResult: (data: unknown) => void;
  onError: (error: unknown) => void;
  onAuth: (walletAddress: string) => void;
  iframeOrigin?: string;
  schemaId?: number;
  prompt?: string;
  className?: string;
  loadingNode?: ReactNode;
}

const VanaWidget = ({
  appId,
  onResult,
  onError,
  onAuth,
  iframeOrigin = "https://app.vana.com",
  schemaId,
  prompt,
  className,
  loadingNode,
}: VanaWidgetProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeSrc = `${iframeOrigin}/embed/upload`;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset loading when iframe source changes
    setIsLoading(true);
  }, [iframeSrc]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin for security
      if (event.origin !== iframeOrigin) {
        return;
      }

      switch (event.data.type) {
        case "ready":
          console.log("[DataApp] Widget ready, sending config");
          setIsLoading(false);

          // Send configuration to iframe
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              {
                type: "config",
                appId,
                schemaId,
                aiPrompt: prompt,
                embeddingOrigin: window.location.origin,
              },
              iframeOrigin,
            );
          }
          break;

        case "relay":
          console.log(
            "[DataApp] Received a relay message, sending to UploadWidget",
          );
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              {
                ...event.data?.data,
              },
              iframeOrigin,
            );
          }
          break;

        case "auth":
          console.log("[DataApp] Auth event received", event.data);
          if (event.data.walletAddress) {
            onAuth(event.data.walletAddress);
          }
          break;

        case "complete":
          console.log("[DataApp] Complete event received", event.data);
          if (event.data.result) {
            onResult(event.data.result);
          }
          setIsLoading(false);
          break;

        case "error":
          console.error("[DataApp] Error event received", event.data);
          onError(
            event.data.message || event.data.error || "An error occurred",
          );
          setIsLoading(false);
          break;

        case "resize":
          if (event.data.height && iframeRef.current) {
            iframeRef.current.style.height = `${event.data.height}px`;
          }
          break;

        default:
          console.warn("[DataApp] Ignoring unknown message type");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onResult, onError, onAuth, prompt, appId, schemaId, iframeOrigin]);

  return (
    <div className={cn("w-full relative", className)}>
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        title="Vana Upload Widget"
        className="w-full h-full border-none"
        loading="lazy"
        sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
        onLoad={() => setIsLoading(false)}
      />
      {isLoading ? (loadingNode ?? null) : null}
    </div>
  );
};

export default VanaWidget;
