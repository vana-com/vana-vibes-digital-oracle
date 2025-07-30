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
}

// Major Arcana (22 cards)
export const majorArcana: TarotCard[] = [
  {
    id: 'fool',
    name: 'The Fool',
    arcana: 'major',
    keywords: ['new beginnings', 'innocence', 'adventure', 'potential'],
    meaning: {
      upright: 'New beginnings, innocence, adventure, freedom, originality',
      reversed: 'Recklessness, carelessness, negligence, foolishness'
    },
    symbolism: ['white rose', 'precipice', 'small bag', 'dog'],
    element: 'Air',
    astrology: 'Uranus'
  },
  {
    id: 'magician',
    name: 'The Magician',
    arcana: 'major',
    keywords: ['manifestation', 'willpower', 'creation', 'skill'],
    meaning: {
      upright: 'Manifestation, willpower, desire, creation, skill, ability',
      reversed: 'Manipulation, cunning, trickery, wasted talent'
    },
    symbolism: ['infinity symbol', 'wand', 'altar', 'red roses'],
    element: 'Air',
    astrology: 'Mercury'
  },
  {
    id: 'high-priestess',
    name: 'The High Priestess',
    arcana: 'major',
    keywords: ['intuition', 'subconscious', 'mystery', 'spirituality'],
    meaning: {
      upright: 'Intuition, sacred knowledge, divine feminine, subconscious mind',
      reversed: 'Secrets, disconnected from intuition, withdrawal'
    },
    symbolism: ['moon crown', 'scroll', 'pillars', 'pomegranates'],
    element: 'Water',
    astrology: 'Moon'
  },
  {
    id: 'empress',
    name: 'The Empress',
    arcana: 'major',
    keywords: ['femininity', 'beauty', 'nature', 'abundance'],
    meaning: {
      upright: 'Femininity, beauty, nature, nurturing, abundance',
      reversed: 'Creative block, dependence on others, smothering'
    },
    symbolism: ['venus symbol', 'crown of stars', 'wheat', 'waterfall'],
    element: 'Earth',
    astrology: 'Venus'
  },
  {
    id: 'emperor',
    name: 'The Emperor',
    arcana: 'major',
    keywords: ['authority', 'structure', 'control', 'fatherhood'],
    meaning: {
      upright: 'Authority, establishment, structure, father figure',
      reversed: 'Domination, excessive control, tyranny, rigidity'
    },
    symbolism: ['throne', 'ram heads', 'orb', 'scepter'],
    element: 'Fire',
    astrology: 'Aries'
  },
  {
    id: 'hierophant',
    name: 'The Hierophant',
    arcana: 'major',
    keywords: ['spirituality', 'conformity', 'tradition', 'institutions'],
    meaning: {
      upright: 'Spiritual wisdom, religious beliefs, conformity, tradition',
      reversed: 'Personal beliefs, freedom, challenging tradition'
    },
    symbolism: ['papal cross', 'two pillars', 'keys', 'crown'],
    element: 'Earth',
    astrology: 'Taurus'
  },
  {
    id: 'lovers',
    name: 'The Lovers',
    arcana: 'major',
    keywords: ['love', 'harmony', 'relationships', 'values'],
    meaning: {
      upright: 'Love, harmony, relationships, values alignment, choices',
      reversed: 'Disharmony, imbalance, misalignment of values'
    },
    symbolism: ['angel', 'tree of knowledge', 'tree of life', 'mountain'],
    element: 'Air',
    astrology: 'Gemini'
  },
  {
    id: 'chariot',
    name: 'The Chariot',
    arcana: 'major',
    keywords: ['control', 'willpower', 'success', 'determination'],
    meaning: {
      upright: 'Control, willpower, success, determination, direction',
      reversed: 'Self-discipline, opposition, lack of direction'
    },
    symbolism: ['sphinxes', 'star crown', 'city', 'chariot'],
    element: 'Water',
    astrology: 'Cancer'
  },
  {
    id: 'strength',
    name: 'Strength',
    arcana: 'major',
    keywords: ['strength', 'courage', 'patience', 'control'],
    meaning: {
      upright: 'Strength, courage, patience, control, compassion',
      reversed: 'Self-doubt, lack of confidence, lack of self-discipline'
    },
    symbolism: ['infinity symbol', 'lion', 'flower crown', 'white robe'],
    element: 'Fire',
    astrology: 'Leo'
  },
  {
    id: 'hermit',
    name: 'The Hermit',
    arcana: 'major',
    keywords: ['soul searching', 'seeking truth', 'inner guidance'],
    meaning: {
      upright: 'Soul searching, seeking truth, inner guidance, introspection',
      reversed: 'Isolation, loneliness, withdrawal, paranoia'
    },
    symbolism: ['lantern', 'staff', 'mountain peak', 'star'],
    element: 'Earth',
    astrology: 'Virgo'
  },
  {
    id: 'wheel-of-fortune',
    name: 'Wheel of Fortune',
    arcana: 'major',
    keywords: ['good luck', 'karma', 'life cycles', 'destiny'],
    meaning: {
      upright: 'Good luck, karma, life cycles, destiny, turning point',
      reversed: 'Bad luck, lack of control, clinging to control'
    },
    symbolism: ['wheel', 'sphinx', 'snake', 'anubis'],
    element: 'Fire',
    astrology: 'Jupiter'
  },
  {
    id: 'justice',
    name: 'Justice',
    arcana: 'major',
    keywords: ['justice', 'fairness', 'truth', 'cause and effect'],
    meaning: {
      upright: 'Justice, fairness, truth, cause and effect, law',
      reversed: 'Unfairness, lack of accountability, dishonesty'
    },
    symbolism: ['scales', 'sword', 'crown', 'pillars'],
    element: 'Air',
    astrology: 'Libra'
  },
  {
    id: 'hanged-man',
    name: 'The Hanged Man',
    arcana: 'major',
    keywords: ['suspension', 'restriction', 'letting go', 'sacrifice'],
    meaning: {
      upright: 'Suspension, restriction, letting go, sacrifice',
      reversed: 'Martyrdom, indecision, delay, resistance'
    },
    symbolism: ['tree', 'halo', 'crossed legs', 'hands behind back'],
    element: 'Water',
    astrology: 'Neptune'
  },
  {
    id: 'death',
    name: 'Death',
    arcana: 'major',
    keywords: ['endings', 'beginnings', 'change', 'transformation'],
    meaning: {
      upright: 'Endings, beginnings, change, transformation, transition',
      reversed: 'Resistance to change, personal transformation, inner purging'
    },
    symbolism: ['skeleton', 'armor', 'white horse', 'flag'],
    element: 'Water',
    astrology: 'Scorpio'
  },
  {
    id: 'temperance',
    name: 'Temperance',
    arcana: 'major',
    keywords: ['balance', 'moderation', 'patience', 'purpose'],
    meaning: {
      upright: 'Balance, moderation, patience, purpose, meaning',
      reversed: 'Imbalance, excess, self-healing, re-alignment'
    },
    symbolism: ['angel', 'cups', 'water', 'triangle'],
    element: 'Fire',
    astrology: 'Sagittarius'
  },
  {
    id: 'devil',
    name: 'The Devil',
    arcana: 'major',
    keywords: ['shadow self', 'attachment', 'addiction', 'restriction'],
    meaning: {
      upright: 'Shadow self, attachment, addiction, restriction, sexuality',
      reversed: 'Releasing limiting beliefs, exploring dark thoughts, detachment'
    },
    symbolism: ['baphomet', 'chains', 'naked figures', 'pentagram'],
    element: 'Earth',
    astrology: 'Capricorn'
  },
  {
    id: 'tower',
    name: 'The Tower',
    arcana: 'major',
    keywords: ['sudden change', 'upheaval', 'chaos', 'revelation'],
    meaning: {
      upright: 'Sudden change, upheaval, chaos, revelation, awakening',
      reversed: 'Personal transformation, fear of change, averting disaster'
    },
    symbolism: ['lightning', 'crown', 'falling figures', 'flames'],
    element: 'Fire',
    astrology: 'Mars'
  },
  {
    id: 'star',
    name: 'The Star',
    arcana: 'major',
    keywords: ['hope', 'faith', 'purpose', 'renewal'],
    meaning: {
      upright: 'Hope, faith, purpose, renewal, spirituality',
      reversed: 'Lack of faith, despair, self-trust, disconnection'
    },
    symbolism: ['seven stars', 'water', 'naked woman', 'bird'],
    element: 'Air',
    astrology: 'Aquarius'
  },
  {
    id: 'moon',
    name: 'The Moon',
    arcana: 'major',
    keywords: ['illusion', 'fear', 'anxiety', 'subconscious'],
    meaning: {
      upright: 'Illusion, fear, anxiety, subconscious, intuition',
      reversed: 'Release of fear, repressed emotion, inner confusion'
    },
    symbolism: ['moon', 'wolf', 'dog', 'crayfish'],
    element: 'Water',
    astrology: 'Pisces'
  },
  {
    id: 'sun',
    name: 'The Sun',
    arcana: 'major',
    keywords: ['positivity', 'fun', 'warmth', 'success'],
    meaning: {
      upright: 'Positivity, fun, warmth, success, vitality',
      reversed: 'Inner child, feeling down, overly optimistic'
    },
    symbolism: ['sun', 'child', 'white horse', 'sunflowers'],
    element: 'Fire',
    astrology: 'Sun'
  },
  {
    id: 'judgement',
    name: 'Judgement',
    arcana: 'major',
    keywords: ['judgement', 'rebirth', 'inner calling', 'absolution'],
    meaning: {
      upright: 'Judgement, rebirth, inner calling, absolution',
      reversed: 'Self-doubt, inner critic, ignoring the call'
    },
    symbolism: ['angel', 'trumpet', 'cross', 'rising figures'],
    element: 'Fire',
    astrology: 'Pluto'
  },
  {
    id: 'world',
    name: 'The World',
    arcana: 'major',
    keywords: ['completion', 'integration', 'accomplishment', 'travel'],
    meaning: {
      upright: 'Completion, integration, accomplishment, travel',
      reversed: 'Seeking personal closure, short-cut to success'
    },
    symbolism: ['wreath', 'four creatures', 'dancing figure', 'infinity'],
    element: 'Earth',
    astrology: 'Saturn'
  }
];

