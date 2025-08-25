"use client";

import { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import Footer from "@/components/Footer";

const NUM_MARKERS = 100;

function getSmartCoordinates(): [number, number] {
  const lat = Math.random() * 120 - 50;
  const lng = Math.random() * 360 - 180;
  return [lng, lat];
}

function jitter([lng, lat]: [number, number]): [number, number] {
  const deltaLat = (Math.random() - 0.5) * 0.2;
  const deltaLng = (Math.random() - 0.5) * 0.2;
  return [lng + deltaLng, lat + deltaLat];
}

export default function MapTest() {
  const [positions, setPositions] = useState(
    Array.from({ length: NUM_MARKERS }, (_, i) => ({
      id: i,
      coordinates: getSmartCoordinates(),
    }))
  );

  const [popupIndex, setPopupIndex] = useState<number | null>(null);

  const popupFacts = [
  "🌉 Tokyo: Tokyo has the world’s busiest pedestrian crossing at Shibuya, where up to 3,000 people cross at once during peak times. Japan has more pets than children, with around 17 million pets compared to 15 million children under 15 years old.",
  "🚇 Delhi: Delhi’s metro system is the world’s longest operational metro network in a single country. India hosts the Kumbh Mela, the largest human gathering on Earth, attracting over 100 million people over weeks.",
  "🏦 Shanghai: Shanghai’s Bund was nicknamed the “Wall Street of the East” for its 1920s financial importance. China owns the world’s largest high-speed rail network — more than 40,000 km.",
  "🚁 São Paulo: São Paulo has the highest number of helicopters worldwide. Brazil contains about 60% of the Amazon rainforest, the largest rainforest on Earth.",
  "🌆 Mexico City: Mexico City is sinking 10 cm per year as it’s built on a drained lakebed. Mexico introduced chocolate, chilies, and corn to the world.",
  "🏙 Cairo: Cairo’s population density is extremely high, with some areas housing up to 50,000 people per sq km. Egypt is home to the oldest known dress, dating back over 5,000 years.",
  "🏚 Mumbai: Mumbai has Asia’s largest slum, Dharavi, a hub for small-scale recycling and industry. India has the world’s largest postal network with over 150,000 post offices.",
  "🏯 Beijing: Beijing’s Forbidden City is the largest ancient palace worldwide with 980 buildings. China’s Great Wall is a series of walls stretching over 21,000 km.",
  "🌆 Dhaka: Dhaka is one of the world’s most densely populated cities, over 44,000 people per sq km. Bangladesh is the world’s second-largest textile producer after China.",
  "🍜 Osaka: Osaka was once Japan’s economic capital. Japan has the most vending machines per capita, about one for every 23 people.",
  "🗽 New York City: NYC’s Central Park is larger than Monaco. The USA has no official federal language, though English is de facto.",
  "⚓ Karachi: Karachi hosts one of the largest, busiest Arabian Sea seaports. Pakistan is home to the world’s highest paved international road, the Karakoram Highway.",
  "🎭 Buenos Aires: Buenos Aires is called the “Paris of South America” for its European-style architecture. Argentina first used fingerprinting in criminal identification.",
  "🏙 Chongqing: Chongqing covers over 80,000 sq km, roughly Austria’s size. China invented paper over 2,000 years ago during the Han Dynasty.",
  "🌉 Istanbul: Istanbul uniquely spans two continents, Europe and Asia. Turkey hosts the world’s oldest human settlement, Göbekli Tepe, 11,000 years old.",
  "🏛 Kolkata: Kolkata was British India’s capital until 1911. India produces more films annually than any other country, the world’s largest film industry.",
  "🏙 Manila: Manila has the world’s oldest Chinatown, Binondo (est. 1594). The Philippines is the largest global supplier of nurses.",
  "🌉 Lagos: Lagos is a collection of islands connected by 20+ bridges and ferries. Nigeria has Africa’s largest economy and is the world’s biggest cassava producer.",
  "⛪ Rio de Janeiro: Rio’s Christ the Redeemer statue took 9 years to build with reinforced concrete and soapstone. Brazil has the largest carnival participation worldwide.",
  "🏛 Tianjin: Tianjin has the largest colonial-era European architectural area in China, known as “Little Paris.” China’s silk production has lasted over 4,000 years.",
  "🏙 Kinshasa: Kinshasa is the third-largest French-speaking city globally after Paris and Abidjan. The DRC holds 50% of the world’s coltan reserves, critical for electronics.",
  "🌸 Guangzhou: Guangzhou hosts the world’s largest flower market. China is the largest global consumer of pork.",
  "🚗 Los Angeles: LA’s sprawl would take 5 hours to drive across in low traffic. The USA leads world production of corn and soybeans.",
  "🚇 Moscow: Moscow’s metro stations are called “underground palaces” for their design. Russia spans 11 time zones, more than any other country.",
  "🏙 Shenzhen: Shenzhen grew from a fishing village to China’s first Special Economic Zone and a megacity in 40 years. China leads in electric vehicle production and sales.",
];

const factCoordinates: [number, number][] = [
  [139.6917, 35.6895],   // Tokyo
  [77.1025, 28.7041],    // Delhi
  [121.4737, 31.2304],   // Shanghai
  [-46.6333, -23.5505],  // São Paulo
  [-99.1332, 19.4326],   // Mexico City
  [31.2357, 30.0444],    // Cairo
  [72.8777, 19.076],     // Mumbai
  [116.4074, 39.9042],   // Beijing
  [90.4125, 23.8103],    // Dhaka
  [135.5023, 34.6937],   // Osaka
  [-73.935242, 40.73061],// New York City
  [66.9905, 24.8607],    // Karachi
  [-58.4173, -34.6118],  // Buenos Aires
  [106.5516, 29.563],    // Chongqing
  [28.9784, 41.0082],    // Istanbul
  [88.3639, 22.5726],    // Kolkata
  [120.9842, 14.5995],   // Manila
  [3.3792, 6.5244],      // Lagos
  [-43.1729, -22.9068],  // Rio de Janeiro
  [117.3616, 39.3434],   // Tianjin
  [15.2663, -4.4419],    // Kinshasa
  [113.2644, 23.1291],   // Guangzhou
  [-118.2437, 34.0522],  // Los Angeles
  [37.6173, 55.7558],    // Moscow
  [114.0579, 22.5431],   // Shenzhen
];

useEffect(() => {
  // Helper: Fisher-Yates shuffle to randomize popup order each cycle
  function shuffleArray(arr: number[]) {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const customTimings = [
    { delayBeforeShow: 2000, visibleDuration: 5000 }, // 1st popup: delay 2s, visible 2.5s
    { delayBeforeShow: 2000, visibleDuration: 5000 }, // 2nd popup: delay 2s, visible 3s
    { delayBeforeShow: 3000, visibleDuration: 5000 }, // 3rd popup: delay 3s, visible 2s
  ];

  let popupOrder = shuffleArray(popupFacts.map((_, i) => i));
  let index = 0;

  const cyclePopups = () => {
    const currentPopup = popupOrder[index];
    setPopupIndex(currentPopup);

    const isFirstThree = index < 3;
    const { delayBeforeShow, visibleDuration } = isFirstThree
      ? customTimings[index]
      : {
          delayBeforeShow: 5000 + Math.random() * 2000, // random between 3-5 seconds
          visibleDuration: 5000,
        };

    setTimeout(() => {
      setPopupIndex(null);

      index++;
      if (index >= popupOrder.length) {
        popupOrder = shuffleArray(popupFacts.map((_, i) => i)); // reshuffle on full cycle
        index = 0;
      }

      setTimeout(cyclePopups, delayBeforeShow);
    }, visibleDuration);
  };

  cyclePopups();
}, []);



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
    <>
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

        {popupIndex !== null && (
          <Popup
            longitude={factCoordinates[popupIndex][0]}
            latitude={factCoordinates[popupIndex][1]}
            anchor="bottom"
            closeButton={false}
            closeOnClick={false}
            focusAfterOpen={false}
            offset={[0, 10]}
            className="!p-0 bg-transparent shadow-none"
          >
            <div className="relative px-4 py-2 text-sm sm:text-base font-medium text-gray-800 max-w-[220px] bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl animate-fadeIn">
              <span className="block text-center leading-snug">
                {popupFacts[popupIndex]}
              </span>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/80 border-l border-b border-gray-200 rotate-45 shadow-md" />
            </div>
          </Popup>
        )}
      </Map>

      {/* Optional overlay for softness */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-full z-10 bg-gradient-to-b from-white/80 via-white/10 to-transparent" />
    </div>
    <Footer />
    </>
  );
}
