import { useToast } from "@/hooks/use-toast";
import { LinkedInData } from "@/lib/linkedin-data.type";
import { cn } from "@/lib/utils";
import JSON5 from "json5";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LandingCard } from "./LandingCard";
import { ScreenWrapper } from "./ScreenWrapper";
import VanaWidget from "./VanaWidget";
import BlockLoader from "./BlockLoader";

interface LandingProps {
  onDataConnect?: (data: unknown) => void;
}

// Landing-only, stricter version of linkedin-data.type.ts
interface LandingPosition {
  title?: string;
  company?: string;
  startDate?: string;
  current?: boolean;
  endDate?: string;
  description?: string;
}

interface LandingEducation {
  school?: string;
  degree?: string;
  graduationYear?: string;
}

interface LinkedInLandingData {
  firstName?: string;
  lastName?: string;
  headline?: string;
  summary?: string;
  positions?: LandingPosition[];
  skills?: string[];
  education?: LandingEducation[];
  [key: string]: unknown;
}

const vanaPrompt = `You are an AI assistant that extracts and structures LinkedIn profile data.

STEP 1: ANALYZE THE DATA
Carefully examine the provided LinkedIn data and extract the following fields:
- firstName
- lastName
- headline
- summary
- positions (including title, company, startDate, endDate, current status, description)
- skills
- education (including school, degree, graduationYear)

STEP 2: OUTPUT VALID JSON
Return ONLY a valid JSON object with the extracted information. The structure must match the example below exactly. Do NOT include any additional text, explanations, or markdown.

{
  "firstName": "Alex",
  "lastName": "Smith",
  "headline": "Senior Software Engineer at TechCorp",
  "summary": "Passionate full-stack developer with 5+ years of experience...",
  "positions": [
    {
      "title": "Senior Software Engineer",
      "company": "TechCorp",
      "startDate": "2022-01",
      "current": true,
      "description": "Leading development..."
    },
    {
      "title": "Full Stack Developer",
      "company": "StartupXYZ",
      "startDate": "2020-03",
      "endDate": "2021-12",
      "description": "Built customer-facing web applications..."
    }
  ],
  "skills": ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"],
  "education": [
    {
      "school": "University of Technology",
      "degree": "Computer Science",
      "graduationYear": "2019"
    }
  ]
}

CRITICAL REQUIREMENTS:
- Return ONLY valid JSON.
- Handle missing data gracefully by using null or empty arrays.
- Ensure all keys and the overall structure match the example precisely.

Now, process this LinkedIn data: {{data}}`;

// This will be true only if VITE_USE_TEST_PAYLOAD is exactly the string "true".
// If the env var is missing or any other value, it's false.
const USE_TEST_PAYLOAD =
  String(import.meta.env.VITE_USE_TEST_PAYLOAD ?? "false")
    .trim()
    .toLowerCase() === "true";

// Deprecated: legacy/new widget UI toggle removed. We'll adjust UI when new widget is ready.

const testPayload: LinkedInLandingData = {
  firstName: "Demo",
  lastName: "User",
  headline: "Software Developer",
  summary: "Experienced developer passionate about technology",
  positions: [
    {
      title: "Senior Developer",
      company: "Tech Corp",
      startDate: "2022-01",
      current: true,
      description: "Building amazing software",
    },
  ],
  skills: ["JavaScript", "React", "Node.js"],
  education: [
    {
      school: "University of Technology",
      degree: "Computer Science",
      graduationYear: "2020",
    },
  ],
};

