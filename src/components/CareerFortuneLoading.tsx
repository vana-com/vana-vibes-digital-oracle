import { useState, useEffect } from 'react';

interface CareerFortuneLoadingProps {
  linkedinData?: any;
}

const CareerFortuneLoading = ({ linkedinData }: CareerFortuneLoadingProps) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [dots, setDots] = useState('');

  const firstName = linkedinData?.firstName || 'Professional';
  const currentRole = linkedinData?.headline || 'Career Wanderer';
  
  const messages = [
    `Consulting the cosmic LinkedIn overlords about ${firstName}'s destiny...`,
    `Decoding the mystical algorithms of ${firstName}'s professional aura...`,
    `Translating ${firstName}'s skill endorsements into ancient career runes...`,
    `Channeling the spirits of past performance reviews...`,
    `Reading the sacred patterns in ${firstName}'s connection constellation...`,
    `Interpreting the mystical significance of being a "${currentRole}"...`,
    `Consulting the Oracle of Corporate Hierarchies about ${firstName}'s path...`,
    `Analyzing the karmic implications of ${firstName}'s job transitions...`,
    `Divining the future through the sacred art of professional networking...`,
    `Awakening the ancient wisdom of salary negotiations for ${firstName}...`
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 2000);

    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotsInterval);
    };
  }, [messages.length]);

  return (
    <div className="min-h-screen bg-gradient-midnight flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Mystical Loading Animation */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
            {/* Inner pulsing circle */}
            <div className="absolute inset-4 border-2 border-accent/30 rounded-full animate-pulse"></div>
            {/* Center mystical symbol */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl animate-pulse">🔮</div>
            </div>
          </div>
          
          {/* Floating sparkles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{
                top: `${20 + Math.sin(i * 60) * 30}%`,
                left: `${50 + Math.cos(i * 60) * 40}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '2s'
              }}
            >
              ✨
            </div>
          ))}
        </div>

        {/* Dynamic Message */}
        <div className="space-y-4">
          <h2 className="font-amatic text-4xl text-foreground animate-fade-in">
            Reading Your Career Fortune
          </h2>
          
          <div className="relative h-16 flex items-center justify-center">
            <p className="font-amatic text-2xl text-muted-foreground animate-fade-in">
              {messages[currentMessage]}{dots}
            </p>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-primary/30 animate-pulse"
              style={{
                animationDelay: `${i * 0.3}s`,
                animationDuration: '1.5s'
              }}
            ></div>
          ))}
        </div>

        {/* Mystical Disclaimer */}
        <div className="text-sm text-muted-foreground/60 animate-fade-in">
          <p>⚡ Harnessing the power of professional networking magic ⚡</p>
          <p className="mt-2">This may take a moment while we decode your career matrix...</p>
        </div>
      </div>
    </div>
  );
};

export default CareerFortuneLoading;