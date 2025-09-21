import { useState } from "react";
import ScrambleText from "./ScrambleText";
import { cn } from "@/lib/utils";
import { BlinkButton } from "./BlinkButton";

export const LandingCard = ({ handleAccept }: { handleAccept: () => void }) => {
  // Reveal CTA after both scrambles complete
  const [titleDone, setTitleDone] = useState(false);
  const [subtitleDone, setSubtitleDone] = useState(false);
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);
  const bothDone =
    titleDone && subtitleDone && step1Done && step2Done && step3Done;

  return (
    <div
      className={cn(
        "border-2 border-green lg:w-3/4 min-h-[50vh]",
        "grid grid-rows-[auto_auto_1fr]",
        // Many possibilities here, but this is what we're going with relative to the chosen ScreenWrapper image
        "bg-green/0 mix-blend-color-dodge",
      )}
    >
      <div className="p-2 lg:p-4">
        <ScrambleText
          as="h1"
          className="text-title text-green"
          text="Digital Oracle"
          delayMs={1000}
          speed={0.25}
          scramble={2}
          chance={0.8}
          step={1}
          overdrive
          onDone={() => setTitleDone(true)}
        />
      </div>
      <div className="p-2 lg:p-4">
        <ScrambleText
          as="h2"
          className="text-subheading text-green"
          text="Decode the mystical patterns in your career."
          delayMs={1250}
          speed={0.25}
          scramble={1}
          chance={0.8}
          step={1}
          overdrive
          onDone={() => setSubtitleDone(true)}
        />
      </div>
      <div className="p-2 lg:p-4">
        <ScrambleText
          as="div"
          className="text-label text-green"
          text="█ Grant access to your LinkedIn aura"
          delayMs={2500}
          speed={0.5}
          scramble={1}
          chance={0.8}
          step={2}
          overdrive
          onDone={() => setStep1Done(true)}
        />
        <ScrambleText
          as="div"
          className="text-label text-green"
          text="█ Oracle channels your career essence"
          delayMs={2750}
          speed={0.5}
          scramble={1}
          chance={0.8}
          step={2}
          overdrive
          onDone={() => setStep2Done(true)}
        />
        <ScrambleText
          as="div"
          className="text-label text-green"
          text="█ Witness the revelation of your professional destiny"
          delayMs={3000}
          speed={0.5}
          scramble={1}
          chance={0.8}
          step={2}
          overdrive
          onDone={() => setStep3Done(true)}
        />
      </div>
      <div
        className={cn(
          "mt-auto",
          "p-2 lg:p-4 min-h-[28px] flex justify-en",
          bothDone && "border-t-2 border-green",
        )}
      >
        {bothDone ? (
          <BlinkButton
            onClick={handleAccept}
            className="justify-end text-green"
          >
            Accept
          </BlinkButton>
        ) : null}
      </div>
    </div>
  );
};
