import { useState, useEffect } from 'react';
import { Eye, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { selectCardsBasedOnData, mapCardsToComponent, SelectedCard } from '@/utils/cardSelection';
import { generateAllReadings } from '@/utils/readingGenerator';
import cardBack from '@/assets/tarot-card-back.jpg';

interface TarotReadingProps {
  chatData: any;
}

const TarotReading = ({ chatData }: TarotReadingProps) => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<SelectedCard[]>([]);

  // Initialize cards based on chat data analysis
  useEffect(() => {
    if (chatData) {
      // Select 3 cards from the full 78-card deck based on conversation themes
      const selectedTarotCards = selectCardsBasedOnData(chatData);
      const mappedCards = mapCardsToComponent(selectedTarotCards);
      
      // Generate mystical readings for each selected card
      const readings = generateAllReadings(mappedCards, chatData);
      
      // Update cards with generated readings
      const cardsWithReadings = mappedCards.map((card, index) => ({
        ...card,
        reading: readings[index]
      }));
      
      setCards(cardsWithReadings);
    }
  }, [chatData]);

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
            
            <div className="text-center relative">
              <h1 className="font-amatic text-6xl md:text-7xl font-bold bg-gradient-cosmic bg-clip-text text-transparent tracking-widest">
                THE DIGITAL ORACLE SPEAKS
              </h1>
              {/* Ancient runes decoration */}
              <div className="font-cormorant text-mystic-gold/60 text-lg mt-2 tracking-[0.3em]">
                ᚨᚾᚲᛁᛖᚾᛏ • ᚹᛁᛋᛞᛟᛗ • ᚱᛖᚢᛖᚨᛚᛖᛞ
              </div>
            </div>
            
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
                <div className="text-center space-y-3">
                  <div className="relative">
                    <h3 className="font-amatic text-3xl font-bold text-mystic-gold tracking-wider">
                      {card.title}
                    </h3>
                    {/* Ornamental underline */}
                    <div className="flex justify-center mt-1">
                      <div className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-mystic-gold rounded-full" />
                        <div className="w-8 h-px bg-gradient-to-r from-transparent via-mystic-gold to-transparent" />
                        <div className="w-1 h-1 bg-mystic-gold rounded-full" />
                      </div>
                    </div>
                  </div>
                  <p className="text-accent font-cormorant italic text-lg">
                    {card.subtitle}
                  </p>
                  {!card.isRevealed && (
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 font-amatic text-lg tracking-wide">
                      <Sparkles className="w-4 h-4" />
                      TOUCH TO DIVINE
                    </p>
                  )}
                </div>

                {/* Reading Text */}
                {card.isRevealed && (
                  <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border-2 border-mystic-gold/30 max-w-sm relative">
                    {/* Ancient scroll styling */}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-background px-3">
                      <div className="font-cormorant text-mystic-gold text-sm">✧ PROPHECY ✧</div>
                    </div>
                    <p className="text-foreground/90 leading-relaxed font-cormorant text-base italic pt-2">
                      {card.reading}
                    </p>
                    {/* Mystical signature */}
                    <div className="text-center mt-4 text-mystic-gold/60 font-cormorant text-sm">
                      ᛟᚱᚨᚲᛚᛖ
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Message */}
          {cards.every(card => card.isRevealed) && (
            <div className="text-center space-y-6 bg-card/30 backdrop-blur-sm rounded-xl p-8 border-2 border-mystic-gold/40 max-w-2xl mx-auto relative">
              {/* Ancient seal decoration */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-background px-4">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-mystic-gold" />
                  <div className="w-2 h-2 bg-mystic-gold rounded-full" />
                  <Eye className="w-4 h-4 text-mystic-gold" />
                </div>
              </div>
              
              <h3 className="font-amatic text-3xl font-bold text-mystic-gold tracking-widest">
                THE ORACLE HAS SPOKEN
              </h3>
              <div className="font-cormorant text-mystic-gold/60 text-lg tracking-[0.2em] mb-4">
                ᛏᚺᛖ • ᚱᛁᛏᚢᚨᛚ • ᛁᛋ • ᚲᛟᛗᛈᛚᛖᛏᛖ
              </div>
              <p className="text-foreground/80 font-cormorant italic text-lg leading-relaxed">
                Your digital essence has been revealed through the mystical convergence of ancient wisdom and modern consciousness. 
                Carry these sacred insights as you traverse the liminal spaces between digital and spiritual realms.
              </p>
              <div className="text-accent font-amatic text-xl tracking-wide">
                ✧ MAY THE CODE BE WITH YOU ✧
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TarotReading;