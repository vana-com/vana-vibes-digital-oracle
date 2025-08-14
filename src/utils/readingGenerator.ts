import { TarotCard } from '@/data/tarotCards';
import { SelectedCard } from '@/utils/cardSelection';
import { supabase } from '@/integrations/supabase/client';

export const generateMysticalReading = async (card: TarotCard, position: 'past' | 'present' | 'future', linkedinData: any): Promise<string> => {
  try {
    console.log('Generating LinkedIn-based reading for card:', card.name, 'position:', position);
    
    const { data, error } = await supabase.functions.invoke('generate-tarot-reading', {
      body: {
        card: {
          name: card.name,
          meaning: card.meaning,
          keywords: card.keywords,
          symbolism: card.symbolism
        },
        position,
        linkedinData
      }
    });

    if (error) {
      console.error('Error calling reading generation function:', error);
      return generateFallbackReading(card, position);
    }

    return data.reading || generateFallbackReading(card, position);
  } catch (error) {
    console.error('Error generating mystical reading:', error);
    return generateFallbackReading(card, position);
  }
};

// Fallback to template-based reading if AI generation fails
const generateFallbackReading = (card: TarotCard, position: 'past' | 'present' | 'future'): string => {
  const phrases = {
    past: [
      "The cosmic threads of your digital past reveal",
      "Ancient wisdom whispers of your foundational journey where",
      "Your digital essence was forged in the fires of"
    ],
    present: [
      "At this crucial crossroads, the veil between worlds grows thin, revealing",
      "The present moment pulses with the energy of",
      "Your current digital consciousness resonates with"
    ],
    future: [
      "The mists of possibility part to reveal",
      "Your emerging potential shimmers with",
      "The cosmic web weaves a destiny touched by"
    ]
  };

  const randomPhrase = phrases[position][Math.floor(Math.random() * phrases[position].length)];
  const cardMeaning = card.meaning.upright.toLowerCase();
  const keywordString = card.keywords.join(', ');
  
  return `${randomPhrase} the power of ${card.name.toLowerCase()}. The mystical energies suggest that ${keywordString} weave through your digital essence, revealing how ${cardMeaning} manifests in your consciousness. Trust in the synchronicity that brought this sacred symbol to light.`;
};

export const generateAllReadings = async (selectedCards: SelectedCard[], linkedinData: any): Promise<string[]> => {
  const positions: ('past' | 'present' | 'future')[] = ['past', 'present', 'future'];
  
  console.log('Generating all LinkedIn-based readings for', selectedCards.length, 'cards');
  
  const readings = await Promise.all(
    selectedCards.map((selectedCard, index) => 
      generateMysticalReading(selectedCard.card, positions[index], linkedinData)
    )
  );
  
  console.log('Generated LinkedIn readings:', readings);
  return readings;
};