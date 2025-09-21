import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TarotCard, TarotDecks } from "./tarot-cards.type";

export function useTarotCards() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decks, setDecks] = useState<TarotDecks>({
    majorArcana: [],
    minorArcana: [],
    allTarotCards: [],
  });

  useEffect(() => {
    const fetchTarotCards = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("tarot_cards")
          .select("*")
          .order("id");

        if (error) throw error;

        if (data) {
          const transformedCards: TarotCard[] = data.map((card) => ({
            id: card.id,
            name: card.name,
            suit: card.suit,
            number: card.number,
            arcana: card.arcana as "major" | "minor",
            keywords: card.keywords || [],
            meaning: {
              upright: card.meaning_upright,
              reversed: card.meaning_reversed,
            },
            symbolism: card.symbolism || [],
            element: card.element,
            astrology: card.astrology,
            image_url: card.image_url,
          }));

          const nextMajor = transformedCards.filter(
            (c) => c.arcana === "major",
          );
          const nextMinor = transformedCards.filter(
            (c) => c.arcana === "minor",
          );

          setDecks({
            majorArcana: nextMajor,
            minorArcana: nextMinor,
            allTarotCards: transformedCards,
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch tarot cards",
        );
        console.error("Error fetching tarot cards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTarotCards();
  }, []);

  return { loading, error, decks };
}
