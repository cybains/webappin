"use client";

import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function WorldMap() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Map
        initialViewState={{
          longitude: 0,
          latitude: 20,
          zoom: 1.5,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      />
    </div>
  );
}
