"use client";

import { getRecommendation } from "@/services/geminiAIService";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { saveData } from "@/lib/dbIndex";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Unauthorized from "@/app/reusePages/unauthorized";


type CulturalData = {
    events: string[];
    cultural: {
        places: string[];
    };
};

interface Destination {
    destinationId: number;
    name: string;
    address: string;
    description: string;
    rate: number;
    imageUrls: string[];
    events: string[];
    cultural: {
        foods: [];
        places: [];
    };
    imageUrl?: string;
}

interface CityTab {
    id: string;
    name: string;
    cityId: number;
}


interface District {
    districtId: number;
    name: string;
    cityId: number;
}

const Cultural: React.FC = () => {
    const { isAuthenticated, user, token } = useAuth();

    const [data, setData] = useState<CulturalData | null>(null);
    const [currentTab, setCurrentTab] = useState("tabOne");
    const [destinationList, setDestinationList] = useState<Destination[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [firstRender, setFirstRender] = useState(true);
    const [hasSearched, setHasSearched] = useState(false);

    const [selectedCity, setSelectedCity] = useState<CityTab | null>({ id: "tabOne", name: "TP.Ho Chi Minh", cityId: 1 });
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

    const cityTabs: CityTab[] = [
        { id: "tabOne", name: "TP.Ho Chi Minh", cityId: 1 },
        { id: "tabTwo", name: "Da Lat", cityId: 2 },
        { id: "tabThree", name: "Nha Trang", cityId: 3 }
    ];

    const districts: District[] = [
        // TP.Ho Chi Minh
        { districtId: 1, cityId: 1, name: "District 1" },
        { districtId: 2, cityId: 1, name: "District 2" },
        { districtId: 3, cityId: 1, name: "District 3" },
        { districtId: 4, cityId: 1, name: "District 4" },
        { districtId: 5, cityId: 1, name: "District 5" },
        { districtId: 6, cityId: 1, name: "District 6" },
        { districtId: 7, cityId: 1, name: "District 7" },
        { districtId: 8, cityId: 1, name: "District 8" },
        { districtId: 9, cityId: 1, name: "District 9" },
        { districtId: 10, cityId: 1, name: "District 10" },
        { districtId: 11, cityId: 1, name: "District 11" },
        { districtId: 12, cityId: 1, name: "District 12" },
        { districtId: 13, cityId: 1, name: "Binh Thanh District" },
        { districtId: 14, cityId: 1, name: "Phu Nhuan District" },
        { districtId: 15, cityId: 1, name: "Thu Duc City" },
        { districtId: 16, cityId: 1, name: "Tan Binh District" },
        { districtId: 17, cityId: 1, name: "Tan Phu District" },
        { districtId: 18, cityId: 1, name: "Go Vap District" },
        { districtId: 19, cityId: 1, name: "Binh Tan District" },
        { districtId: 20, cityId: 1, name: "Cu Chi District" },
        { districtId: 21, cityId: 1, name: "Hoc Mon District" },
        { districtId: 22, cityId: 1, name: "Nha Be District" },
        { districtId: 23, cityId: 1, name: "Can Gio District" },

        // Da Lat
        { districtId: 24, cityId: 2, name: "Ward 1 - Da Lat" },
        { districtId: 25, cityId: 2, name: "Ward 2 - Da Lat" },
        { districtId: 26, cityId: 2, name: "Ward 3 - Da Lat" },
        { districtId: 27, cityId: 2, name: "Ward 4 - Da Lat" },
        { districtId: 28, cityId: 2, name: "Xuan Huong Lake Area" },
        { districtId: 29, cityId: 2, name: "Tuyen Lam Lake Area" },
        { districtId: 30, cityId: 2, name: "Dalat Night Market" },
        { districtId: 31, cityId: 2, name: "Langbiang Mountain" },
        { districtId: 32, cityId: 2, name: "Truc Lam Zen Monastery" },
        { districtId: 33, cityId: 2, name: "Bao Dai Palace" },
        { districtId: 34, cityId: 2, name: "Love Valley" },
        { districtId: 35, cityId: 2, name: "Dalat Flower Park" },
        { districtId: 36, cityId: 2, name: "Cam Ly Waterfall" },

        // Nha Trang
        { districtId: 37, cityId: 3, name: "Nha Trang Center" },
        { districtId: 38, cityId: 3, name: "Vinh Hai" },
        { districtId: 39, cityId: 3, name: "Vinh Truong" },
        { districtId: 40, cityId: 3, name: "Ninh Hoa" },
        { districtId: 41, cityId: 3, name: "Cam Ranh Bay Area" },
        { districtId: 42, cityId: 3, name: "Hon Chong" },
        { districtId: 43, cityId: 3, name: "Vinpearl Island" },
        { districtId: 44, cityId: 3, name: "Po Nagar Cham Towers" },
        { districtId: 45, cityId: 3, name: "Dam Market" },
        { districtId: 46, cityId: 3, name: "Hon Tre Island" },
        { districtId: 47, cityId: 3, name: "Hon Mun Island" },
        { districtId: 48, cityId: 3, name: "Bai Dai Beach" },
        { districtId: 49, cityId: 3, name: "Thap Ba Hot Springs" },
        { districtId: 50, cityId: 3, name: "Diep Son Island" }
    ];

    const filteredDistricts = selectedCity
        ? districts.filter(d => d.cityId === selectedCity.cityId)
        : [];

    const handleTabChange = (tabId: string) => {
        const selectedCityForTab = cityTabs.find(tab => tab.id === tabId) || cityTabs[0];

        setCurrentTab(tabId);
        setSelectedCity(selectedCityForTab);
        setSelectedDistrict(null); // Reset selected district
        setDestinationList([]); // Clear previous search results
        setHasSearched(false); // Reset search state when changing cities
    };

    const handleSearch = async () => {
        try {

            if (!selectedCity) {
                alert("Please select a city.");
                return;
            }

            setHasSearched(true); // Mark as searched
            setIsLoading(true);

            const cityName = selectedCity.name;
            const districtName = selectedDistrict?.name || "all districts";
            const prompt = `List 3 places with related events and cultural to visit in ${cityName}, ${districtName}.`;
            const safeToken = token ?? "";
            const response = await getRecommendation(safeToken, prompt);
            console.log("ne" + Date.now.toString + response)

            if (response.status === 200 && response.data.response) {
                setDestinationList(
                    response.data.response.map((destination: any) => ({
                        destinationId: destination.destinationId ?? destination.id,
                        name: destination.destinationName ?? destination.name,
                        address: destination.address ?? "No address provided",
                        description: destination.description ?? "No description available",
                        rate: destination.rate ?? 0,
                        imageUrls: destination.imageUrls ?? [],
                        events: destination.events ?? [],
                        cultural: {
                            foods: destination.cultural?.foods ?? [],
                            places: destination.cultural?.places ?? []
                        }
                    }))
                );

                await saveData(response.data.response, safeToken);
            }
        } catch (error) {
            console.error("Error fetching destinations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated && user?.role !== "User") {
        // router.push("/");
        return <Unauthorized />;
    }

    return (
        <>
            <section className="relative pb-20 pt-18.5 overflow-hidden lg:pb-25 xl:pb-30 bg-white dark:bg-gray-900  p-6 rounded-xl shadow-md m-5">
                <div className="relative mx-auto max-w-c-1390 px-4 md:px-6 2xl:px-0">
                    <div className="absolute -top-16 -z-1 mx-auto h-[300px] w-[95%]">
                        <Image
                            fill
                            className="dark:hidden"
                            src="/images/shape/shape-dotted-light.svg"
                            alt="Dotted Shape"
                        />
                        <Image
                            fill
                            className="hidden dark:block"
                            src="/images/shape/shape-dotted-dark.svg"
                            alt="Dotted Shape"
                        />
                    </div>

                    {/* <!-- Tab Menues Start --> */}
                    <motion.div
                        variants={{
                            hidden: {
                                opacity: 0,
                                y: -20,
                            },

                            visible: {
                                opacity: 1,
                                y: 0,
                            },
                        }}
                        initial="hidden"
                        whileInView="visible"
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="animate_top mb-15 flex flex-wrap justify-center rounded-[10px] border border-stroke bg-white shadow-solid-5 dark:border-strokedark dark:bg-blacksection dark:shadow-solid-6 md:flex-nowrap md:items-center lg:gap-7.5 xl:mb-21.5 xl:gap-12.5"
                    >
                        {cityTabs.map((tab) => (
                            <div
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`relative flex w-full cursor-pointer items-center gap-4 border-b border-stroke px-6 py-2 dark:border-strokedark md:w-auto md:border-0 xl:px-13.5 xl:py-5 ${currentTab === tab.id ? "active before:absolute before:bottom-0 before:left-0 before:h-1 before:w-full before:bg-primary" : ""
                                    }`}
                            >
                                <div className="flex h-12.5 w-12.5 items-center justify-center rounded-[50%] border border-stroke dark:border-strokedark dark:bg-blacksection">
                                    <p className="text-metatitle3 font-medium text-black dark:text-white">
                                        {cityTabs.indexOf(tab) + 1}
                                    </p>
                                </div>
                                <button className="text-sm font-medium text-black dark:text-white xl:text-regular">
                                    {tab.name}
                                </button>
                            </div>
                        ))}

                        {/* Filter Section */}

                    </motion.div>
                    {/* <!-- Tab Menues End --> */}
                    <div className="mb-6 flex flex-wrap gap-4 items-center justify-center">
                        {/* District Selection */}
                        <div className="w-64 md:w-80">
                            <Autocomplete
                                options={filteredDistricts}
                                getOptionLabel={(option) => option.name}
                                value={selectedDistrict}
                                onChange={(event, newValue) => setSelectedDistrict(newValue)}
                                renderInput={(params) => <TextField {...params} label="District" />}
                                disabled={!selectedCity}
                            />
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                        >
                            Search
                        </button>
                    </div>

                    {/* <!-- Tab Content Start --> */}
                    {/* <!-- Tab Content Start --> */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: -20 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        initial="hidden"
                        whileInView="visible"
                        transition={{ duration: 0.5, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="animate_top mx-auto max-w-c-1154"
                    >
                        <div>
                            {/* Loading State */}
                            {isLoading ? (
                                <div className="text-center text-gray-500">
                                    <span className="loading loading-dots loading-xl"></span>
                                </div>
                            ) : hasSearched ? (
                                destinationList.length > 0 ? (
                                    destinationList.map((destination) => (
                                        <div className="flex justify-center space-x-10" key={destination.destinationId}>
                                            {/* Destination Info */}
                                            <div className="w-1/3 mb-6 p-4 border rounded-lg shadow-md dark:border-strokedark">
                                                <Link href={`/user/destinations/destination-details/${destination.destinationId}`}>

                                                    <h3
                                                        //  className="text-xl font-semibold"
                                                        className="mb-7 text-3xl font-bold text-black dark:text-white xl:text-sectiontitle2"
                                                    >{destination.name}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{destination.address}</p>
                                                    <p className="mt-2 text-gray-700 dark:text-gray-300">{destination.description}</p>
                                                    {/* {destination.imageUrls.length > 0 && ( */}
                                                    <Image
                                                        // src={destination.imageUrls[0]}

                                                        src={
                                                            destination.imageUrl
                                                                ? destination.imageUrl
                                                                : Array.isArray(destination.imageUrls) && destination.imageUrls.length > 0
                                                                    ? destination.imageUrls[0]
                                                                    : "/travel4K.jpg"
                                                        }
                                                        alt={destination.name}
                                                        width={500}
                                                        height={300}
                                                        className="mt-4 rounded-lg"
                                                    />
                                                    {/* )} */}

                                                </Link>
                                            </div>

                                            {/* Events & Cultural Aspects */}
                                            < div className="w-1/2 mb-6 p-4 border rounded-lg shadow-md dark:border-strokedark" >
                                                <h3 className="text-xl font-semibold">Events & Cultural Aspects</h3>

                                                {/* Events */}
                                                < div className="mt-2" >
                                                    <h4 className="text-lg font-medium">Events</h4>
                                                    {
                                                        destination.events?.length > 0 ? (
                                                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                                                                {destination.events.map((event, index) => (
                                                                    <li key={index}>{event}</li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">No events listed</p>
                                                        )
                                                    }
                                                </div>

                                                {/* Cultural Aspects */}
                                                <div className="mt-4">
                                                    <h4 className="text-lg font-medium">Cultural Places</h4>
                                                    {destination.cultural?.places.length > 0 ? (
                                                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                                                            {destination.cultural.places.map((place, index) => (
                                                                <li key={index}>{place}</li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">No cultural places listed</p>
                                                    )}

                                                    <h4 className="text-lg font-medium mt-2">Famous Foods</h4>
                                                    {destination.cultural?.foods.length > 0 ? (
                                                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                                                            {destination.cultural.foods.map((food, index) => (
                                                                <li key={index}>{food}</li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">No famous foods listed</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500">No recommendations found for this city.</p>
                                )
                            ) : (
                                <p className="text-center text-gray-500">Please search for destinations.</p>
                            )}
                        </div >
                    </motion.div >
                    {/* <!-- Tab Content End --> */}

                    {/* <!-- Tab Content End --> */}
                </div >
            </section >
            {/* <!-- ===== About Start ===== --> */}
            < section className="overflow-hidden ml-10" >
                <div className="mx-auto max-w-c-1235 px-4 md:px-8 xl:px-0">
                    <div className="flex items-center gap-8 lg:gap-32.5">
                        <motion.div
                            variants={{
                                hidden: {
                                    opacity: 0,
                                    x: -20,
                                },

                                visible: {
                                    opacity: 1,
                                    x: 0,
                                },
                            }}
                            initial="hidden"
                            whileInView="visible"
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="animate_left relative mx-auto hidden aspect-[588/526.5] md:block md:w-1/2"
                        >
                            <Image
                                src="/festival.jpg"
                                alt="Cultural"
                                className="dark:hidden"
                                fill
                            />
                            <Image
                                src="/festival.jpg"
                                alt="Cultural"
                                className="hidden dark:block"
                                fill
                            />
                        </motion.div>
                        <motion.div
                            variants={{
                                hidden: {
                                    opacity: 0,
                                    x: 20,
                                },

                                visible: {
                                    opacity: 1,
                                    x: 0,
                                },
                            }}
                            initial="hidden"
                            whileInView="visible"
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="animate_right md:w-1/2"
                        >
                            <span className="font-medium uppercase text-black dark:text-white">
                                <span className="mb-4 mr-4 inline-flex rounded-full bg-meta px-4.5 py-1 text-metatitle uppercase text-white ">
                                    New
                                </span>{" "}
                                Explore new events and cultural foods in places
                            </span>
                            <h2 className="relative mb-6 text-3xl font-bold text-black dark:text-white xl:text-hero">
                                A Complete Solution for&nbsp;
                                <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg dark:before:bg-titlebgdark">
                                    planning travel ideas
                                </span>
                            </h2>
                            <p>
                                Stay updated on the latest cultural events and explore destinations that bring traditions to life. Our platform connects you with vibrant festivals, local heritage sites, and must-visit attractions to enrich your travel experience.
                            </p>

                            <div className="mt-7.5 flex items-center gap-5">
                                <div className="flex h-15 w-15 items-center justify-center rounded-[50%] border border-stroke dark:border-strokedark dark:bg-blacksection">
                                    <p className="text-metatitle2 font-semibold text-black dark:text-white">
                                        01
                                    </p>
                                </div>
                                <div className="w-3/4">
                                    <h3 className="mb-0.5 text-metatitle2 text-black dark:text-white">
                                        What you can do?
                                    </h3>
                                    <p>Discover exciting events and unique cultural experiences! Explore festivals, local traditions, and must-visit destinations—all in one place. Find the perfect spots to immerse yourself in authentic cultural vibes!</p>
                                </div>
                            </div>
                            <div className="mt-7.5 flex items-center gap-5">
                                <div className="flex h-15 w-15 items-center justify-center rounded-[50%] border border-stroke dark:border-strokedark dark:bg-blacksection">
                                    <p className="text-metatitle2 font-semibold text-black dark:text-white">
                                        02
                                    </p>
                                </div>
                                <div className="w-3/4">
                                    <h3 className="mb-0.5 text-metatitle2 text-black dark:text-white">
                                        Enhance your journey
                                    </h3>
                                    <p>Uncover cultural gems and upcoming events near you. Plan your journey with ease and dive into unforgettable experiences!</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section >
            {/* <!-- ===== About End ===== --> */}
        </>
    );
};

export default Cultural;
