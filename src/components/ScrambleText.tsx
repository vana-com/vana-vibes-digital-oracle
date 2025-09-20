import React, { useEffect, useMemo, useRef, useState } from "react";
import { useScramble } from "use-scramble";

interface ScrambleTextProps extends React.HTMLAttributes<HTMLElement> {
  text: string;
  delayMs?: number;
  as?: React.ElementType;
  speed?: number;
  step?: number;
  scramble?: number;
  chance?: number;
  seed?: number;
  range?: [number, number];
  overdrive?: boolean;
  overflow?: boolean;
  onDone?: () => void;
}

/**
 * Lightweight wrapper around use-scramble with a delayed start.
 * Defaults are tuned for a subtle decode vibe with slight re-scramble.
 */
const ScramblingElement: React.FC<ScrambleTextProps> = ({
  text,
  as,
  speed = 0.6,
  step = 1,
  scramble = 3,
  chance = 0.75,
  seed = 2,
  range = [48, 126],
  overdrive = true,
  overflow = true,
  onDone,
  className,
  ...rest
}) => {
  const Element = useMemo<React.ElementType>(() => as || "span", [as]);

  const { ref } = useScramble({
    playOnMount: true,
    text,
    speed,
    step,
    scramble,
    chance,
    seed,
    range,
    overdrive,
    overflow,
    onAnimationEnd: () => {
      if (onDone) onDone();
    },
  });

  return (
    <Element
      ref={ref as unknown as React.Ref<HTMLElement>}
      className={className}
      {...rest}
    />
  );
};

const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  delayMs = 600,
  as = "span",
  className,
  speed = 0.6,
  step = 1,
  scramble = 3,
  chance = 0.75,
  seed = 2,
  range = [48, 126],
  overdrive = true,
  overflow = true,
  onDone,
  ...rest
}) => {
  const Element = useMemo<React.ElementType>(() => as || "span", [as]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setMounted(true),
      Math.max(0, delayMs),
    );
    return () => window.clearTimeout(timer);
  }, [delayMs]);

  if (!mounted) {
    return (
      <Element
        className={className}
        style={{
          ...(typeof (rest as { style?: React.CSSProperties }).style ===
          "object"
            ? (rest as { style?: React.CSSProperties }).style!
            : {}),
          opacity: 0,
        }}
        {...rest}
      >
        {text}
      </Element>
    );
  }

  return (
    <ScramblingElement
      {...{
        text,
        as,
        speed,
        step,
        scramble,
        chance,
        seed,
        range,
        overdrive,
        overflow,
        onDone,
        className,
        ...rest,
      }}
    />
  );
};

export default ScrambleText;
