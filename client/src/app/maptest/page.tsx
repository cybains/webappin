"use client";

import { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

const NUM_MARKERS = 100;

// Latitude: -50 to +70 (avoiding Antarctica and North Pole)
function getSmartCoordinates(): [number, number] {
  const lat = Math.random() * 120 - 50; // -50 to +70
  const lng = Math.random() * 360 - 180; // -180 to +180
  return [lng, lat];
}

// Gentle jitter with explicit return type as tuple [number, number]
function jitter([lng, lat]: [number, number]): [number, number] {
  const deltaLat = (Math.random() - 0.5) * 0.2;
  const deltaLng = (Math.random() - 0.5) * 0.2;
  return [lng + deltaLng, lat + deltaLat];
}

export default function MapTest() {
  const [positions, setPositions] = useState<
    { id: number; coordinates: [number, number] }[]
  >(
    Array.from({ length: NUM_MARKERS }, (_, i) => ({
      id: i,
      coordinates: getSmartCoordinates(),
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((marker) => ({
          ...marker,
          coordinates: jitter(marker.coordinates),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen">
      <Map
        initialViewState={{
          longitude: 0,
          latitude: 20,
          zoom: 1.2,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://demotiles.maplibre.org/style.json"
      >
        {positions.map((pos) => (
          <Marker
            key={pos.id}
            longitude={pos.coordinates[0]}
            latitude={pos.coordinates[1]}
            anchor="center"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full opacity-80" />
          </Marker>
        ))}
      </Map>

      {/* Transparent gradient overlay on top */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-full z-10 bg-gradient-to-b from-white/90 via-white/10 to-transparent" />
    </div>
  );
}
