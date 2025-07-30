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
        <div className="absolute top-20 left-20 animate-float opacity-30">
          <Eye className="w-8 h-8 text-primary" />
        </div>
        <div className="absolute top-40 right-32 animate-float delay-100 opacity-40">
          <Stars className="w-6 h-6 text-accent" />
        </div>
        <div className="absolute bottom-32 left-32 animate-float delay-200 opacity-35">
          <Sparkles className="w-7 h-7 text-secondary" />
        </div>
        <div className="absolute top-60 right-20 animate-float delay-300 opacity-30">
          <Eye className="w-5 h-5 text-mystic-gold" />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="max-w-2xl mx-auto text-center space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <div className="relative">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
                Digital Oracle
              </h1>
              <div className="absolute -top-4 -right-4 animate-glow-pulse">
                <Eye className="w-10 h-10 text-primary opacity-50" />
              </div>
            </div>
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed">
              Your digital footprint holds cosmic wisdom
            </p>
            <p className="text-accent text-lg font-medium">
              Unlock the secrets hidden in your conversations
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
                  <h3 className="text-2xl font-semibold text-foreground">
                    Upload Your Digital Destiny
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Connect your ChatGPT conversations to reveal the hidden patterns of your digital soul
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
                    className="bg-gradient-cosmic hover:shadow-glow-cyan transition-all duration-300 text-primary-foreground font-semibold px-8 py-3 text-lg"
                    asChild
                  >
                    <span className="cursor-pointer">Choose Your Destiny File</span>
                  </Button>
                </label>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border border-border/50">
              <h4 className="text-lg font-semibold text-mystic-gold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Cosmic Connection Instructions
              </h4>
              <ol className="text-left space-y-3 text-foreground/80">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">1.</span>
                  Go to ChatGPT → Settings → Data Controls
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">2.</span>
                  Export your data and download conversations.json
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary font-bold">3.</span>
                  Upload the file here to begin your reading
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