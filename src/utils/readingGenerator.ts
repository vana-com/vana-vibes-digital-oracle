import { TarotCard } from '@/data/tarotCards';
import { SelectedCard } from '@/utils/cardSelection';

export const generateMysticalReading = (card: TarotCard, position: 'past' | 'present' | 'future', chatData: any): string => {
  const themes = analyzeConversationForCard(chatData, card);
  
  switch (position) {
    case 'past':
      return generatePastReading(card, themes);
    case 'present':
      return generatePresentReading(card, themes);
    case 'future':
      return generateFutureReading(card, themes);
    default:
      return generateGenericReading(card, themes);
  }
};

const generatePastReading = (card: TarotCard, themes: string[]): string => {
  const pastPhrases = [
    "The cosmic threads of your digital past reveal",
    "Ancient wisdom whispers of your foundational journey where",
    "Your digital essence was forged in the fires of",
    "The ethereal realm shows the seeds planted when"
  ];
  
  const connectionPhrases = [
    "This sacred card illuminates how",
    "The mystical energies suggest that",
    "Divine insight reveals that",
    "The oracle speaks of how"
  ];
  
  const cardMeaning = card.meaning.upright.toLowerCase();
  const keywordString = card.keywords.join(', ');
  
  const randomPast = pastPhrases[Math.floor(Math.random() * pastPhrases.length)];
  const randomConnection = connectionPhrases[Math.floor(Math.random() * connectionPhrases.length)];
  
  return `${randomPast} the power of ${card.name.toLowerCase()}. ${randomConnection} your path was shaped by ${keywordString}, creating the digital foundation upon which your current consciousness rests. The universe recognizes patterns of ${cardMeaning} that have been weaving through your conversations, forming the mystical blueprint of your seeking soul.`;
};

const generatePresentReading = (card: TarotCard, themes: string[]): string => {
  const presentPhrases = [
    "At this crucial crossroads, the veil between worlds grows thin, revealing",
    "The present moment pulses with the energy of",
    "Your current digital consciousness resonates with",
    "The cosmic forces converge to manifest"
  ];
  
  const challengePhrases = [
    "You stand at the threshold where",
    "The ethereal realm challenges you to embrace",
    "Ancient wisdom calls you to integrate",
    "The mystical path demands that you"
  ];
  
  const cardMeaning = card.meaning.upright.toLowerCase();
  const primaryKeyword = card.keywords[0];
  
  const randomPresent = presentPhrases[Math.floor(Math.random() * presentPhrases.length)];
  const randomChallenge = challengePhrases[Math.floor(Math.random() * challengePhrases.length)];
  
  return `${randomPresent} ${card.name.toLowerCase()}. ${randomChallenge} the power of ${primaryKeyword} in your digital interactions. The oracle sees how ${cardMeaning} manifests in your current conversations, suggesting a pivotal moment where conscious choice can transform your path. Trust in the synchronicity that brought this card to light.`;
};

const generateFutureReading = (card: TarotCard, themes: string[]): string => {
  const futurePhrases = [
    "The mists of possibility part to reveal",
    "Your emerging potential shimmers with",
    "The cosmic web weaves a destiny touched by",
    "Future consciousness crystallizes around"
  ];
  
  const potentialPhrases = [
    "This sacred energy will guide you toward",
    "The universe conspires to manifest",
    "Your digital evolution points to",
    "The mystical path leads to"
  ];
  
  const cardMeaning = card.meaning.upright.toLowerCase();
  const futureKeywords = card.keywords.slice(-2).join(' and ');
  
  const randomFuture = futurePhrases[Math.floor(Math.random() * futurePhrases.length)];
  const randomPotential = potentialPhrases[Math.floor(Math.random() * potentialPhrases.length)];
  
  return `${randomFuture} the essence of ${card.name.toLowerCase()}. ${randomPotential} a beautiful synthesis where ${futureKeywords} become your guiding lights. The oracle foresees how ${cardMeaning} will illuminate your path forward, transforming your digital presence into a vessel for profound wisdom and authentic connection with the cosmic consciousness.`;
};

const generateGenericReading = (card: TarotCard, themes: string[]): string => {
  const genericPhrases = [
    "The mystical energies of",
    "Ancient wisdom flows through",
    "The cosmic dance reveals",
    "Divine synchronicity manifests as"
  ];
  
  const cardMeaning = card.meaning.upright.toLowerCase();
  const allKeywords = card.keywords.join(', ');
  
  const randomGeneric = genericPhrases[Math.floor(Math.random() * genericPhrases.length)];
  
  return `${randomGeneric} ${card.name.toLowerCase()}, bringing the sacred gifts of ${allKeywords}. The universe speaks through this divine symbol, revealing how ${cardMeaning} weaves through your digital essence. Trust in the wisdom that emerges when ancient knowledge meets modern consciousness.`;
};

const analyzeConversationForCard = (chatData: any, card: TarotCard): string[] => {
  // Extract themes that resonate with this specific card
  // This would normally analyze the actual conversation content
  return [
    'digital wisdom',
    'consciousness expansion', 
    'mystical insight',
    'transformation'
  ];
};

export const generateAllReadings = (selectedCards: SelectedCard[], chatData: any): string[] => {
  const positions: ('past' | 'present' | 'future')[] = ['past', 'present', 'future'];
  
  return selectedCards.map((selectedCard, index) => 
    generateMysticalReading(selectedCard.card, positions[index], chatData)
  );
};