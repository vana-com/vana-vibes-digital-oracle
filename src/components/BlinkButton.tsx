import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { MoveRightIcon } from "lucide-react";

type BlinkButtonProps<T extends React.ElementType = "button"> = {
  as?: T;
  children: React.ReactNode;
  icon?: React.ElementType<{ className?: string }>;
  className?: string;
} & React.ComponentPropsWithRef<T>;

const BlinkButton = forwardRef(
  <T extends React.ElementType = "button">(
    {
      as: Component = "button",
      children,
      icon = MoveRightIcon,
      className,
      ...props
    }: BlinkButtonProps<T>,
    ref: React.ForwardedRef<React.ElementRef<T>>,
  ) => {
    const Icon = icon;
    const isNativeButton =
      typeof Component === "string" && Component.toLowerCase() === "button";
    const defaultButtonType =
      isNativeButton && !(props as unknown as { type?: string }).type
        ? { type: "button" as const }
        : {};
    return (
      <Component
        ref={ref}
        className={cn(
          "w-full text-button inline-flex items-center justify-start gap-2",
          // Keep hidden during the delay. The animation then overrides.
          "opacity-0 animate-blink-in",
          "disabled:opacity-100",
          className,
        )}
        style={{ animationDelay: "800ms" }}
        {...defaultButtonType}
        {...props}
      >
        <span className="text-[1.25em]">[</span>
        {children}
        <Icon className="size-[1em]" />
        <span className="text-[1.25em]">]</span>
      </Component>
    );
  },
);

BlinkButton.displayName = "BlinkButton";

export { BlinkButton };
