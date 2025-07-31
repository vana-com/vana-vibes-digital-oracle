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

// Map card names to their uploaded artwork files
const getCardImage = (card: TarotCard): string => {
  const imageMap: Record<string, string> = {
    'fool': '/lovable-uploads/a1d7902c-0234-434d-b553-8f8811fe6c2d.png',
    'magician': '/lovable-uploads/cfd9fd7c-db49-49c6-88aa-1a87e1bc07ef.png',
    'high-priestess': '/lovable-uploads/c9f510f2-3511-45ef-94fd-4225a8ab1b2f.png',
    'empress': '/lovable-uploads/9d593bf0-ed48-444c-b258-ad1725f839c3.png',
    'emperor': '/lovable-uploads/711f1182-139b-4d8e-9b34-c613b583795d.png',
    'hierophant': '/lovable-uploads/a81850ee-d2ec-483a-970a-b01f4fbc0d66.png',
    'lovers': '/lovable-uploads/ad20572a-dd87-4480-84b8-c6961887ddd2.png',
    'chariot': '/lovable-uploads/608fb09f-a2f1-4a90-b1d1-dacf6aeb8c01.png',
    'strength': '/lovable-uploads/138d70ba-e8b1-48d1-abbb-23afd99b6233.png',
    'hermit': '/lovable-uploads/ded73efa-6c8b-4f3d-b5c4-9067efb9f23e.png',
    'wheel-of-fortune': '/lovable-uploads/4affbc8b-6b19-4342-adf0-2793f5382c7b.png',
    'justice': '/lovable-uploads/00cbef68-6257-457d-85cd-a60de156d72f.png',
    'hanged-man': '/lovable-uploads/aaa1cb07-332b-4865-8457-4905424c5284.png',
    'death': '/lovable-uploads/e15531d5-18a4-45cc-a2ed-884a6d0280f6.png',
    'temperance': '/lovable-uploads/d0cb33d7-d2ef-4f3e-bfa2-08d5cbc7378e.png',
    'devil': '/lovable-uploads/71fbc844-178f-4342-9418-e34556e830ef.png',
    'tower': '/lovable-uploads/e462e07c-469e-4e28-b33f-34cd118856f7.png',
    'star': '/lovable-uploads/79f70ff7-ac20-49f0-b6d9-fceb783ab17c.png',
    'moon': '/lovable-uploads/7f6abb79-06b0-4830-92d9-b52e38b9c82d.png',
    'sun': '/lovable-uploads/5c10d349-f981-4b39-b307-a3e9f9b589b1.png',
    'judgement': '/lovable-uploads/a19db11e-f873-402b-ac9d-6d01a9e8d4f4.png',
    'world': '/lovable-uploads/d9fdc57b-75f8-4d9b-ad28-755a7a774c83.png'
  };
  
  return imageMap[card.id] || '/lovable-uploads/a1d7902c-0234-434d-b553-8f8811fe6c2d.png'; // fallback to The Fool
};