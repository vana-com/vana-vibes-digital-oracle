import { useNavigate } from 'react-router-dom';
import { LinkedinIcon, Eye, Stars, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VanaWidget from './VanaWidget';
import JSON5 from 'json5';

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
  onDataConnect: (data: LinkedInData) => void;
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

  const parseJsonWithJSON5 = (data: string): LinkedInData | null => {
    try {
      let cleaned = data.replace(/```(json)?\s*/gi, '').replace(/```/g, '');
      if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned.slice(1, -1);
      }
      cleaned = cleaned.replace(/\\"/g, '"').replace(/\\n/g, '\n');
      return JSON5.parse(cleaned);
    } catch (err) {
      console.error("Invalid JSON after cleaning:", err, "\nCleaned string was:\n", data);
      return null;
    }
  }

  const handleVanaResult = (data: unknown) => {
    try {
      let parsedData: LinkedInData | null = null;
      if (typeof data === 'object' && data !== null) {
        parsedData = data as LinkedInData;
      } else if (typeof data === 'string') {
        parsedData = parseJsonWithJSON5(data);
      }

      if (parsedData) {
        onDataConnect(parsedData);
        toast({
          title: "Connected Successfully!",
          description: "Your professional journey awaits divination...",
        });
        navigate('/reading');
      } else {
        throw new Error("Failed to parse LinkedIn data from Vana widget.");
      }
    } catch (error) {
      console.error('Error processing Vana result:', error);
      toast({
        title: "Connection Failed",
        description: "Could not process your LinkedIn data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-midnight relative overflow-hidden">
      {/* Floating mystical elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Traditional witchy symbols with tech twist */}
        <div className="absolute top-20 left-20 animate-float opacity-30">
          <div className="relative">
            <Eye className="w-8 h-8 text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
          </div>
        </div>
        <div className="absolute top-40 right-32 animate-float delay-100 opacity-40">
          <div className="relative">
            <Stars className="w-6 h-6 text-accent" />
            <div className="absolute inset-0 border border-primary/30 rounded-full scale-150" />
          </div>
        </div>
        <div className="absolute bottom-32 left-32 animate-float delay-200 opacity-35">
          <div className="hexagon-container relative">
            <Sparkles className="w-7 h-7 text-secondary" />
            <div className="absolute inset-0 border border-mystic-gold/40 transform rotate-45" />
          </div>
        </div>
        <div className="absolute top-60 right-20 animate-float delay-300 opacity-30">
          <div className="triangle-glow relative">
            <Eye className="w-5 h-5 text-mystic-gold" />
            <div className="absolute -inset-2 border border-primary/20 rounded-full" />
          </div>
        </div>
        {/* Ancient runes with digital glow */}
        <div className="absolute bottom-20 right-40 opacity-20 font-cormorant text-2xl text-accent animate-glow-pulse">
          ᚱᚢᚾᛖᛋ
        </div>
        <div className="absolute top-32 left-1/2 opacity-15 font-cormorant text-xl text-primary animate-float delay-500">
          ᛗᚤᛋᛏᛁᚲ
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="max-w-2xl mx-auto text-center space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <div className="relative">
              {/* Ancient meets digital title */}
              <div className="relative mb-6">
                <h1 className="font-amatic text-7xl md:text-8xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-2 tracking-wider">
                  DIGITAL ORACLE
                </h1>
                {/* Traditional ornamental border with circuit patterns */}
                <div className="absolute -inset-4 border-2 border-mystic-gold/30 rounded-lg transform rotate-1">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <div className="w-1 h-1 bg-accent rounded-full" />
                      <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-100" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 animate-glow-pulse">
                <div className="relative">
                  <Eye className="w-10 h-10 text-primary opacity-50" />
                  {/* Circuit lines emanating from eye */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-px bg-gradient-to-r from-primary/40 to-transparent absolute -right-8 top-0" />
                    <div className="w-12 h-px bg-gradient-to-l from-accent/40 to-transparent absolute -left-6 top-0" />
                  </div>
                </div>
              </div>
            </div>
            <p className="font-cormorant text-2xl md:text-3xl text-foreground/80 leading-relaxed italic">
              Where ancient wisdom meets digital consciousness
            </p>
            <p className="text-accent text-lg font-medium font-amatic text-xl tracking-wide">
              ✧ Decode the mystical patterns in your career ✧
            </p>
          </div>

          {/* Connection Section */}
          <div className="space-y-8">
            <div className="relative border-2 border-dashed rounded-2xl p-8 sm:p-12 transition-all duration-300 border-border bg-card/50">
              <div className="text-center space-y-6">
                <div className="relative mx-auto w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-gradient-cosmic rounded-full opacity-20 animate-glow-pulse"></div>
                  <div className="relative z-10 w-full h-full bg-card rounded-full flex items-center justify-center">
                    <LinkedinIcon className="w-10 h-10 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-amatic text-3xl font-bold text-foreground tracking-wide">
                    CONNECT YOUR PROFESSIONAL ESSENCE
                  </h3>
                  <p className="font-cormorant text-muted-foreground max-w-md mx-auto italic text-lg">
                    Channel the mystical energy of your LinkedIn profile to reveal hidden career insights
                  </p>
                </div>

                <VanaWidget
                  onError={(error) => {
                    console.error("Vana Widget Error:", error);
                    toast({
                      title: "Connection Error",
                      description: "Something went wrong. Please try again.",
                      variant: "destructive",
                    });
                  }}
                  onAuth={(wallet) => console.log("User authenticated:", wallet)}
                  onResult={handleVanaResult}
                  prompt={vanaPrompt}
                  appId="com.lovable.tarot-oracle"
                  schemaId={3}
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border-2 border-mystic-gold/30 relative">
              {/* Ancient scroll ornaments */}
              <div className="absolute -top-2 left-4 bg-background px-2">
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-mystic-gold rounded-full" />
                  <div className="w-2 h-px bg-mystic-gold" />
                  <div className="w-1 h-1 bg-mystic-gold rounded-full" />
                </div>
              </div>
              <div className="absolute -bottom-2 right-4 bg-background px-2">
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-mystic-gold rounded-full" />
                  <div className="w-2 h-px bg-mystic-gold" />
                  <div className="w-1 h-1 bg-mystic-gold rounded-full" />
                </div>
              </div>
              
              <h4 className="font-amatic text-2xl font-bold text-mystic-gold mb-4 flex items-center justify-center gap-2 tracking-wide">
                <Eye className="w-6 h-6" />
                RITUAL OF PROFESSIONAL DIVINATION
                <Eye className="w-6 h-6" />
              </h4>
              <ol className="text-left space-y-4 text-foreground/80 font-cormorant text-lg">
                <li className="flex items-start gap-4">
                  <span className="text-primary font-bold text-2xl font-amatic">I.</span>
                  <span className="italic">Grant access to your LinkedIn professional aura</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-accent font-bold text-2xl font-amatic">II.</span>
                  <span className="italic">Allow the oracle to channel your career essence</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-secondary font-bold text-2xl font-amatic">III.</span>
                  <span className="italic">Witness the mystical revelation of your professional destiny</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;