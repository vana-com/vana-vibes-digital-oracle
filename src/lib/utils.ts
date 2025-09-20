import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Create a custom twMerge that recognizes all custom selectors using validators
const customTwMerge = extendTailwindMerge({
  extend: {
    theme: {
      colors: ["green", "black", "white"],
    },
    classGroups: {
      "font-size": [
        {
          text: ["label", "button", "subheading"],
        },
      ],
      // Custom font sizes (text-*)
      // text: [
      //   "pill",
      //   "fine",
      //   "small",
      //   "body",
      //   "button",
      //   "large",
      //   "xlarge",
      //   "heading",
      //   "subtitle",
      //   "title",
      //   "super",
      //   "super2",
      // ],
      // Custom border radius values (rounded-*)
      // radius: ["soft", "button", "card", "squish", "sm", "md", "lg", "xl"],
      // Custom spacing values (p-*, m-*, gap-*, etc.)
      // spacing: ["inset", "em", "nav", "footer", "tab", "bar", "button-xs"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
