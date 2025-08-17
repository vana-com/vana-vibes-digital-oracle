"use client";

import { useEffect, useRef, useState } from "react";

const IFRAME_ORIGIN = "https://vana-vibes-web.vercel.app";
const IFRAME_SRC = `${IFRAME_ORIGIN}/embed/upload`;

interface VanaWidgetProps {
  onResult: (data: string) => void;
  onError: (error: string) => void;
  onAuth: (walletAddress: string) => void;
  prompt?: string;
  appId: string;
  schemaId?: number;
}

const VanaWidget = ({
                      onResult,
                      onError,
                      onAuth,
                      prompt,
                      appId,
                      schemaId,
                    }: VanaWidgetProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin for security
      if (event.origin !== IFRAME_ORIGIN) {
        return;
      }

      switch (event.data.type) {
        case "ready":
          console.log("[DataApp] Widget ready, sending config");
          setIsInitializing(false);

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
              IFRAME_ORIGIN
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
          break;

        case "error":
          console.error("[DataApp] Error event received", event.data);
          onError(
            event.data.message || event.data.error || "An error occurred"
          );
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
  }, [onResult, onError, onAuth, prompt, appId, schemaId]);

  return (
    <div className="w-full relative">
      {isInitializing && (
        <p className="text-center text-body">Connecting to Vana...</p>
      )}
      <iframe ref={iframeRef} src={IFRAME_SRC} className="w-full border-none" />
    </div>
  );
};

export default VanaWidget;
