// import bgImage from "@/assets/space-destiny.png";
// import bgImage from "@/assets/moon.jpg";
// import bgImage from "@/assets/nasa-5477L9Z5eqI-unsplash.jpg";
// import bgImage from "@/assets/red.png";
// import bgImage from "@/assets/sun-river.jpeg";
import bgImage from "@/assets/cloud-vortex.webp";

export const ScreenWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-dvh bg-black relative overflow-hidden isolate">
      <div className="absolute inset-0 -z-10 w-full h-full object-cover transform-gpu will-change-transform origin-center animate-[earth-approach_30s_linear_forwards]">
        {/* Gradient to improve text legibility — turned off for now */}
        {/* <div className="absolute inset-0 bottom-1/2 bg-gradient-to-b from-black/90 from-0% opacity-70 pointer-events-none"></div> */}
        <img
          src={bgImage}
          alt="Approaching destiny"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      {children}
      <style>{`
        @keyframes earth-approach {
          0% { transform: scale(1.15) rotate(-4deg); }
          100% { transform: scale(1.6) rotate(0.2deg); }
        }
      `}</style>
    </div>
  );
};
