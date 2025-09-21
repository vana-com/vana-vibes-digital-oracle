import { TarotCard } from "./tarot-cards.type";

export interface SelectedCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  reading: string;
  isRevealed: boolean;
  card: TarotCard;
}

export const mapCardsToComponent = (
  selectedCards: TarotCard[],
): SelectedCard[] => {
  const positions = [
    { subtitle: "Career Journey" },
    { subtitle: "Current State" },
    { subtitle: "Network & Trajectory" },
  ];

  return selectedCards.map((card, index) => ({
    id: card.id,
    title: card.name,
    subtitle: positions[index].subtitle,
    image: getCardImage(card),
    reading: "",
    isRevealed: false,
    card,
  }));
};

const getCardImage = (card: TarotCard): string => {
  return (
    card.image_url ||
    "/lovable-uploads/99f904e1-d1fc-455a-9634-608236b0c228.png"
  );
};
