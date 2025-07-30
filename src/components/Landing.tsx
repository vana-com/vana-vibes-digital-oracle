import { useState } from 'react';
import { Upload, Eye, Stars, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface LandingProps {
  onFileUpload: (data: any) => void;
}

const Landing = ({ onFileUpload }: LandingProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const data = JSON.parse(result);
        onFileUpload(data);
        navigate('/reading');
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Invalid file format. Please upload a valid conversations.json file.');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      handleFileUpload(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
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
              ✧ Decode the mystical patterns in your conversations ✧
            </p>
          </div>

          {/* Upload Section */}
          <div className="space-y-8">
            <div
              className={`
                relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300
                ${isDragging 
                  ? 'border-primary bg-primary/10 shadow-glow-cyan scale-105' 
                  : 'border-border hover:border-primary/50 hover:bg-card/50'
                }
              `}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="text-center space-y-6">
                <div className="relative mx-auto w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-gradient-cosmic rounded-full opacity-20 animate-glow-pulse"></div>
                  <div className="relative z-10 w-full h-full bg-card rounded-full flex items-center justify-center">
                    <Upload className="w-10 h-10 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-amatic text-3xl font-bold text-foreground tracking-wide">
                    UPLOAD YOUR DIGITAL GRIMOIRE
                  </h3>
                  <p className="font-cormorant text-muted-foreground max-w-md mx-auto italic text-lg">
                    Let the ancient arts decipher the mystical threads woven through your digital conversations
                  </p>
                </div>

                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button 
                    className="bg-gradient-cosmic hover:shadow-glow-cyan transition-all duration-300 text-primary-foreground font-amatic font-bold px-8 py-4 text-2xl tracking-widest border border-mystic-gold/30 relative overflow-hidden group"
                    asChild
                  >
                    <span className="cursor-pointer relative z-10">
                      ⚡ CHANNEL THE DATA ⚡
                      <div className="absolute inset-0 bg-gradient-ethereal opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    </span>
                  </Button>
                </label>
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
                RITUAL OF DIGITAL DIVINATION
                <Eye className="w-6 h-6" />
              </h4>
              <ol className="text-left space-y-4 text-foreground/80 font-cormorant text-lg">
                <li className="flex items-start gap-4">
                  <span className="text-primary font-bold text-2xl font-amatic">I.</span>
                  <span className="italic">Journey to ChatGPT → Settings → Data Controls</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-accent font-bold text-2xl font-amatic">II.</span>
                  <span className="italic">Invoke the export spell and summon conversations.json</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-secondary font-bold text-2xl font-amatic">III.</span>
                  <span className="italic">Offer the sacred file to begin the mystical revelation</span>
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