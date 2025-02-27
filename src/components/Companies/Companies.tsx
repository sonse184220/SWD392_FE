"use client"
import Image from "next/image";
import React, { Component } from "react";
import Slider from "react-slick";

// IMAGES DATA FOR CAROUSEL
interface Data {
    imgSrc: string;
}

const data: Data[] = [
    { imgSrc: "/banahill.webp" },
    { imgSrc: "/nguhanhson.webp" },
    { imgSrc: "/phocohoian.webp" },
    { imgSrc: "/freshgarden.webp" },
    { imgSrc: "/nuilangbiang.webp" },
    { imgSrc: "/thacdatanla.webp" },
    { imgSrc: "/vinhhalong.webp" },
    { imgSrc: "/baichay.webp" }
];

// CAROUSEL SETTINGS
export default class MultipleItems extends Component {
    render() {
        const settings = {
            dots: false,
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            arrows: false,
            autoplay: true,
            speed: 2000,
            autoplaySpeed: 2000,
            cssEase: "linear",
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 700,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 500,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                }
            ]
        };

        return (
            <div className="text-center">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="py-14">
                        <Slider {...settings}>
                            {data.map((item, i) => (
                                <div key={i} className="px-2">
                                    <div className="w-[180px] mx-auto relative rounded-lg overflow-hidden shadow-lg">
                                        <Image
                                            src={item.imgSrc}
                                            alt={`Image ${i + 1}`}
                                            width={180}
                                            height={200}
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <hr />
                </div>
            </div>
        );
    }
}
