import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useState } from "react";
import { ScreenWrapper } from "./ScreenWrapper";
import ScrambleText from "./ScrambleText";
import { cn } from "@/lib/utils";
import { BlinkButton } from "./BlinkButton";
import JSON5 from "json5";
import { useMemo } from "react";
import { VanaWidget } from "./VanaWidget";

// Define a type for the LinkedIn data
interface Position {
  title: string;
  company: string;
  startDate: string;
  current?: boolean;
  endDate?: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  graduationYear: string;
}

interface LinkedInData {
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  positions: Position[];
  skills: string[];
  education: Education[];
}

interface LandingProps {
  onDataConnect?: (data: LinkedInData) => void;
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

const Landing = ({ onDataConnect }: LandingProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Determine Vana environment configuration
  const vanaConfig = useMemo(() => {
    const host = typeof window !== "undefined" ? window.location.hostname : "";
    const isDev =
      host.startsWith("dev.") ||
      host.includes("localhost") ||
      host.includes("vercel.app");

    return isDev
      ? { origin: "https://dev.app.vana.com", schemaId: 24 }
      : { origin: "https://app.vana.com" };
  }, []);

  const parseJsonWithJSON5 = (data: string): LinkedInData | null => {
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

  const handleVanaResult = (data: unknown) => {
    try {
      let parsedData: LinkedInData | null = null;
      if (typeof data === "object" && data !== null) {
        parsedData = data as LinkedInData;
      } else if (typeof data === "string") {
        parsedData = parseJsonWithJSON5(data);
      }

      if (parsedData) {
        onDataConnect(parsedData);
        toast({
          title: "Connected Successfully!",
          description: "Your professional journey awaits divination...",
        });
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

  // Reveal CTA after both scrambles complete
  const [titleDone, setTitleDone] = useState(false);
  const [subtitleDone, setSubtitleDone] = useState(false);
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);
  const bothDone =
    titleDone && subtitleDone && step1Done && step2Done && step3Done;

  const handleAccept = useCallback(
    (e: React.MouseEvent) => {
      console.log("handleAccept called");
      e.preventDefault();
      e.stopPropagation();

      try {
        // Simple test payload for development
        const payload = {
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

        console.log("Passing data directly through router state");
        // Pass data directly through router state instead of sessionStorage
        navigate("/reading", { state: { linkedinData: payload } });
      } catch (e) {
        console.error("Failed to persist data", e);
        toast({
          title: "Error",
          description: "Could not prepare your reading.",
          variant: "destructive",
        });
      }
    },
    [navigate, toast],
  );

  return (
    <ScreenWrapper>
      <div className="container min-h-dvh px-4 py-32 flex flex-col justify-start lg:items-center lg:justify-center max-w-2xl relative">
        <div className="border-2 border-green lg:w-3/4 min-h-[50vh] grid grid-rows-[auto_auto_1fr] bg-green/0 mix-blend-color-dodge">
          <div className="p-2 lg:p-4">
            <ScrambleText
              as="h1"
              className="text-title text-green"
              text="Digital Oracle"
              delayMs={1000}
              speed={0.25}
              scramble={2}
              chance={0.8}
              step={1}
              overdrive
              onDone={() => setTitleDone(true)}
            />
          </div>
          <div className="p-2 lg:p-4">
            <ScrambleText
              as="h2"
              className="text-subheading text-green"
              text="Decode the mystical patterns in your career."
              delayMs={1500}
              speed={0.25}
              scramble={1}
              chance={0.8}
              step={1}
              overdrive
              onDone={() => setSubtitleDone(true)}
            />
          </div>
          <div className="p-2 lg:p-4">
            <ScrambleText
              as="div"
              className="text-label font-display text-green"
              text="→→ Grant access to your LinkedIn aura"
              delayMs={1750}
              speed={0.5}
              scramble={1}
              chance={0.8}
              step={2}
              overdrive
              onDone={() => setStep1Done(true)}
            />
            <ScrambleText
              as="div"
              className="text-label font-display text-green"
              text="→→ Allow the oracle to channel your career essence"
              delayMs={2000}
              speed={0.5}
              scramble={1}
              chance={0.8}
              step={2}
              overdrive
              onDone={() => setStep2Done(true)}
            />
            <ScrambleText
              as="div"
              className="text-label font-display text-green"
              text="→→ Witness the revelation of your professional destiny"
              delayMs={2250}
              speed={0.5}
              scramble={1}
              chance={0.8}
              step={2}
              overdrive
              onDone={() => setStep3Done(true)}
            />
          </div>
          <div
            className={cn(
              "mt-auto",
              "p-2 lg:p-4 min-h-[28px] flex justify-en",
              bothDone && "border-t-2 border-green",
            )}
          >
            {bothDone ? (
              <BlinkButton
                onClick={handleAccept}
                className="justify-end text-green"
              >
                Accept
              </BlinkButton>
            ) : null}
          </div>
        </div>

        {/* Connection Section */}
        {/* <VanaWidget
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
        /> */}
      </div>
    </ScreenWrapper>
  );
};

export default Landing;
