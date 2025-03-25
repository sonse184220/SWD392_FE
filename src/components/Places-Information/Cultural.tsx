"use client";

import { getRecommendation } from "@/services/geminiAIService";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const featuresTabData: FeatureTab[] = [
    {
        id: "tabOne",
        title: "Solid Has Neat & Clean User Interface.",
        desc1: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricies lacus non fermentum ultrices. Fusce consectetur le.`,
        desc2: `    Nam id eleifend dui, id iaculis purus. Etiam lobortis neque nec finibus sagittis. Nulla ligula nunc egestas ut.`,
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        imageDark: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: "tabTwo",
        title: "Ready to Use Pages You Need for a SaaS Business.",
        desc1: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricies lacus non fermentum ultrices. Fusce consectetur le.`,
        desc2: `    Nam id eleifend dui, id iaculis purus. Etiam lobortis neque nec finibus sagittis. Nulla ligula nunc egestas ut.`,
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        imageDark: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: "tabThree",
        title: "Functional Blog, DB, Auth and Many More",
        desc1: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricies lacus non fermentum ultrices. Fusce consectetur le.`,
        desc2: `Nam id eleifend dui, id iaculis purus. Etiam lobortis neque nec finibus sagittis. Nulla ligula nunc egestas ut.`,
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        imageDark: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
];

type FeatureTab = {
    id: string;
    title: string;
    desc1: string;
    desc2: string;
    image: string;
    imageDark: string;
};

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

    // const fetchDatas = async () => {
    //     const response = await getRecommendation("1 place in ThuDuc");
    //     setData({
    //         events: response.data.events || [],
    //         cultural: response.data.cultural || { places: [] },
    //     });
    // }

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
            // setIsLoading(true);
            // setProgress(0);

            // let progressInterval = setInterval(() => {
            //     setProgress((prev) => (prev < 90 ? prev + 10 : prev));
            // }, 500);

            // const cityName = cityTabs.find(tab => tab.cityId === cityId)?.name ?? "Unknown City";
            // const prompt = `Recommend places in ${cityName}.`;

            if (!selectedCity) {
                alert("Please select a city.");
                return;
            }

            setHasSearched(true); // Mark as searched
            setIsLoading(true);

            const cityName = selectedCity.name;
            const districtName = selectedDistrict?.name || "all districts";
            const prompt = `List 3 places with related events and cultural to visit in ${cityName}, ${districtName}.`;
            const response = await getRecommendation(prompt);
            console.log("ne" + Date.now.toString + response)

            // clearInterval(progressInterval);

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
            }
        } catch (error) {
            console.error("Error fetching destinations:", error);
        } finally {
            setIsLoading(false);
            // setProgress(100);
            // setTimeout(() => {
            //     setLoading(false);
            //     setProgress(0);
            // }, 500);
        }
    };


    // useEffect(() => {
    //     const selectedCity = cityTabs.find(tab => tab.id === currentTab)?.cityId ?? 1;

    //     if (firstRender) {
    //         setFirstRender(false); // ✅ Prevent duplicate API call
    //         return;
    //     }
    //     console.log("called" + Date.now)

    //     handleSearch(selectedCity);
    // }, [currentTab]);

    return (
        <>
            <section className="relative pb-20 pt-18.5 overflow-hidde lg:pb-25 xl:pb-30 bg-white dark:bg-gray-900  p-6 rounded-xl shadow-md m-5">
                <div className="relative mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
                    <div className="absolute -top-16 -z-1 mx-auto h-[350px] w-[90%]">
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
                                        <div className="flex space-x-10" key={destination.destinationId}>
                                            {/* Destination Info */}
                                            <div className="w-1/3 mb-6 p-4 border rounded-lg shadow-md dark:border-strokedark">
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
                                                    } alt={destination.name}
                                                    width={500}
                                                    height={300}
                                                    className="mt-4 rounded-lg"
                                                />
                                                {/* )} */}
                                            </div>

                                            {/* Events & Cultural Aspects */}
                                            <div className="w-1/2 mb-6 p-4 border rounded-lg shadow-md dark:border-strokedark">
                                                <h3 className="text-xl font-semibold">Events & Cultural Aspects</h3>

                                                {/* Events */}
                                                <div className="mt-2">
                                                    <h4 className="text-lg font-medium">Events</h4>
                                                    {destination.events?.length > 0 ? (
                                                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                                                            {destination.events.map((event, index) => (
                                                                <li key={index}>{event}</li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">No events listed</p>
                                                    )}
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
                        </div>
                    </motion.div>
                    {/* <!-- Tab Content End --> */}

                    {/* <!-- Tab Content End --> */}
                </div>
            </section>
            {/* <!-- ===== About Start ===== --> */}
            <section className="overflow-hidden pb-20 lg:pb-25 xl:pb-30 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md m-5">
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
                                src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Cultural"
                                className="dark:hidden"
                                fill
                            />
                            <Image
                                src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
                                SaaS Boilerplate for Next.js
                            </span>
                            <h2 className="relative mb-6 text-3xl font-bold text-black dark:text-white xl:text-hero">
                                A Complete Solution for
                                <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg dark:before:bg-titlebgdark">
                                    SaaS Startup
                                </span>
                            </h2>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                                ultricies lacus non fermentum ultrices. Fusce consectetur le.
                            </p>

                            <div className="mt-7.5 flex items-center gap-5">
                                <div className="flex h-15 w-15 items-center justify-center rounded-[50%] border border-stroke dark:border-strokedark dark:bg-blacksection">
                                    <p className="text-metatitle2 font-semibold text-black dark:text-white">
                                        01
                                    </p>
                                </div>
                                <div className="w-3/4">
                                    <h3 className="mb-0.5 text-metatitle2 text-black dark:text-white">
                                        React 18, Next.js 13 and TypeScript
                                    </h3>
                                    <p>Ut ultricies lacus non fermentum ultrices.</p>
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
                                        Fully Customizable
                                    </h3>
                                    <p>consectetur adipiscing elit fermentum ultricies.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
            {/* <!-- ===== About End ===== --> */}

            {/* <!-- ===== About Two Start ===== --> */}
            <section>
                <div className="overflow-hidden p-4 md:px-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md m-5">
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
                            transition={{ duration: 1, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="animate_left md:w-1/2"
                        >
                            <h4 className="font-medium uppercase text-black dark:text-white">
                                Launch Your SaaS Fast
                            </h4>
                            <h2 className="relative mb-6 text-3xl font-bold text-black dark:text-white xl:text-hero">
                                Packed with All Essential {"   "}
                                <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg2 dark:before:bg-titlebgdark">
                                    Integrations
                                </span>
                            </h2>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                                ultricies lacus non fermentum ultrices. Fusce consectetur le.
                            </p>
                            <div>
                                <a
                                    href="#"
                                    className="group mt-7.5 inline-flex items-center gap-2.5 text-black hover:text-primary dark:text-white dark:hover:text-primary"
                                >
                                    <span className="duration-300 group-hover:pr-2">
                                        Know More
                                    </span>
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 14 14"
                                        fill="currentColor"
                                    >
                                        <path d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z" />
                                    </svg>
                                </a>
                            </div>
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
                            transition={{ duration: 1, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="animate_right relative mx-auto hidden aspect-[588/526.5] md:block md:w-1/2"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Cultural2"
                                className="dark:hidden rounded-xl"
                                fill
                            />
                            <Image
                                src="./images/about/about-dark-02.svg"
                                alt="About"
                                className="hidden dark:block rounded-xl"
                                fill
                            />
                        </motion.div>
                    </div>
                </div>
            </section>
            {/* <!-- ===== About Two End ===== --> */}


        </>
    );
};

export default Cultural;
