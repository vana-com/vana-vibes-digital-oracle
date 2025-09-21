// import bgImage from "@/assets/space-destiny.png";
// import bgImage from "@/assets/moon.jpg";
// import bgImage from "@/assets/nasa-5477L9Z5eqI-unsplash.jpg";
// import bgImage from "@/assets/red.png";
import bgImage from "@/assets/star-spatter.jpg";
import { cn } from "@/lib/utils";

export const ScreenReadingWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-dvh bg-gradient-midnight relative overflow-hidden">
      <div
        className={cn(
          "fixed inset-0 w-full h-full object-cover",
          // "transform-gpu will-change-transform origin-center",
          // "animate-[earth-approach_30s_linear_forwards]",
        )}
      >
        <img
          src={bgImage}
          alt="Approaching destiny"
          // rotate-180
          className="absolute inset-0 w-full object-cover h-screen grayscale"
        />
        <div
          className={cn(
            "fixed inset-0",
            "bg-black/50",
            // "bg-gradient-to-b from-black/90 from-0% opacity-70",
          )}
        ></div>
      </div>
      {children}
      <style>{`
        @keyframes earth-approach {
          0% { transform: scale(1.1) rotate(-3deg); }
          100% { transform: scale(1.25) rotate(0.2deg); }
        }
      `}</style>
    </div>
  );
};
