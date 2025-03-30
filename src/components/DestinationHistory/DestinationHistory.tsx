import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeader from "../CommonHeader/SectionHeader";
import { getRecommendationList } from "@/services/geminiAIService";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import Link from "next/link";
import Unauthorized from "@/app/reusePages/unauthorized";

type Feature = {
    id: number;
    icon: string;
    title: string;
    description: string;
};

type Cultural = {
    foods: string[];
    places: string[];
};

type District = {
    districtId: string;
    name: string;
    description: string;
    cityId: string;
    city: {
        cityId: string;
        name: string;
        description: string;
    };
};

type Destination = {
    destinationId: string;
    destinationName: string;
    address: string;
    description: string;
    rate: number;
    categoryId: string;
    ward: string;
    status: string;
    districtId: string;
    imageUrls: string[];
    district: District;
    events: string[];
    cultural: Cultural;
};


const History: React.FC = () => {
    const { isAuthenticated, user, token } = useAuth();
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchDestinationList();
    }, [])

    const fetchDestinationList = async () => {
        try {
            setLoading(true);
            const safeToken = token ?? "";
            const response = await getRecommendationList(safeToken);

            // Assuming the response has the same structure as your sample data
            if (response && response.data) {
                const allDestinations: Destination[] = [];

                // Iterate through all items in the response.data array
                response.data.forEach((item: any) => {
                    if (item.response && Array.isArray(item.response)) {
                        // Append all destinations from this response item
                        allDestinations.push(...item.response);
                    }
                });

                setDestinations(allDestinations);
            }
        } catch (error) {
            console.error("Error fetching destinations:", error);
        } finally {
            setLoading(false);
        }
    }

    if (!isAuthenticated && user?.role !== "User") {
        // router.push("/");
        return <Unauthorized />;
    }

    return (
        <>
            <SectionHeader
                headerInfo={{
                    title: "YOUR TRAVEL HISTORY",
                    subtitle: "Places You've Explored",
                    description: "Discover the destinations you've visited and the cultural experiences you've enjoyed throughout your journey.",
                }}
            />
            {/* <!-- ===== Features Start ===== --> */}
            <section id="features" className="py-20 lg:py-25 xl:py-30 relative pb-20 pt-18.5 lg:pb-25 xl:pb-30 bg-gray-50 dark:bg-gray-900  p-6 rounded-xl shadow-md m-5 overflow-auto max-h-screen">
                <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
                    {/* <!-- Section Title Start --> */}
                    {/* <!-- Section Title End --> */}
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : destinations.length === 0 ? (
                        <div className="text-center mt-12 p-8 rounded-lg border border-white bg-white shadow-solid-3 dark:border-strokedark dark:bg-blacksection">
                            <h3 className="text-xl font-semibold mb-4">No destinations in your history yet</h3>
                            <p>Start exploring to build your travel history!</p>
                        </div>
                    ) : (

                        <div className="mt-12.5 grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:mt-15 lg:grid-cols-3 xl:mt-20 xl:gap-12.5">
                            {/* <!-- Features item Start --> */}

                            {destinations.map((destination) => (
                                <Link href={`/user/destinations/destination-details/${destination.destinationId}`}>
                                    <motion.div
                                        key={destination.destinationId}
                                        variants={{
                                            hidden: {
                                                opacity: 0,
                                                y: -10,
                                            },

                                            visible: {
                                                opacity: 1,
                                                y: 0,
                                            },
                                        }}
                                        initial="hidden"
                                        whileInView="visible"
                                        transition={{ duration: 0.5 }}
                                        viewport={{ once: true }}
                                        className="animate_top rounded-lg border border-gray-200 bg-white p-7.5 shadow-solid-3 transition-all hover:shadow-solid-4 dark:border-strokedark dark:bg-blacksection dark:hover:bg-hoverdark xl:p-12.5"
                                    >
                                        <div className="text-xs text-gray-500 mb-2">ID: {destination.destinationId}</div>
                                        {/* <div className="relative flex h-16 w-16 items-center justify-center rounded-[4px] bg-primary">
                                    <Image src={feature.icon} width={36} height={36} alt="title" />
                                </div> */}
                                        <h3 className="mb-4 text-xl font-semibold text-black dark:text-white xl:text-itemtitle">
                                            {destination.destinationName}
                                        </h3>
                                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                                            {destination.description}
                                        </p>

                                        {/* Address */}
                                        <div className="flex items-start gap-2">
                                            <svg className="w-5 h-5 mt-0.5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{destination.address}</p>
                                        </div>
                                        {/* <p>{feature.description}</p> */}
                                    </motion.div>
                                </Link>
                            ))}
                            {/* <!-- Features item End --> */}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

const featuresData: Feature[] = [
    {
        id: 1,
        icon: "/images/icon/icon-01.svg",
        title: "Crafted for SaaS",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis tortor.",
    },
    {
        id: 2,
        icon: "/images/icon/icon-02.svg",
        title: "High-quality Design",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis tortor.",
    },
    {
        id: 3,
        icon: "/images/icon/icon-03.svg",
        title: "Next.js 13 + TypeScript",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis tortor.",
    },
    {
        id: 4,
        icon: "/images/icon/icon-04.svg",
        title: "Sanity Blog and Docs",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis tortor.",
    },
    {
        id: 5,
        icon: "/images/icon/icon-05.svg",
        title: "DB, Auth and Stripe",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis tortor.",
    },
    {
        id: 6,
        icon: "/images/icon/icon-06.svg",
        title: "Regular Free Updates",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis tortor.",
    },
];


export default History;