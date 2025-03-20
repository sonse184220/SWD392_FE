"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { getDestinationById } from "@/services/destinationService";
import { notFound } from 'next/navigation';
import { getRecommendation } from "@/services/geminiAIService";
import { getCategoryList } from "@/services/categoryService";
import { motion } from "framer-motion";

import { getData, saveData } from '@/lib/dbIndex';
import Link from "next/link";

// Define types
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
  category: any;
  district: any;
  openingHours: any[];
  imageUrl?: string;
  imageUrls?: string[];
};

type RecommendedDestination = {
  destinationId: string;
  destinationName: string;
  address: string;
  description: string;
  rate: number;
  imageUrls?: string[];

};

type Category = {
  categoryId: string;
  categoryName: string;
  // Add other category properties as needed
};

interface PageProps {
  params: {
    id: string;
  };
}

const DestinationDetail = () => {
  // const router = useRouter();
  // const { id } = router.query;
  const { id } = useParams();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [recommendedDestinations, setRecommendedDestinations] = useState<RecommendedDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const destinationId = decodeURIComponent(Array.isArray(id) ? id[0] : id ?? "");

  useEffect(() => {
    const fetchDestination = async (): Promise<void> => {
      if (!id) return;

      try {
        setLoading(true);
        const storedData = await getData();
        console.log("stored", storedData)
        const allDestinations = storedData.flatMap(item =>
          Object.values(item).filter((dest): dest is Destination =>
            typeof dest === "object" && dest !== null && "destinationId" in dest
          )
        );

        console.log("allDestinations", allDestinations); // Debugging output

        //   let destinationData = allDestinations.find(dest => dest.destinationId === id);
        // console.log("cache", destinationData);
        let destinationData: Destination | null = allDestinations.find(dest => dest.destinationId === id) || null;

        console.log("datane", destinationData)

        if (!destinationData) {
          console.log("datane2", destinationData)
          // ✅ 2. Fetch from API if not found in IndexedDB
          const response = await getDestinationById(destinationId);
          if (!response || !response.data) {
            throw new Error("Failed to fetch destination");
          }
          destinationData = response.data;
        }

        console.log("datane 3", destinationData)
        setDestination(destinationData);

        // const cachedDestination = allDestinations.find(dest => dest.destinationId === id);

        // console.log("cache", cachedDestination);

        // if (cachedDestination) {
        //   setDestination(cachedDestination);
        //   // setLoading(false);
        //   // return;
        // }else{
        // Fetch destination details
        // const response = await getDestinationById(destinationId);
        // if (!response || !response.data) {
        //   throw new Error("Failed to fetch destination");
        // }
        // setDestination(response.data);

        let categoryName = "";
        if (destinationData?.categoryId) {
          try {
            const categoryResponse = await getCategoryList(); // You'll need to implement this service
            const category = categoryResponse.data.find((cat: Category) => cat.categoryId === destinationData?.categoryId);
            if (category) {
              categoryName = category.categoryName;
            }
          } catch (catErr) {
            console.error("Error fetching categories:", catErr);
            // Continue with the rest of the function even if category fetch fails
          }
        }

        // Fetch recommended destinations
        let promptParts: string[] = ["Recommend places"];

        if (destinationData?.destinationName) {
          promptParts.push(`nearby and around ${destinationData.destinationName} locate at ${destinationData?.address} belong to ${destinationData?.ward} ward`);

          if (typeof categoryName === "string" && categoryName.length !== 0) {
            promptParts.push(`in the ${categoryName} category`);
          }

          const searchData = promptParts.join(" ") + ".";
          const recResponse = await getRecommendation(searchData);
          // if (!recResponse.ok) {
          //   throw new Error("Failed to fetch recommended destinations");
          // }
          // const recData = await recResponse.json();
          setRecommendedDestinations(recResponse.data.response);
          await saveData(recResponse.data.response)
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load destination information");
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  if (!id) {
    return <div className="flex justify-center items-center h-96">Destination ID is required</div>;
  }

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-96 text-red-500">{error}</div>;
  }

  if (!destination) {
    // return <div className="flex justify-center items-center h-96">Destination not found</div>;
    notFound();
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 1, delay: 0.5 }}
      viewport={{ once: true }}
    // className="animate_top rounded-lg bg-white p-4 pb-9 shadow-solid-8 dark:bg-blacksection"
    >
      <div className="flex flex-col items-center">
        <div className="lg:w-2/3 mb-4 w-full">
          <div className="animate_top border bg-white shadow-solid-13 dark:bg-blacksection md:p-10 dark:bg-gray-900 border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md">
            <div className="mb-10 w-full overflow-hidden">
              <div className="relative aspect-[97/60] w-full sm:aspect-[97/44] fill">
                <Image
                  // src="/travel4K.jpg"
                  src={
                    destination.imageUrl
                      ? destination.imageUrl
                      : Array.isArray(destination.imageUrls) && destination.imageUrls.length > 0
                        ? destination.imageUrls[0]
                        : "/travel4K.jpg"
                  }
                  // src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt={destination.destinationName}
                  fill
                  className="rounded-md object-cover object-center"
                />
                {/* <img
                className="rounded-md object-cover object-center fill"
                // fill
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwGfYz85OaWM89cSro0thOGsf9luBb3qoN9TPhVfCoZC-gYFHpXLmxyQ&s" /> */}
              </div>
            </div>

            <h2 className="mb-5 mt-11 text-3xl font-semibold text-black dark:text-white 2xl:text-sectiontitle2">
              {destination.destinationName}
            </h2>

            <ul className="mb-6 flex flex-wrap gap-5 2xl:gap-7.5">
              <li>
                <span className="text-black dark:text-white">Location: </span>{" "}
                {destination.address}
              </li>
              <li>
                <span className="text-black dark:text-white">
                  Rating:
                </span>{" "}
                {destination.rate} / 5
              </li>
              <li>
                <span className="text-black dark:text-white">
                  Ward:
                </span>{" "}
                {destination.ward}
              </li>
              <li>
                <span className="text-black dark:text-white">
                  Status:
                </span>{" "}
                {destination.status}
              </li>
            </ul>

            <div className="blog-details">
              <h3 className="mb-4 text-xl font-semibold">Description</h3>
              <p className="mb-6">
                {destination.description}
              </p>

              {destination.openingHours && destination.openingHours.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-4 text-xl font-semibold">Opening Hours</h3>
                  <ul className="space-y-2">
                    {destination.openingHours.map((hour, index) => (
                      <li key={index}>{hour}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommended destinations section */}
        {recommendedDestinations.length > 0 && (
          <div className="w-full lg:w-3/4 mb-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold mb-6 text-black dark:text-white">Places you might like</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedDestinations.map((rec) => (
                <Link href={`/user/destinations/destination-details/${rec.destinationId}`}>
                  <div
                    key={rec.destinationId}
                    className="border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-md cursor-pointer animate_top rounded-lg p-4 pb-9 shadow-solid-8 dark:bg-blacksection"

                  // className="border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-md cursor-pointer"
                  // onClick={() => router.push(`/destinations/${rec.destinationId}`)}
                  >
                    <div className="relative aspect-[16/9] w-full mb-4">
                      <Image
                        // src="/images/blog/blog-01.png" // placeholder image - update with actual image path
                        // src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        src={
                          Array.isArray(rec.imageUrls) && rec.imageUrls.length > 0
                            ? rec.imageUrls[0]
                            : "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        }
                        alt={rec.destinationName}
                        fill
                        className="rounded-md object-cover object-center"
                      />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{rec.destinationName}</h4>
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1">{rec.rate}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{rec.address}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DestinationDetail;