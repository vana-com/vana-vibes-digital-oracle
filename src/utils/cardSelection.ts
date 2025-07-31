import { TarotCard, allTarotCards, majorArcana, minorArcana } from '@/data/tarotCards';

export interface SelectedCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  reading: string;
  isRevealed: boolean;
  card: TarotCard;
}

// Analyze chat data to determine user's themes and select appropriate cards
export const selectCardsBasedOnData = (chatData: any): TarotCard[] => {
  const themes = analyzeConversationThemes(chatData);
  
  // Select cards based on themes with weighted probability
  const selectedCards: TarotCard[] = [];
  const usedCardIds = new Set<string>(); // Track used cards to avoid duplicates
  
  // Past/Foundation card - from Major Arcana
  const pastCard = selectUniqueCardByTheme(themes.past_themes, majorArcana, usedCardIds);
  selectedCards.push(pastCard);
  usedCardIds.add(pastCard.id);
  
  // Present/Challenge card - from Major Arcana
  const presentCard = selectUniqueCardByTheme(themes.present_themes, majorArcana, usedCardIds);
  selectedCards.push(presentCard);
  usedCardIds.add(presentCard.id);
  
  // Future/Potential card - from Major Arcana
  const futureCard = selectUniqueCardByTheme(themes.future_themes, majorArcana, usedCardIds);
  selectedCards.push(futureCard);
  usedCardIds.add(futureCard.id);
  
  return selectedCards;
};

const selectUniqueCardByTheme = (themes: string[], cardPool: TarotCard[], usedCardIds: Set<string>): TarotCard => {
  // Filter out already used cards
  const availableCards = cardPool.filter(card => !usedCardIds.has(card.id));
  
  // If no cards available, return a random card from the pool
  if (availableCards.length === 0) {
    return cardPool[Math.floor(Math.random() * cardPool.length)];
  }
  
  // Create weighted pool based on theme relevance
  const weightedCards = availableCards.map(card => ({
    card,
    weight: calculateCardRelevance(card, themes)
  }));
  
  // Sort by relevance and add some randomness
  weightedCards.sort((a, b) => b.weight - a.weight);
  
  // Select from top 10 most relevant cards to maintain some randomness
  const topCandidates = weightedCards.slice(0, Math.min(10, weightedCards.length));
  const randomIndex = Math.floor(Math.random() * topCandidates.length);
  
  return topCandidates[randomIndex].card;
};

const calculateCardRelevance = (card: TarotCard, themes: string[]): number => {
  let relevance = Math.random() * 0.3; // Base randomness
  
  // Check keyword matches
  themes.forEach(theme => {
    card.keywords.forEach(keyword => {
      if (keyword.includes(theme.toLowerCase()) || theme.toLowerCase().includes(keyword)) {
        relevance += 0.4;
      }
    });
    
    // Check meaning matches
    if (card.meaning.upright.toLowerCase().includes(theme.toLowerCase()) ||
        card.meaning.reversed.toLowerCase().includes(theme.toLowerCase())) {
      relevance += 0.3;
    }
  });
  
  return relevance;
};

const analyzeConversationThemes = (data: any) => {
  // This would normally analyze the actual conversation content
  // For now, return realistic themes that would come from ChatGPT conversations
  const commonThemes = {
    past_themes: ['learning', 'curiosity', 'exploration', 'foundation'],
    present_themes: ['growth', 'challenges', 'decisions', 'transformation'],
    future_themes: ['potential', 'success', 'accomplishment', 'integration']
  };
  
  // Add some randomness to make each reading unique
  const additionalThemes = [
    'creativity', 'relationships', 'career', 'spirituality', 
    'communication', 'wisdom', 'change', 'balance'
  ];
  
  // Randomly add 1-2 additional themes to each category
  Object.keys(commonThemes).forEach(key => {
    const randomThemes = additionalThemes
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 2) + 1);
    commonThemes[key as keyof typeof commonThemes].push(...randomThemes);
  });
  
  return commonThemes;
};

// Map selected tarot cards to the component's expected format
export const mapCardsToComponent = (selectedCards: TarotCard[]): SelectedCard[] => {
  const positions = [
    { subtitle: 'Digital Foundation' },
    { subtitle: 'Present Crossroads' },
    { subtitle: 'Emerging Potential' }
  ];
  
  return selectedCards.map((card, index) => ({
    id: card.id,
    title: card.name, // Use the actual card name instead of mystical titles
    subtitle: positions[index].subtitle,
    image: getCardImage(card),
    reading: '',
    isRevealed: false,
    card
  }));
};

// Map card names to their correct webp artwork
const getCardImage = (card: TarotCard): string => {
  const imageMap: Record<string, string> = {
    'fool': 'The Fool.webp',
    'magician': 'The Magician.webp',
    'high-priestess': 'The High Priestess.webp',
    'empress': 'The Empress.webp',
    'emperor': 'The Emperor.webp',
    'hierophant': 'The Hierophant.webp',
    'lovers': 'The Lovers.webp',
    'chariot': 'The Chariot.webp',
    'strength': 'Strength.webp',
    'hermit': 'The Hermit.webp',
    'wheel-of-fortune': 'Wheel of Fortune.webp',
    'justice': 'Justice.webp',
    'hanged-man': 'The Hanged Man.webp',
    'death': 'Death.webp',
    'temperance': 'Temperance.webp',
    'devil': 'The Devil.webp',
    'tower': 'The Tower.webp',
    'star': 'The Star.webp',
    'moon': 'The Moon.webp',
    'sun': 'The Sun.webp',
    'judgement': 'Judgement.webp',
    'world': 'The World.webp'
  };
  
  return imageMap[card.id] || 'The Fool.webp'; // fallback to The Fool
};