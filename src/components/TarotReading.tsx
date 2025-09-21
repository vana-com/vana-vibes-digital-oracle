import { LinkedInShareModal } from "@/components/LinkedInShareModal";
import { useTarotCards } from "@/lib/card-selection/use-tarot-cards";
import { cn } from "@/lib/utils";
import { SelectedCard } from "@/lib/card-selection/map-cards";
import { mapCardsToComponent } from "@/lib/card-selection/map-cards";
import { selectCardsBasedOnData } from "@/lib/card-selection/select-cards";
import { generateAllReadings } from "@/lib/readings/reading-generator";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BlinkButton } from "./BlinkButton";
import { ReadingHeader, ReadingHeaderLoading } from "./ReadingHeader";
import ScrambleText from "./ScrambleText";
import { createSparkles } from "@/lib/create-sparkles";
import BlockLoader from "./BlockLoader";
import { useCareerFortuneMessages } from "@/lib/use-career-fortune-messages";
import { LinkedInData } from "@/lib/linkedin-data.type";

interface ExtendedCard extends SelectedCard {
  isCompleted: boolean;
}

interface TarotReadingProps {
  linkedinData: LinkedInData | null;
  isLoading?: boolean;
}

const TarotReading = ({
  linkedinData,
  isLoading = false,
}: TarotReadingProps) => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<ExtendedCard[]>([]);
  const [isGeneratingReadings, setIsGeneratingReadings] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { loading: cardsLoading, error: cardsError, decks } = useTarotCards();
  const { messages, currentMessage } = useCareerFortuneMessages(
    linkedinData ?? undefined,
  );

  // Initialize cards based on LinkedIn data analysis
  useEffect(() => {
    if (cardsLoading || !linkedinData) return;

    if (cardsError) {
      console.error("Error loading tarot cards:", cardsError);
      return;
    }

    const initializeReading = async () => {
      console.log(
        "Initializing tarot reading with LinkedIn data:",
        linkedinData,
      );

      // Select 3 cards from the full 78-card deck based on professional themes
      const selectedTarotCards = selectCardsBasedOnData(linkedinData, decks);
      const mappedCards = mapCardsToComponent(selectedTarotCards);

      // Set cards initially without readings
      setCards(mappedCards.map((c) => ({ ...c, isCompleted: false })));
      setIsGeneratingReadings(true);

      try {
        // Generate AI-powered mystical readings for each selected card
        const readings = await generateAllReadings(mappedCards, linkedinData);

        // Update cards with generated readings
        setCards((prev) =>
          prev.map((card, index) => ({
            ...card,
            reading: readings[index],
          })),
        );
      } catch (error) {
        console.error("Error generating readings:", error);
        // Keep cards without readings if generation fails
      } finally {
        setIsGeneratingReadings(false);
      }
    };

    initializeReading();
  }, [linkedinData, cardsLoading, cardsError, decks]);

  const revealCard = (cardId: string) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, isRevealed: true } : card,
      ),
    );

    // Trigger sparkle effect
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    if (cardElement) {
      createSparkles(cardElement);
    }
  };

  if (isLoading || !linkedinData) {
    return (
      <div className="wrapper">
        <ReadingHeaderLoading />
      </div>
    );
  }

  if (isGeneratingReadings || cards.length === 0) {
    return (
      <div className="wrapper">
        <ReadingHeaderLoading
          bottomNode={
            <>
              <BlockLoader mode={3} />
              {messages[currentMessage]}
            </>
          }
        />
      </div>
    );
  }

  return (
    <>
      <div className="wrapper">
        <ReadingHeader
          topNode={
            <>
              <ScrambleText
                as="h2"
                className="text-label text-green"
                text="Success"
                delayMs={0}
                speed={0.5}
                scramble={1}
                chance={0.8}
                step={2}
                overdrive
              />
              <BlinkButton
                onClick={() => navigate("/")}
                className="text-label w-auto text-green"
              >
                Run again
              </BlinkButton>
            </>
          }
          bottomNode={
            <>
              <ScrambleText
                as="h2"
                className="text-label text-green"
                text="Oracle returned 3 prophecies"
                delayMs={1000}
                speed={0.5}
                scramble={1}
                chance={0.8}
                step={2}
                overdrive
              />
              {cards.every((card) => card.isRevealed && card.isCompleted) && (
                <BlinkButton
                  onClick={() => setIsShareModalOpen(true)}
                  className="text-label w-auto text-black bg-green"
                >
                  Share to LinkedIn
                </BlinkButton>
              )}
            </>
          }
        />

        {/* Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:px-12">
          {cards.map((card, index) => (
            <button
              key={card.id}
              data-slot="tarot-card"
              data-card-id={card.id}
              onClick={() =>
                !card.isRevealed && !isGeneratingReadings && revealCard(card.id)
              }
              className={cn(
                "relative cursor-pointer transform transition-all duration-700",
                "border border-green px-4 py-3",
                "w-full min-h-[280px] lg:min-h-[480px] lg:max-h-[60vh] text-left",
                "flex flex-col items-start justify-start",
                "outline-2 outline-transparent outline-offset-2",
                "hover:outline-green",
                card.isRevealed && "bg-green outline outline-green",
              )}
              style={{
                perspective: "1000px",
                pointerEvents: isGeneratingReadings ? "none" : "auto",
              }}
            >
              <p
                className={cn(
                  "text-label",
                  card.isRevealed ? "text-black font-bold" : "text-green",
                )}
              >
                {card.subtitle}
              </p>

              {card.isRevealed ? (
                <>
                  <ScrambleText
                    as="h3"
                    className={cn("text-subheading text-black")}
                    text={card.title}
                    delayMs={0}
                    speed={0.25}
                    scramble={1}
                    chance={0.8}
                    step={1}
                    overdrive
                  />
                  <div className="mt-auto pt-5">
                    <ScrambleText
                      as="p"
                      className={cn(
                        "text-black leading-relaxed ibm-plex-mono-semibold text-base",
                      )}
                      text={card.reading}
                      delayMs={500}
                      speed={0.5}
                      scramble={1}
                      chance={0.8}
                      step={2}
                      overdrive
                      onDone={() => {
                        setCards((prev) =>
                          prev.map((c) =>
                            c.id === card.id ? { ...c, isCompleted: true } : c,
                          ),
                        );
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <ScrambleText
                    as="h3"
                    className={cn("text-subheading text-green")}
                    text={"Caution! Sealed!"}
                    // delayMs={1500 + index * 500}
                    delayMs={0}
                    speed={0.25}
                    scramble={1}
                    chance={0.8}
                    step={1}
                    overdrive
                  />
                  <div className="mt-auto w-full">
                    <BlinkButton as="div" className="justify-end text-green">
                      Unseal
                    </BlinkButton>
                  </div>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Footer Message */}
        {/* Your digital essence has been revealed through the mystical
            convergence of ancient wisdom and modern consciousness. Carry
            these sacred insights as you traverse the liminal spaces between
            digital and spiritual realms. */}
        {cards.every((card) => card.isRevealed && card.isCompleted) && (
          <div className="lg:px-12 flex flex-col justify-start lg:min-h-[20vh]">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className={cn(
                "text-subheading text-green",
                "border border-green px-4 py-3",
                "w-full text-center",
              )}
            >
              Share to LinkedIn
            </button>
          </div>
        )}
      </div>

      {/* LinkedIn Share Modal */}
      <LinkedInShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        readings={cards.map((card) => card.reading || "")}
        selectedCards={cards.map((card) => ({
          name: card.title,
          image: card.image,
        }))}
        linkedinData={linkedinData}
      />
    </>
  );
};

export default TarotReading;
