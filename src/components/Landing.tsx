import { useToast } from "@/hooks/use-toast";
import { LinkedInData } from "@/lib/linkedin-data.type";
import { cn } from "@/lib/utils";
import { VanaAppUploadWidget } from "@opendatalabs/vana-react";
import JSON5 from "json5";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LandingCard } from "./LandingCard";
import { ScreenWrapper } from "./ScreenWrapper";

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

// You don't need to supply this, but you can also use it to test
const VANA_IFRAME_ORIGIN = "https://app.vana.com";
const VANA_SCHEMA_ID = 24;

const vanaPrompt = `You are an AI assistant that extracts and structures LinkedIn profile data.

STEP 1: ANALYZE THE DATA
Carefully examine the provided LinkedIn data and extract the following fields:
- firstName
- lastName
- headline
- summary
- positions (including title, company, startDate, endDate, current status, description)
  IMPORTANT: All dates MUST be in YYYY-MM format (e.g., "2024-11" for November 2024)
- skills (important to include all skills)
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

  const parseJsonWithJSON5 = (data: string): LinkedInLandingData | null => {
    // Robustly handle: code-fenced JSON, raw JSON text, JSON string containing JSON, and JSON5.
    // Avoid manual unescaping which can corrupt strings with embedded quotes.
    const stripCodeFences = (s: string) =>
      s
        .trim()
        .replace(/^\s*```(?:json5?|json)?\s*\n?/i, "")
        .replace(/\n?\s*```\s*$/i, "");

    try {
      const s = stripCodeFences(data);

      // 1) Try strict JSON first
      try {
        const topLevel = JSON.parse(s);
        if (typeof topLevel === "string") {
          // Double-encoded: JSON string that contains JSON
          const inner = stripCodeFences(topLevel);
          try {
            return JSON.parse(inner) as LinkedInLandingData;
          } catch {}
          try {
            return JSON5.parse(inner) as LinkedInLandingData;
          } catch {}
        } else if (typeof topLevel === "object" && topLevel !== null) {
          return topLevel as LinkedInLandingData;
        }
      } catch {}

      // 2) If not valid JSON at the top level, attempt to extract the object substring
      const firstBrace = s.indexOf("{");
      const lastBrace = s.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const objStr = s.slice(firstBrace, lastBrace + 1);
        try {
          return JSON.parse(objStr) as LinkedInLandingData;
        } catch {}
        try {
          return JSON5.parse(objStr) as LinkedInLandingData;
        } catch {}
      }

      // 3) Final fallback: try JSON5 on the whole string
      return JSON5.parse(s) as LinkedInLandingData;
    } catch (err) {
      console.error(
        "Invalid JSON after cleaning:",
        err,
        "\nRaw string was:\n",
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
        <LandingCard handleAccept={handleAccept} />

        {/* Only shown on is open, but otherwise available in the DOM and doing fetch work behind the scenes. */}
        <VanaAppUploadWidget
          appId="com.lovable.tarot-oracle"
          iframeOrigin={VANA_IFRAME_ORIGIN}
          schemaId={VANA_SCHEMA_ID}
          operation="llm_inference"
          operationParams={{ prompt: vanaPrompt }}
          isOpen={showWidget}
          onAuth={(wallet) => console.log("User authenticated:", wallet)}
          onResult={handleVanaResult}
          onError={(error) => {
            console.error("Vana Widget Error:", error);
            toast({
              title: "Connection Error",
              description: "Something went wrong. Please try again.",
              variant: "destructive",
            });
          }}
          onClose={() => {
            setShowWidget(false);
          }}
        />
      </div>
    </ScreenWrapper>
  );
};

export default Landing;
