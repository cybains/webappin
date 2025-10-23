"use client";

import * as React from "react";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

type ButtonVariant = "default" | "secondary" | "outline";
type ButtonSize = "default" | "lg";

const variantClasses: Record<ButtonVariant, string[]> = {
  default: [
    "bg-primary text-primary-foreground hover:bg-primary/90",
    "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:brightness-95",
  ],
  secondary: [
    "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    "bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)] hover:brightness-95",
  ],
  outline: [
    "border border-[color:var(--card-border)] bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--card)]",
  ],
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2 text-sm",
  lg: "h-12 px-6 text-base",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60";

    const chosenVariant = variantClasses[variant] ?? variantClasses.default;
    const chosenSize = sizeClasses[size] ?? sizeClasses.default;

    return (
      <button
        ref={ref}
        className={cn(baseClasses, ...chosenVariant, chosenSize, className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
