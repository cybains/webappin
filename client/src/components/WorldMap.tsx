"use client";

import WorldMap from "react-world-map";
import { useState } from "react";

export default function InteractiveWorldMap() {
  const [selected, setSelected] = useState<string>("");

  return (
    <WorldMap
      selected={selected}
      onClickFunction={(geo) => setSelected(geo)}
      style={{ width: "100%", height: "100%" }} // ensure it fills container
    />
  );
}
