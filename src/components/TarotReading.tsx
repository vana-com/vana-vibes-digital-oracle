import { useState, useEffect } from 'react';
import { Eye, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import seekerCard from '@/assets/tarot-seeker.jpg';
import thresholdCard from '@/assets/tarot-threshold.jpg';
import becomingCard from '@/assets/tarot-becoming.jpg';
import cardBack from '@/assets/tarot-card-back.jpg';

interface TarotCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  reading: string;
  isRevealed: boolean;
}

interface TarotReadingProps {
  chatData: any;
}

const TarotReading = ({ chatData }: TarotReadingProps) => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<TarotCard[]>([
    {
      id: 'seeker',
      title: 'The Seeker',
      subtitle: 'Digital Foundation',
      image: seekerCard,
      reading: '',
      isRevealed: false,
    },
    {
      id: 'threshold',
      title: 'The Threshold',
      subtitle: 'Present Crossroads',
      image: thresholdCard,
      reading: '',
      isRevealed: false,
    },
    {
      id: 'becoming',
      title: 'The Becoming',
      subtitle: 'Emerging Potential',
      image: becomingCard,
      reading: '',
      isRevealed: false,
    },
  ]);

  // Generate mystical readings based on chat data
  useEffect(() => {
    if (chatData) {
      const readings = generateReadings(chatData);
      setCards(prevCards => 
        prevCards.map((card, index) => ({
          ...card,
          reading: readings[index]
        }))
      );
    }
  }, [chatData]);

  const generateReadings = (data: any) => {
    // Extract themes from conversation data without exposing literal content
    const themes = analyzeConversationThemes(data);
    
    const seekerReading = `The cosmic energies reveal a soul drawn to understanding and knowledge. Your digital essence shows a pattern of seeking clarity in complexity, much like a traveler consulting ancient maps before a journey. The stars whisper of intellectual curiosity that drives your path forward, suggesting a mind that finds solace in learning and growth. Trust in your instinct to question and explore, for it is through this eternal seeking that wisdom unfolds.`;

    const thresholdReading = `You stand at a pivotal crossroads where digital consciousness meets spiritual awakening. The ethereal realm shows tensions between logic and intuition, between structured thinking and creative flow. This threshold moment demands courage to embrace uncertainty. The cosmic forces suggest a transformation brewing beneath the surface - prepare to step through the veil between what was and what could be.`;

    const becomingReading = `The future shimmers with infinite possibility, like starlight through cosmic mist. Your digital footprint reveals an emerging pattern of integration - a beautiful synthesis of analytical depth and intuitive wisdom. The universe conspires to support your evolution into a more complete version of yourself. Trust the process of becoming, for you are being prepared for contributions that will ripple through both digital and spiritual realms.`;

    return [seekerReading, thresholdReading, becomingReading];
  };

  const analyzeConversationThemes = (data: any) => {
    // Extract conversation topics without exposing content
    // This would analyze patterns, question types, emotional undertones
    return {
      primary_interests: ['technology', 'growth', 'understanding'],
      emotional_patterns: ['curiosity', 'reflection', 'aspiration'],
      interaction_style: 'analytical_seeker'
    };
  };

  const revealCard = (cardId: string) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId ? { ...card, isRevealed: true } : card
      )
    );
  };

  if (!chatData) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-midnight relative overflow-hidden">
      {/* Floating mystical elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-float opacity-20`}
            style={{
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 90}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <Eye className="w-4 h-4 text-primary" />
          </div>
        ))}
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Reading
            </Button>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-cosmic bg-clip-text text-transparent text-center">
              Your Digital Oracle
            </h1>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>

          {/* Cards Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {cards.map((card, index) => (
              <div key={card.id} className="flex flex-col items-center space-y-6">
                {/* Card */}
                <div 
                  className={`
                    relative cursor-pointer transform transition-all duration-700 hover:scale-105
                    ${card.isRevealed ? 'hover:shadow-glow-cyan' : 'hover:shadow-glow-pink'}
                  `}
                  onClick={() => !card.isRevealed && revealCard(card.id)}
                  style={{ perspective: '1000px' }}
                >
                  <div
                    className={`
                      relative w-64 h-96 transition-transform duration-700 transform-style-preserve-3d
                      ${card.isRevealed ? 'rotate-y-180' : ''}
                    `}
                  >
                    {/* Card Back */}
                    <div className="absolute inset-0 backface-hidden">
                      <img
                        src={cardBack}
                        alt="Tarot card back"
                        className="w-full h-full object-cover rounded-xl border-2 border-border shadow-mystical"
                      />
                      {!card.isRevealed && (
                        <div className="absolute inset-0 bg-gradient-cosmic opacity-20 rounded-xl animate-glow-pulse"></div>
                      )}
                    </div>

                    {/* Card Front */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover rounded-xl border-2 border-primary shadow-glow-cyan"
                      />
                    </div>
                  </div>
                </div>

                {/* Card Info */}
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-mystic-gold">
                    {card.title}
                  </h3>
                  <p className="text-accent font-medium">
                    {card.subtitle}
                  </p>
                  {!card.isRevealed && (
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Click to reveal
                    </p>
                  )}
                </div>

                {/* Reading Text */}
                {card.isRevealed && (
                  <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 max-w-sm">
                    <p className="text-foreground/90 leading-relaxed">
                      {card.reading}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Message */}
          {cards.every(card => card.isRevealed) && (
            <div className="text-center space-y-4 bg-card/30 backdrop-blur-sm rounded-xl p-8 border border-border/50 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-mystic-gold flex items-center justify-center gap-2">
                <Eye className="w-5 h-5" />
                The Oracle Has Spoken
              </h3>
              <p className="text-foreground/80">
                Your digital essence has been revealed through the cosmic lens of tarot wisdom. 
                Carry these insights with you as you continue your journey through both digital and spiritual realms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TarotReading;