"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AiChat from "../chatAI/page";
import { getCityList } from "@/services/cityService";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
interface City {
  name: string;
  image: string;
  description: string;
  similarPlaces?: { name: string; image: string; description: string }[];
}

const popularPlaces = [
  {
    name: "Halong Bay",
    image: "/quangninh/vinhhalong.webp",
    description: "A stunning natural wonder in northern Vietnam with emerald waters and limestone islands."
  },
  {
    name: "Banahills",
    image: "/danang/banahill.webp",
    description: "A hill station and resort in the Truong Son Mountains near Da Nang."},
  {
    name: "Da Lat",
    image: "/dalat/thacdatanla.webp",
    description: "A city in the Central Highlands region of Vietnam known for its cool climate and French colonial architecture."}
];

export default function CityPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Fetch cities when component mounts
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getCityList();
        if (response.status === 200) {
          setCities(response.data);
          // Set default selected city as the first city in the list
          if (response.data.length > 0) {
            setSelectedCity(response.data[0].name);
          }
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  const currentCity = cities.find(city => city.name === selectedCity);
  const images = [
    "/danang/phocohoian.webp",
    "/danang/banahill.webp",
    "/dalat/nuilangbiang.webp",
    "/quangninh/vinhhalong.webp"
  ];
  return (
    <>
      <div className="max-w-8xl mx-auto px-4 py-10">
        {/* Main image */}
        <div className="w-full h-[600px] relative rounded-lg shadow-lg overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        effect="fade"
        className="w-full h-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            <Image src={src} alt={`Slide ${index + 1}`} layout="fill" objectFit="cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>

        {/* City selection dropdown */}
        <div className="flex justify-center mt-6">
          <select
            className="p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* City information */}
        <div className="text-center mt-6">
          <h1 className="text-5xl font-extrabold text-gray-800">
            {currentCity?.name || "Loading..."}, Vietnam
          </h1>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
            {currentCity?.description || "Loading description..."}
          </p>
        </div>
      </div>

      <div className="min-h-screen bg-gray-100">
        <div className="max-w-[1500px] w-full mx-auto mt-10 border border-gray-300 rounded-lg shadow-lg p-8 bg-white">
          <div className="overflow-y-auto chat-container">
            <AiChat />
          </div>
        </div>

        <div className="max-w-[1500px] mx-auto px-4 py-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Popular Places</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularPlaces.map((place, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={place.image}
                    alt={place.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">{place.name}</h3>
                  <p className="text-gray-600 mt-2 text-sm">{place.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}