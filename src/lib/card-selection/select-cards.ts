import { TarotCard, TarotDecks } from "./tarot-cards.type";

export const selectCardsBasedOnData = (
  linkedinData: any,
  decks: TarotDecks,
): TarotCard[] => {
  const themes = analyzeLinkedInProfile(linkedinData);

  const selectedCards: TarotCard[] = [];
  const usedCardIds = new Set<string>();

  const pastCard = selectUniqueCardByTheme(
    themes.past_themes,
    decks.majorArcana,
    usedCardIds,
  );
  selectedCards.push(pastCard);
  usedCardIds.add(pastCard.id);

  const presentCard = selectUniqueCardByTheme(
    themes.present_themes,
    decks.majorArcana,
    usedCardIds,
  );
  selectedCards.push(presentCard);
  usedCardIds.add(presentCard.id);

  const futureCard = selectUniqueCardByTheme(
    themes.future_themes,
    decks.majorArcana,
    usedCardIds,
  );
  selectedCards.push(futureCard);
  usedCardIds.add(futureCard.id);

  return selectedCards;
};

const selectUniqueCardByTheme = (
  themes: string[],
  cardPool: TarotCard[],
  usedCardIds: Set<string>,
): TarotCard => {
  const availableCards = cardPool.filter((card) => !usedCardIds.has(card.id));
  if (availableCards.length === 0) {
    return cardPool[Math.floor(Math.random() * cardPool.length)];
  }

  const weightedCards = availableCards.map((card) => ({
    card,
    weight: calculateCardRelevance(card, themes),
  }));

  weightedCards.sort((a, b) => b.weight - a.weight);

  const topCandidates = weightedCards.slice(
    0,
    Math.min(10, weightedCards.length),
  );
  const randomIndex = Math.floor(Math.random() * topCandidates.length);

  return topCandidates[randomIndex].card;
};

const calculateCardRelevance = (card: TarotCard, themes: string[]): number => {
  let relevance = Math.random() * 0.3;
  themes.forEach((theme) => {
    card.keywords.forEach((keyword) => {
      if (
        keyword.includes(theme.toLowerCase()) ||
        theme.toLowerCase().includes(keyword)
      ) {
        relevance += 0.4;
      }
    });

    if (
      card.meaning.upright.toLowerCase().includes(theme.toLowerCase()) ||
      card.meaning.reversed.toLowerCase().includes(theme.toLowerCase())
    ) {
      relevance += 0.3;
    }
  });

  return relevance;
};

const analyzeLinkedInProfile = (linkedinData: any) => {
  const analysis = {
    past_themes: [] as string[],
    present_themes: [] as string[],
    future_themes: [] as string[],
  };

  if (!linkedinData) return analysis;

  const positions = linkedinData.positions || [];
  const jobCount = positions.length;

  if (jobCount <= 2) {
    analysis.past_themes.push("loyal", "steady", "devoted", "stable");
  } else if (jobCount <= 5) {
    analysis.past_themes.push("seeking", "exploring", "growing", "evolving");
  } else {
    analysis.past_themes.push(
      "wandering",
      "adventurous",
      "diverse",
      "experienced",
    );
  }

  const totalTenure = calculateAverageTenure(positions);
  if (totalTenure < 1) {
    analysis.past_themes.push("restless", "dynamic", "quick", "adaptable");
  } else if (totalTenure <= 3) {
    analysis.past_themes.push(
      "balanced",
      "measured",
      "thoughtful",
      "progressive",
    );
  } else {
    analysis.past_themes.push("rooted", "deep", "committed", "enduring");
  }

  const headline = linkedinData.headline || "";
  const summary = linkedinData.summary || "";

  if (headline.toLowerCase().includes("manager")) {
    analysis.present_themes.push(
      "leadership",
      "guidance",
      "responsibility",
      "authority",
    );
  }
  if (headline.toLowerCase().includes("director")) {
    analysis.present_themes.push("vision", "strategy", "oracle", "foresight");
  }
  if (headline.toLowerCase().includes("analyst")) {
    analysis.present_themes.push("insight", "data", "patterns", "wisdom");
  }

  const combinedText = (headline + " " + summary).toLowerCase();
  if (combinedText.includes("passionate")) {
    analysis.present_themes.push("fire", "energy", "enthusiasm", "drive");
  }
  if (combinedText.includes("results-driven")) {
    analysis.present_themes.push(
      "manifestation",
      "achievement",
      "power",
      "success",
    );
  }
  if (combinedText.includes("innovative")) {
    analysis.present_themes.push(
      "chaos",
      "creativity",
      "transformation",
      "change",
    );
  }

  const skills = linkedinData.skills || [];
  if (skills.length > 5) {
    analysis.present_themes.push(
      "mastery",
      "abundance",
      "capability",
      "strength",
    );
  }

  const educationLevel = linkedinData.education?.length || 0;
  const skillDiversity = skills.length;

  if (skillDiversity > 8) {
    analysis.future_themes.push(
      "expansion",
      "influence",
      "networks",
      "connection",
    );
  } else if (skillDiversity > 4) {
    analysis.future_themes.push(
      "growth",
      "building",
      "developing",
      "ascending",
    );
  } else {
    analysis.future_themes.push(
      "potential",
      "emerging",
      "foundation",
      "beginning",
    );
  }

  if (combinedText.includes("tech") || combinedText.includes("software")) {
    analysis.future_themes.push("digital", "innovation", "virtual", "quantum");
  }
  if (combinedText.includes("sales") || combinedText.includes("business")) {
    analysis.future_themes.push(
      "persuasion",
      "commerce",
      "abundance",
      "prosperity",
    );
  }

  return analysis;
};

const calculateAverageTenure = (positions: any[]): number => {
  if (!positions.length) return 0;

  let totalMonths = 0;
  let validPositions = 0;

  positions.forEach((position) => {
    if (position.startDate) {
      const startYear = parseInt(position.startDate.split("-")[0]);
      const startMonth = parseInt(position.startDate.split("-")[1] || "1");

      let endYear, endMonth;
      if (position.current || !position.endDate) {
        const now = new Date();
        endYear = now.getFullYear();
        endMonth = now.getMonth() + 1;
      } else {
        endYear = parseInt(position.endDate.split("-")[0]);
        endMonth = parseInt(position.endDate.split("-")[1] || "12");
      }

      const months = (endYear - startYear) * 12 + (endMonth - startMonth);
      if (months > 0) {
        totalMonths += months;
        validPositions++;
      }
    }
  });

  return validPositions > 0 ? totalMonths / validPositions / 12 : 0;
};
