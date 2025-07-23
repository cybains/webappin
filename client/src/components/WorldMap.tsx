"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

// 🔑 Replace with your Mapbox token
mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";

export default function WorldMap() {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current as HTMLElement,
      style: "mapbox://styles/mapbox/light-v10", // You can change theme
      center: [0, 20], // Longitude, Latitude
      zoom: 1.2,
      interactive: false, // disable zoom/pan for visual background
    });

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      className="absolute inset-0 -z-10 opacity-20 pointer-events-none"
    />
  );
}
