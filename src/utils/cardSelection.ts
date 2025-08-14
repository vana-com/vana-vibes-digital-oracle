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

// Analyze LinkedIn data to determine user's career themes and select appropriate cards
export const selectCardsBasedOnData = (linkedinData: any): TarotCard[] => {
  const themes = analyzeLinkedInProfile(linkedinData);
  
  // Select cards based on LinkedIn analysis with weighted probability
  const selectedCards: TarotCard[] = [];
  const usedCardIds = new Set<string>(); // Track used cards to avoid duplicates
  
  // Past/Foundation card - from Major Arcana (Career Journey)
  const pastCard = selectUniqueCardByTheme(themes.past_themes, majorArcana, usedCardIds);
  selectedCards.push(pastCard);
  usedCardIds.add(pastCard.id);
  
  // Present/Challenge card - from Major Arcana (Current State)
  const presentCard = selectUniqueCardByTheme(themes.present_themes, majorArcana, usedCardIds);
  selectedCards.push(presentCard);
  usedCardIds.add(presentCard.id);
  
  // Future/Potential card - from Major Arcana (Network & Trajectory)
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

const analyzeLinkedInProfile = (linkedinData: any) => {
  const analysis = {
    past_themes: [] as string[],
    present_themes: [] as string[],
    future_themes: [] as string[]
  };

  if (!linkedinData) return analysis;

  // PAST CARD - Career Journey Analysis
  const positions = linkedinData.positions || [];
  const jobCount = positions.length;
  
  // Job changes analysis
  if (jobCount <= 2) {
    analysis.past_themes.push('loyal', 'steady', 'devoted', 'stable');
  } else if (jobCount <= 5) {
    analysis.past_themes.push('seeking', 'exploring', 'growing', 'evolving');
  } else {
    analysis.past_themes.push('wandering', 'adventurous', 'diverse', 'experienced');
  }

  // Average tenure calculation
  const totalTenure = calculateAverageTenure(positions);
  if (totalTenure < 1) {
    analysis.past_themes.push('restless', 'dynamic', 'quick', 'adaptable');
  } else if (totalTenure <= 3) {
    analysis.past_themes.push('balanced', 'measured', 'thoughtful', 'progressive');
  } else {
    analysis.past_themes.push('rooted', 'deep', 'committed', 'enduring');
  }

  // PRESENT CARD - Current State Analysis
  const headline = linkedinData.headline || '';
  const summary = linkedinData.summary || '';
  
  // Title keywords
  if (headline.toLowerCase().includes('manager')) {
    analysis.present_themes.push('leadership', 'guidance', 'responsibility', 'authority');
  }
  if (headline.toLowerCase().includes('director')) {
    analysis.present_themes.push('vision', 'strategy', 'oracle', 'foresight');
  }
  if (headline.toLowerCase().includes('analyst')) {
    analysis.present_themes.push('insight', 'data', 'patterns', 'wisdom');
  }

  // Buzzword analysis
  const combinedText = (headline + ' ' + summary).toLowerCase();
  if (combinedText.includes('passionate')) {
    analysis.present_themes.push('fire', 'energy', 'enthusiasm', 'drive');
  }
  if (combinedText.includes('results-driven')) {
    analysis.present_themes.push('manifestation', 'achievement', 'power', 'success');
  }
  if (combinedText.includes('innovative')) {
    analysis.present_themes.push('chaos', 'creativity', 'transformation', 'change');
  }

  // Skills analysis
  const skills = linkedinData.skills || [];
  if (skills.length > 5) {
    analysis.present_themes.push('mastery', 'abundance', 'capability', 'strength');
  }

  // FUTURE CARD - Network & Trajectory Analysis
  // Note: Since we don't have connection data in the mock, we'll base this on other factors
  const educationLevel = linkedinData.education?.length || 0;
  const skillDiversity = skills.length;
  
  if (skillDiversity > 8) {
    analysis.future_themes.push('expansion', 'influence', 'networks', 'connection');
  } else if (skillDiversity > 4) {
    analysis.future_themes.push('growth', 'building', 'developing', 'ascending');
  } else {
    analysis.future_themes.push('potential', 'emerging', 'foundation', 'beginning');
  }

  // Add mystical elements based on industry/role
  if (combinedText.includes('tech') || combinedText.includes('software')) {
    analysis.future_themes.push('digital', 'innovation', 'virtual', 'quantum');
  }
  if (combinedText.includes('sales') || combinedText.includes('business')) {
    analysis.future_themes.push('persuasion', 'commerce', 'abundance', 'prosperity');
  }

  return analysis;
};

const calculateAverageTenure = (positions: any[]): number => {
  if (!positions.length) return 0;
  
  let totalMonths = 0;
  let validPositions = 0;
  
  positions.forEach(position => {
    if (position.startDate) {
      const startYear = parseInt(position.startDate.split('-')[0]);
      const startMonth = parseInt(position.startDate.split('-')[1] || '1');
      
      let endYear, endMonth;
      if (position.current || !position.endDate) {
        const now = new Date();
        endYear = now.getFullYear();
        endMonth = now.getMonth() + 1;
      } else {
        endYear = parseInt(position.endDate.split('-')[0]);
        endMonth = parseInt(position.endDate.split('-')[1] || '12');
      }
      
      const months = (endYear - startYear) * 12 + (endMonth - startMonth);
      if (months > 0) {
        totalMonths += months;
        validPositions++;
      }
    }
  });
  
  return validPositions > 0 ? (totalMonths / validPositions) / 12 : 0;
};

// Map selected tarot cards to the component's expected format
export const mapCardsToComponent = (selectedCards: TarotCard[]): SelectedCard[] => {
  const positions = [
    { subtitle: 'Career Journey' },
    { subtitle: 'Current State' },
    { subtitle: 'Network & Trajectory' }
  ];
  
  return selectedCards.map((card, index) => ({
    id: card.id,
    title: card.name, // Use the actual card name
    subtitle: positions[index].subtitle,
    image: getCardImage(card),
    reading: '',
    isRevealed: false,
    card
  }));
};

// Get card image from database
const getCardImage = (card: TarotCard): string => {
  return card.image_url || '/lovable-uploads/99f904e1-d1fc-455a-9634-608236b0c228.png'; // fallback to card back
};