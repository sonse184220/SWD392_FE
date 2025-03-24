"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AiChat from "../../chatAI/page"
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { useAuth } from "@/hooks/useAuth";
import { notFound } from "next/navigation";
export default function CityPage() {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const { isAuthenticated, user, token } = useAuth();

  const images = [
    "/danang/phocohoian.webp",
    "/danang/banahill.webp",
    "/dalat/nuilangbiang.webp",
    "/quangninh/vinhhalong.webp"
  ];

  if (!isAuthenticated && user?.role !== "User") {
    // router.push("/");
    return notFound();
  }

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
      </div>

      <div className="flex justify-center my-6">
        <h1 className="text-4xl font-bold text-center">CityScout AI</h1>
      </div>


      <div className="min-h-screen bg-gray-100">
        <div className="max-w-[1500px] w-full mx-auto mt-10 border border-gray-300 rounded-lg shadow-lg p-8 bg-white">
          <div className="overflow-y-auto chat-container">
            <AiChat />
          </div>
        </div>
      </div>

    </>
  );
}
