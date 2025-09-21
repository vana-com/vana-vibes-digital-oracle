export const createSparkles = (element: Element) => {
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
