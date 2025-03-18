// import Image from "next/image";

// const DestinationDetail = () => {
//     return (
//         <div className="flex justify-center items-center">
//             <div className="lg:w-2/3 mb-4">
//                 <div className="animate_top border  bg-white  shadow-solid-13  dark:bg-blacksection md:p-10  dark:bg-gray-900  border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md">
//                     <div className="mb-10 w-full overflow-hidden ">
//                         <div className="relative aspect-[97/60] w-full sm:aspect-[97/44]">
//                             <Image
//                                 src={"/travel4K.jpg"}
//                                 alt="Kobe Steel plant that supplied"
//                                 fill
//                                 className="rounded-md object-cover object-center"
//                             />
//                         </div>
//                     </div>

//                     <h2 className="mb-5 mt-11 text-3xl font-semibold text-black dark:text-white 2xl:text-sectiontitle2">
//                         Kobe Steel plant that supplied
//                     </h2>

//                     <ul className="mb-9 flex flex-wrap gap-5 2xl:gap-7.5">
//                         <li>
//                             <span className="text-black dark:text-white">Author: </span>{" "}
//                             Jhon Doe
//                         </li>
//                         <li>
//                             <span className="text-black dark:text-white">
//                                 Published On: July 30, 2023
//                             </span>{" "}
//                         </li>
//                         <li>
//                             <span className="text-black dark:text-white">
//                                 Category:
//                             </span>
//                             Events
//                         </li>
//                     </ul>

//                     <div className="blog-details">
//                         <p>
//                             Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//                             Nunc quis nibh lorem. Duis sed odio lorem. In a efficitur
//                             leo. Ut venenatis rhoncus quam sed condimentum. Curabitur
//                             vel turpis in dolor volutpat imperdiet in ut mi. Integer non
//                             volutpat nulla. Nunc elementum elit viverra, tempus quam
//                             non, interdum ipsum.
//                         </p>

//                         <p>
//                             Aenean augue ex, condimentum vel metus vitae, aliquam porta
//                             elit. Quisque non metus ac orci mollis posuere. Mauris vel
//                             ipsum a diam interdum ultricies sed vitae neque. Nulla
//                             porttitor quam vitae pulvinar placerat. Nulla fringilla elit
//                             sit amet justo feugiat sodales. Morbi eleifend, enim non
//                             eleifend laoreet, odio libero lobortis lectus, non porttitor
//                             sem urna sit amet metus. In sollicitudin quam est,
//                             pellentesque consectetur felis fermentum vitae.
//                         </p>

//                         <div className="flex flex-wrap gap-5">
//                             <Image
//                                 src={"/images/blog/blog-01.png"}
//                                 width={350}
//                                 height={200}
//                                 alt="image"
//                             />
//                             <Image
//                                 src={"/images/blog/blog-02.png"}
//                                 width={350}
//                                 height={200}
//                                 alt="image"
//                             />
//                         </div>

//                         <h3 className="pt-8">
//                             Nunc elementum elit viverra, tempus quam non
//                         </h3>

//                         <p>
//                             Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//                             Nunc quis nibh lorem. Duis sed odio lorem. In a efficitur
//                             leo. Ut venenatis rhoncus quam sed condimentum. Curabitur
//                             vel turpis in dolor volutpat imperdiet in ut mi. Integer non
//                             volutpat nulla. Nunc elementum elit viverra, tempus quam
//                             non, interdum ipsum.
//                         </p>
//                     </div>

//                     {/* <SharePost /> */}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default DestinationDetail;

"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { getDestinationById } from "@/services/destinationService";
import { notFound } from 'next/navigation';

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
};

type RecommendedDestination = {
  destinationId: string;
  destinationName: string;
  address: string;
  description: string;
  rate: number;
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
    const fetchDestination = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // Fetch destination details
        const response = await getDestinationById(destinationId);
        // if (response.status !== 200) {
        //   throw new Error("Failed to fetch destination");
        // }
        setDestination(response.data);

        // Fetch recommended destinations
        // const recResponse = await fetch(`/api/destinations/recommended?categoryId=${data.categoryId}`);
        // if (!recResponse.ok) {
        //   throw new Error("Failed to fetch recommended destinations");
        // }
        // const recData = await recResponse.json();
        // setRecommendedDestinations(recData);
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
    <div className="flex flex-col items-center">
      <div className="lg:w-2/3 mb-4 w-full">
        <div className="animate_top border bg-white shadow-solid-13 dark:bg-blacksection md:p-10 dark:bg-gray-900 border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md">
          <div className="mb-10 w-full overflow-hidden">
            <div className="relative aspect-[97/60] w-full sm:aspect-[97/44]">
              <Image
                src="/travel4K.jpg"
                alt={destination.destinationName}
                fill
                className="rounded-md object-cover object-center"
              />
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
        <div className="w-full lg:w-2/3 mb-10">
          <h3 className="text-2xl font-semibold mb-6 text-black dark:text-white">Places you might like</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedDestinations.map((rec) => (
              <div
                key={rec.destinationId}
                className="border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-md cursor-pointer"
              // onClick={() => router.push(`/destinations/${rec.destinationId}`)}
              >
                <div className="relative aspect-[16/9] w-full mb-4">
                  <Image
                    src="/images/blog/blog-01.png" // placeholder image - update with actual image path
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationDetail;