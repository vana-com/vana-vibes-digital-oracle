import { useState, useEffect } from "react";
import { LinkedInData } from "./linkedin-data.type";

export function useCareerFortuneMessages(linkedinData?: LinkedInData) {
  const firstName = linkedinData?.firstName || "Professional";
  const currentRole = linkedinData?.headline || "Career Wanderer";

  const messages = [
    `Consulting the cosmic LinkedIn overlords about ${firstName}'s destiny...`,
    `Decoding the mystical algorithms of ${firstName}'s professional aura...`,
    `Translating ${firstName}'s skill endorsements into ancient career runes...`,
    `Channeling the spirits of past performance reviews...`,
    `Reading the sacred patterns in ${firstName}'s connection constellation...`,
    `Interpreting the mystical significance of being a "${currentRole}"...`,
    `Consulting the Oracle of Corporate Hierarchies about ${firstName}'s path...`,
    `Analyzing the karmic implications of ${firstName}'s job transitions...`,
    `Divining the future through the sacred art of professional networking...`,
    `Awakening the ancient wisdom of salary negotiations for ${firstName}...`,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return {
    messages,
    currentIndex,
    currentMessage: messages[currentIndex],
  };
}