// Minor Arcana Suits
export const minorArcana: TarotCard[] = [
  // Wands (Fire)
  ...Array.from({length: 14}, (_, i) => {
    const number = i + 1;
    const isCourtCard = number > 10;
    const courtNames = ['', '', '', '', '', '', '', '', '', '', 'Page', 'Knight', 'Queen', 'King'];
    
    return {
      id: `wands-${number}`,
      name: isCourtCard ? `${courtNames[number]} of Wands` : `${number} of Wands`,
      suit: 'Wands',
      number,
      arcana: 'minor' as const,
      keywords: ['creativity', 'passion', 'energy', 'inspiration'],
      meaning: {
        upright: 'Creativity, passion, energy, growth, action',
        reversed: 'Lack of energy, delays, frustration, creative blocks'
      },
      symbolism: ['fire', 'growth', 'passion', 'creativity'],
      element: 'Fire'
    };
  }),
  
  // Cups (Water)
  ...Array.from({length: 14}, (_, i) => {
    const number = i + 1;
    const isCourtCard = number > 10;
    const courtNames = ['', '', '', '', '', '', '', '', '', '', 'Page', 'Knight', 'Queen', 'King'];
    
    return {
      id: `cups-${number}`,
      name: isCourtCard ? `${courtNames[number]} of Cups` : `${number} of Cups`,
      suit: 'Cups',
      number,
      arcana: 'minor' as const,
      keywords: ['emotions', 'relationships', 'spirituality', 'intuition'],
      meaning: {
        upright: 'Emotions, relationships, spirituality, intuition, love',
        reversed: 'Emotional imbalance, broken relationships, withdrawal'
      },
      symbolism: ['water', 'emotions', 'love', 'spirituality'],
      element: 'Water'
    };
  }),
  
  // Swords (Air)
  ...Array.from({length: 14}, (_, i) => {
    const number = i + 1;
    const isCourtCard = number > 10;
    const courtNames = ['', '', '', '', '', '', '', '', '', '', 'Page', 'Knight', 'Queen', 'King'];
    
    return {
      id: `swords-${number}`,
      name: isCourtCard ? `${courtNames[number]} of Swords` : `${number} of Swords`,
      suit: 'Swords',
      number,
      arcana: 'minor' as const,
      keywords: ['thoughts', 'communication', 'conflict', 'intellect'],
      meaning: {
        upright: 'Thoughts, communication, conflict, intellect, action',
        reversed: 'Confusion, miscommunication, hostility, arguments'
      },
      symbolism: ['air', 'thoughts', 'communication', 'conflict'],
      element: 'Air'
    };
  }),
  
  // Pentacles (Earth)
  ...Array.from({length: 14}, (_, i) => {
    const number = i + 1;
    const isCourtCard = number > 10;
    const courtNames = ['', '', '', '', '', '', '', '', '', '', 'Page', 'Knight', 'Queen', 'King'];
    
    return {
      id: `pentacles-${number}`,
      name: isCourtCard ? `${courtNames[number]} of Pentacles` : `${number} of Pentacles`,
      suit: 'Pentacles',
      number,
      arcana: 'minor' as const,
      keywords: ['material', 'money', 'career', 'manifestation'],
      meaning: {
        upright: 'Material world, money, career, manifestation, abundance',
        reversed: 'Financial loss, lack of planning, poverty consciousness'
      },
      symbolism: ['earth', 'material', 'abundance', 'manifestation'],
      element: 'Earth'
    };
  })
];

export const allTarotCards: TarotCard[] = [...majorArcana, ...minorArcana];

export const getCardById = (id: string): TarotCard | undefined => {
  return allTarotCards.find(card => card.id === id);
};

export const getRandomCards = (count: number): TarotCard[] => {
  const shuffled = [...allTarotCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};