"use client";

import "./BlockLoader.css";

import * as React from "react";

const SEQUENCES = [
  ["⠁", "⠂", "⠄", "⡀", "⢀", "⠠", "⠐", "⠈"],
  ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"],
  ["▖", "▘", "▝", "▗"],
  ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█", "▇", "▆", "▅", "▄", "▃", "▁"],
  ["▉", "▊", "▋", "▌", "▍", "▎", "▏", "▎", "▍", "▌", "▋", "▊", "▉"],
  ["←", "↖", "↑", "↗", "→", "↘", "↓", "↙"],
  ["┤", "┘", "┴", "└", "├", "┌", "┬", "┐"],
  ["◢", "◣", "◤", "◥"],
  ["◰", "◳", "◲", "◱"],
  ["◴", "◷", "◶", "◵"],
  ["◐", "◓", "◑", "◒"],
  [".", "o", "O", "o"],
];

interface BlockLoaderProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  mode?: number;
}

const BlockLoader: React.FC<BlockLoaderProps> = ({ mode = 0 }) => {
  const isInvalidMode = !SEQUENCES[mode];
  const sequence = isInvalidMode ? SEQUENCES[0] : SEQUENCES[mode];

  const [index, setIndex] = React.useState(0);
  const intervalRef = React.useRef<number | null>(null);
  const indexLength = sequence.length;

  React.useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isInvalidMode) {
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % indexLength);
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [indexLength, isInvalidMode]);

  return (
    <span className="block-loader">
      {isInvalidMode ? "�" : sequence[index]}
    </span>
  );
};

export default BlockLoader;
