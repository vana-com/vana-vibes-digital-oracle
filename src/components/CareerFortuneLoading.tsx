import { useState, useEffect } from "react";
import BlockLoader from "./BlockLoader";
import { ReadingHeader } from "./ReadingHeader";

interface CareerFortuneLoadingProps {
  linkedinData?: any;
}

const CareerFortuneLoading = ({ linkedinData }: CareerFortuneLoadingProps) => {
  const [currentMessage, setCurrentMessage] = useState(0);

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

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => {
      clearInterval(messageInterval);
    };
  }, [messages.length]);

  return (
    <ReadingHeader
      topNode={
        <div className="text-label text-green flex items-center gap-4">
          <BlockLoader mode={6} />
          Running divination
        </div>
      }
      bottomNode={
        <div className="text-label text-green flex items-center gap-4">
          <BlockLoader mode={3} />
          {messages[currentMessage]}
        </div>
      }
    />
  );
};

export default CareerFortuneLoading;
