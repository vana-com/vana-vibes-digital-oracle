export interface TarotCard {
  id: string;
  name: string;
  suit?: string;
  number?: number;
  arcana: 'major' | 'minor';
  keywords: string[];
  meaning: {
    upright: string;
    reversed: string;
  };
  symbolism: string[];
  element?: string;
  astrology?: string;
  image_url: string;
}

// Legacy exports for compatibility - now these will be fetched from database
export let majorArcana: TarotCard[] = [];
export let minorArcana: TarotCard[] = [];
export let allTarotCards: TarotCard[] = [];

export const getCardById = (id: string): TarotCard | undefined => {
  return allTarotCards.find(card => card.id === id);
};

export const getRandomCards = (count: number): TarotCard[] => {
  const shuffled = [...allTarotCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};