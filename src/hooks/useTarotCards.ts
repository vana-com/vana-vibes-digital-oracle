import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TarotCard, majorArcana, minorArcana, allTarotCards } from '@/data/tarotCards';

export const useTarotCards = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTarotCards = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tarot_cards')
          .select('*')
          .order('id');

        if (error) throw error;

        if (data) {
          // Transform database format to app format
          const transformedCards: TarotCard[] = data.map(card => ({
            id: card.id,
            name: card.name,
            suit: card.suit,
            number: card.number,
            arcana: card.arcana as 'major' | 'minor',
            keywords: card.keywords || [],
            meaning: {
              upright: card.meaning_upright,
              reversed: card.meaning_reversed
            },
            symbolism: card.symbolism || [],
            element: card.element,
            astrology: card.astrology,
            image_url: card.image_url
          }));

          // Update the exported arrays
          majorArcana.length = 0;
          minorArcana.length = 0;
          allTarotCards.length = 0;

          transformedCards.forEach(card => {
            if (card.arcana === 'major') {
              majorArcana.push(card);
            } else {
              minorArcana.push(card);
            }
            allTarotCards.push(card);
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tarot cards');
        console.error('Error fetching tarot cards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTarotCards();
  }, []);

  return { loading, error };
};