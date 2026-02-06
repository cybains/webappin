"use client";

import * as React from "react";

type StructuralGridBandProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

export function StructuralGridBand<T extends React.ElementType = "div">({
  as,
  className = "",
  children,
  ...rest
}: StructuralGridBandProps<T>) {
  const Element = as ?? "div";

  return (
    <Element className={`structural-grid-band ${className}`} {...rest}>
      {children}
    </Element>
  );
}
