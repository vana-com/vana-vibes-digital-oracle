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
  
  // Past/Foundation card - prefer Major Arcana for foundational insights
  const pastCard = selectCardByTheme(themes.past_themes, majorArcana, 0.7);
  selectedCards.push(pastCard);
  
  // Present/Challenge card - mix of Major and Minor based on complexity
  const presentCard = selectCardByTheme(themes.present_themes, allTarotCards, 0.5);
  selectedCards.push(presentCard);
  
  // Future/Potential card - prefer cards with positive transformation themes
  const futureCard = selectCardByTheme(themes.future_themes, allTarotCards, 0.6);
  selectedCards.push(futureCard);
  
  return selectedCards;
};

const selectCardByTheme = (themes: string[], cardPool: TarotCard[], majorArcanaWeight: number): TarotCard => {
  // Create weighted pool based on theme relevance
  const weightedCards = cardPool.map(card => ({
    card,
    weight: calculateCardRelevance(card, themes)
  }));
  
  // Sort by relevance and add some randomness
  weightedCards.sort((a, b) => b.weight - a.weight);
  
  // Select from top 10 most relevant cards to maintain some randomness
  const topCandidates = weightedCards.slice(0, 10);
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
    { title: 'The Seeker', subtitle: 'Digital Foundation' },
    { title: 'The Threshold', subtitle: 'Present Crossroads' },
    { title: 'The Becoming', subtitle: 'Emerging Potential' }
  ];
  
  return selectedCards.map((card, index) => ({
    id: card.id,
    title: positions[index].title,
    subtitle: positions[index].subtitle,
    image: getCardImage(card),
    reading: '',
    isRevealed: false,
    card
  }));
};

// Generate appropriate card images (using our existing ones for now)
const getCardImage = (card: TarotCard): string => {
  // For now, cycle through our existing images
  // In a full implementation, each card would have its own image
  const images = [
    '/src/assets/tarot-seeker.jpg',
    '/src/assets/tarot-threshold.jpg', 
    '/src/assets/tarot-becoming.jpg'
  ];
  
  const imageIndex = Math.abs(card.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % images.length;
  return images[imageIndex];
};