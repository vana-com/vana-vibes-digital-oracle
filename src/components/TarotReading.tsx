import CareerFortuneLoading from "@/components/CareerFortuneLoading";
import { LinkedInShareModal } from "@/components/LinkedInShareModal";
import { useTarotCards } from "@/hooks/useTarotCards";
import { isTestMode } from "@/lib/test-mode";
import { cn } from "@/lib/utils";
import {
  SelectedCard,
  mapCardsToComponent,
  selectCardsBasedOnData,
} from "@/utils/cardSelection";
import { generateAllReadings } from "@/utils/readingGenerator";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BlinkButton } from "./BlinkButton";
import { ReadingHeader } from "./ReadingHeader";
import ScrambleText from "./ScrambleText";

interface ExtendedCard extends SelectedCard {
  isCompleted: boolean;
}

interface TarotReadingProps {
  linkedinData: unknown;
  isLoading?: boolean;
}

const wrapperStyle = [
  "min-h-dvh relative z-10",
  "max-w-6xl w-full mx-auto",
  "py-3 px-4 lg:p-8 pb-[10vh]",
  " grid grid-rows-[auto_1fr_auto]",
  "space-y-12",
];

const TarotReading = ({
  linkedinData,
  isLoading = false,
}: TarotReadingProps) => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<ExtendedCard[]>([]);
  const [isGeneratingReadings, setIsGeneratingReadings] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [completedReadings, setCompletedReadings] = useState(0);
  const { loading: cardsLoading, error: cardsError } = useTarotCards();

  // Initialize cards based on LinkedIn data analysis
  useEffect(() => {
    if (!linkedinData) {
      navigate("/");
      return;
    }

    const inTest = isTestMode();
    if (cardsLoading && !inTest) return;

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
      const selectedTarotCards = selectCardsBasedOnData(linkedinData);
      const mappedCards = mapCardsToComponent(selectedTarotCards);

      // Set cards initially without readings
      setCards(
        inTest
          ? mappedCards.map((c) => ({
              ...c,
              isRevealed: true,
              isCompleted: true,
            }))
          : mappedCards.map((c) => ({ ...c, isCompleted: false })),
      );
      setIsGeneratingReadings(!inTest);

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
  }, [linkedinData, navigate, cardsLoading, cardsError]);

  const revealCard = (cardId: string) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, isRevealed: true } : card,
      ),
    );

    // Trigger sparkle effect
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    if (cardElement) {
      createSparkleEffect(cardElement);
    }
  };

  const createSparkleEffect = (element: Element) => {
    const rect = element.getBoundingClientRect();
    const sparkleContainer = document.createElement("div");
    sparkleContainer.className = "fixed pointer-events-none z-50";
    sparkleContainer.style.left = `${rect.left}px`;
    sparkleContainer.style.top = `${rect.top}px`;
    sparkleContainer.style.width = `${rect.width}px`;
    sparkleContainer.style.height = `${rect.height}px`;

    // Create many more sparkles for a magical effect
    for (let i = 0; i < 25; i++) {
      const sparkle = document.createElement("div");
      const size = Math.random() * 3 + 1; // Random size between 1-4px
      sparkle.className = "absolute bg-black rounded-full animate-sparkle";
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.animationDelay = `${Math.random() * 0.8}s`;
      sparkle.style.animationDuration = `${0.8 + Math.random() * 0.7}s`; // Varying durations
      sparkleContainer.appendChild(sparkle);
    }

    // Add some larger sparkles
    for (let i = 0; i < 8; i++) {
      const sparkle = document.createElement("div");
      sparkle.className =
        "absolute w-2 h-2 bg-black rounded-full animate-sparkle";
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.animationDelay = `${Math.random() * 0.6}s`;
      sparkle.style.animationDuration = `${1.2 + Math.random() * 0.5}s`;
      sparkleContainer.appendChild(sparkle);
    }

    document.body.appendChild(sparkleContainer);

    // Remove sparkles after animation
    setTimeout(() => {
      document.body.removeChild(sparkleContainer);
    }, 2000);
  };

  // Reveal CTA after both scrambles complete
  const [headerDone, setHeaderDone] = useState(false);
  const [titleDone, setTitleDone] = useState(false);
  const [subtitleDone, setSubtitleDone] = useState(false);
  const bothDone = titleDone && subtitleDone;

  if (!linkedinData) {
    console.log("TarotReading: No linkedinData, isLoading:", isLoading);
    if (isLoading) return null;
    console.log("TarotReading: Redirecting to home");
    navigate("/");
    return null;
  }

  console.log("TarotReading: Has linkedinData:", !!linkedinData);

  // Show career fortune loading screen while generating readings (not in test)
  if (isGeneratingReadings && !isTestMode()) {
    return (
      <div className={cn(wrapperStyle)}>
        <CareerFortuneLoading linkedinData={linkedinData} />
      </div>
    );
  }

  return (
    <>
      <div className={cn(wrapperStyle)}>
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
                onDone={() => setHeaderDone(true)}
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
                onDone={() => setHeaderDone(true)}
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
                // "hover:scale-105"
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
                    onDone={() => setTitleDone(true)}
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
                        setSubtitleDone(true);
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
                    onDone={() => setSubtitleDone(true)}
                  />
                  <div className="mt-auto w-full">
                    <BlinkButton className="justify-end text-green">
                      Unseal
                    </BlinkButton>
                  </div>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Loading Message */}
        {/* {isGeneratingReadings && <GeneratingReadings />} */}

        {/* Footer Message */}
        {/* Your digital essence has been revealed through the mystical
            convergence of ancient wisdom and modern consciousness. Carry
            these sacred insights as you traverse the liminal spaces between
            digital and spiritual realms. */}
        {cards.every((card) => card.isRevealed && card.isCompleted) && (
          <div
            className={cn(
              "lg:px-12 flex flex-col justify-start lg:min-h-[20vh]",
            )}
          >
            {/* LinkedIn Share Button */}
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
