export interface TarotCard {
  id: string;
  name: string;
  suit?: string;
  number?: number;
  arcana: "major" | "minor";
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

export interface TarotDecks {
  majorArcana: TarotCard[];
  minorArcana: TarotCard[];
  allTarotCards: TarotCard[];
}