const Landing = ({ onDataConnect }: LandingProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Determine Vana environment configuration
  const vanaConfig = useMemo(() => {
    const host = typeof window !== "undefined" ? window.location.hostname : "";
    // Vite: import.meta.env.DEV is true only in dev; combine with host checks
    const isDev =
      import.meta.env.DEV ||
      host.startsWith("dev.") ||
      host.includes("localhost");

    return isDev
      ? { origin: "https://dev.app.vana.com", schemaId: 24 }
      : { origin: "https://app.vana.com" };
  }, []);

  const parseJsonWithJSON5 = (data: string): LinkedInLandingData | null => {
    try {
      let cleaned = data.replace(/```(json)?\s*/gi, "").replace(/```/g, "");
      if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned.slice(1, -1);
      }
      cleaned = cleaned.replace(/\\"/g, '"').replace(/\\n/g, "\n");
      return JSON5.parse(cleaned);
    } catch (err) {
      console.error(
        "Invalid JSON after cleaning:",
        err,
        "\nCleaned string was:\n",
        data,
      );
      return null;
    }
  };

  const persistLinkedInData = useCallback(
    (data: LinkedInData) => {
      try {
        sessionStorage.setItem("tarot-linkedin-data", JSON.stringify(data));
      } catch (e) {
        console.error("Failed to persist data", e);
      }
      onDataConnect?.(data);
    },
    [onDataConnect],
  );

  const handleVanaResult = (data: unknown) => {
    try {
      let parsedData: LinkedInLandingData | null = null;
      if (typeof data === "object" && data !== null) {
        parsedData = data as LinkedInLandingData;
      } else if (typeof data === "string") {
        parsedData = parseJsonWithJSON5(data);
      }

      if (parsedData) {
        persistLinkedInData(parsedData as LinkedInData);
        navigate("/reading");
      } else {
        throw new Error("Failed to parse LinkedIn data from Vana widget.");
      }
    } catch (error) {
      console.error("Error processing Vana result:", error);
      toast({
        title: "Connection Failed",
        description: "Could not process your LinkedIn data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Control when the widget appears (always after Accept)
  const [showWidget, setShowWidget] = useState(false);
  const shouldRenderWidget = useMemo(
    () => !USE_TEST_PAYLOAD && showWidget,
    [showWidget],
  );

  const handleAccept = useCallback(() => {
    console.log("handleAccept called");

    try {
      if (USE_TEST_PAYLOAD) {
        persistLinkedInData(testPayload as LinkedInData);
        navigate("/reading");
        return;
      }
      // Production flow: reveal the Vana widget (new design) or no-op if legacy displays immediately
      setShowWidget(true);
    } catch (e) {
      console.error("Failed to persist data", e);
      toast({
        title: "Error",
        description: "Could not prepare your reading.",
        variant: "destructive",
      });
    }
  }, [navigate, toast, persistLinkedInData]);

  return (
    <ScreenWrapper>
      <div
        className={cn(
          "container max-w-2xl min-h-dvh px-4 py-32 relative",
          "flex flex-col justify-start lg:items-center lg:justify-center ",
        )}
      >
        {/* When VanaWidget works as intended, it will show as a dialog above this page, so we will not need to conditionally hide the LandingCard */}
        {!showWidget && <LandingCard handleAccept={handleAccept} />}

        {/* Vana Data Connection */}
        {shouldRenderWidget ? (
          <VanaWidget
            appId="com.lovable.tarot-oracle"
            onResult={handleVanaResult}
            onError={(error) => {
              console.error("Vana Widget Error:", error);
              toast({
                title: "Connection Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
              });
            }}
            onAuth={(wallet) => console.log("User authenticated:", wallet)}
            iframeOrigin={vanaConfig.origin}
            {...(vanaConfig.schemaId && {
              schemaId: vanaConfig.schemaId,
            })}
            prompt={vanaPrompt}
            loadingNode={
              <div
                className="flex items-center justify-center h-full w-full mix-blend-color-dodge"
                aria-live="polite"
              >
                <div className="text-label text-green flex items-center gap-4">
                  <BlockLoader mode={6} />
                  <span>Loading</span>
                </div>
              </div>
            }
            className="max-w-[600px] mx-auto"
          />
        ) : null}
      </div>
    </ScreenWrapper>
  );
};

export default Landing;
