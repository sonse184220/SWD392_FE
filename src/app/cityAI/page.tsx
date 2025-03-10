"use client";

import { useState } from "react";
import Image from "next/image";
import AiChat from "../chatAI/page";

type CityKey = "daNang" | "daLat" | "quangNinh";

const cities: Record<
  CityKey,
  { name: string; image: string; description: string }
> = {
  daNang: {
    name: "Da Nang",
    image: "/danang/banahill.webp",
    description:
      "Da Nang is a famous coastal city known for Ba Na Hills, the Dragon Bridge, and stunning beaches like My Khe.",
  },
  daLat: {
    name: "Da Lat",
    image: "/dalat/thacdatanla.webp",
    description:
      "Da Lat is the city of a thousand flowers with a cool climate, lush pine forests, and romantic tourist spots like Xuan Huong Lake.",
  },
  quangNinh: {
    name: "Quang Ninh",
    image: "/quangninh/vinhhalong.webp",
    description:
      "Quang Ninh is famous for Ha Long Bay, a UNESCO World Heritage Site with thousands of limestone islands and emerald waters.",
  },
};

const similarPlaces: Record<
  CityKey,
  { name: string; image: string; description: string }[]
> = {
  daNang: [
    {
      name: "Hoi An Ancient Town",
      image: "/danang/phocohoian.webp",
      description:
        "Hoi An is an ancient town with vibrant lantern-lit streets and historic architecture, located about 30km from Da Nang.",
    },
    {
      name: "Ngu Hanh Son",
      image: "/danang/nguhanhson.webp",
      description:
        "Ngu Hanh Son is a cluster of five marble and limestone hills located about 8km from Da Nang city center.",
    },
  ],
  daLat: [
    {
      name: "Langbiang Mountain",
      image: "/dalat/nuilangbiang.webp",
      description:
        "Lang Biang Mountain is the highest peak in Da Lat, offering panoramic views of the city and surrounding countryside.",
    },
    {
      name: "Datanla Waterfall",
      image: "/dalat/thacdatanla.webp",
      description:
        "Datanla Waterfall is a beautiful waterfall located in the heart of Da Lat city, surrounded by lush pine forests.",
    },
  ],
  quangNinh: [
    {
      name: "Bai Chay",
      image: "/quangninh/baichay.webp",
      description:
        "Bai Chay is a popular beach destination with a long sandy shore and clear blue waters.",
    },
    {
      name: "Ha Long Bay",
      image: "/quangninh/vinhhalong.webp",
      description:
        "Ha Long Bay is a UNESCO World Heritage Site with thousands of limestone islands and emerald waters.",
    },
  ],
};

export default function CityPage() {
  const [selectedCity, setSelectedCity] = useState<CityKey>("daNang");

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Main image */}
        <div className="w-full h-[450px] relative rounded-lg shadow-lg overflow-hidden">
          <Image
            src={cities[selectedCity].image}
            alt={cities[selectedCity].name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* City selection dropdown */}
        <div className="flex justify-center mt-6">
          <select
            className="p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value as CityKey)}
          >
            <option value="daNang">Da Nang</option>
            <option value="daLat">Da Lat</option>
            <option value="quangNinh">Quang Ninh</option>
          </select>
        </div>

        {/* City information */}
        <div className="text-center mt-6">
          <h1 className="text-5xl font-extrabold text-gray-800">
            {cities[selectedCity].name}, Vietnam
          </h1>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
            {cities[selectedCity].description}
          </p>
        </div>
      </div>

      <div className="min-h-screen bg-gray-100">
        <div className="max-w-[1500px] w-full mx-auto mt-10 border border-gray-300 rounded-lg shadow-lg p-8 bg-white">
          <div className="overflow-y-auto chat-container">
            <AiChat />
          </div>
        </div>

        {/* Similar places section */}
        <div className="max-w-[1500px] mx-auto px-4 py-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Similar Destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarPlaces[selectedCity].map((place, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={place.image}
                    alt={place.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                    onError={(e) => console.log(`Image failed to load: ${place.image}`)}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {place.name}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm">
                    {place.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}