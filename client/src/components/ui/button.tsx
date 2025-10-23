"use client";

import * as React from "react";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

const variantStyles: Record<string, string> = {
  default: "bg-primary text-[color:var(--background)] hover:bg-primary/90",
  secondary: "bg-secondary text-[color:var(--background)] hover:bg-secondary/90",
  outline:
    "border border-[color:var(--card-border)] bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--card)]",
};

const sizeStyles: Record<string, string> = {
  default: "h-10 px-4 py-2 text-sm",
  lg: "h-12 px-6 text-base",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60";

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant] ?? variantStyles.default, sizeStyles[size] ?? sizeStyles.default, className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
