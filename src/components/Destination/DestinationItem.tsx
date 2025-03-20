// "use client";
// import { Blog } from "@/types/blog";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import Link from "next/link";

// const BlogItem = ({ blog }: { blog: Blog }) => {
//   const { mainImage, title, metadata } = blog;

//   return (
//     <>
//       <motion.div
//         variants={{
//           hidden: {
//             opacity: 0,
//             y: -20,
//           },

//           visible: {
//             opacity: 1,
//             y: 0,
//           },
//         }}
//         initial="hidden"
//         whileInView="visible"
//         transition={{ duration: 1, delay: 0.5 }}
//         viewport={{ once: true }}
//         className="animate_top rounded-lg bg-white p-4 pb-9 shadow-solid-8 dark:bg-blacksection"
//       >
//         <Link href={`/blog/`} className="relative block aspect-[368/239]">
//           <Image src={mainImage} alt={title} fill />
//         </Link>

//         <div className="px-4">
//           <h3 className="mb-3.5 mt-7.5 line-clamp-2 inline-block text-lg font-medium text-black duration-300 hover:text-primary dark:text-white dark:hover:text-primary xl:text-itemtitle2">
//             <Link href={`/blog/blog-details`}>
//               {`${title.slice(0, 40)}...`}
//             </Link>
//           </h3>
//           <p className="line-clamp-3">{metadata}</p>
//         </div>
//       </motion.div>
//     </>
//   );
// };

// export default BlogItem;

"use client";
import { Destination } from "@/types/destination";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const DestinationItem = ({ destination }: { destination: Destination }) => {
  // const { destinationName, address, description, rate, district } = destination;
  const { destinationId, destinationName, address, description, rate, district, districtName } = destination;

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
      className="animate_top rounded-lg bg-white p-4 pb-9 shadow-solid-8 dark:bg-blacksection"
    >
      <Link href={`/user/destinations/destination-details/${destination.destinationId}`} className="rounded-lg relative block aspect-[368/239]">
        <Image
          // src="/travel4K.jpg" // Replace with actual image source if available
          // alt={destinationName}
          // src={destination.imageUrl ? destination.imageUrl : "/travel4K.jpg"}
          src={
            destination.imageUrl
              ? destination.imageUrl
              : Array.isArray(destination.imageUrls) && destination.imageUrls.length > 0
                ? destination.imageUrls[0]
                : "/travel4K.jpg"
          }
          alt={destinationName || ""}
          fill
        />
      </Link>
      <div className="px-4">
        <h3 className="mb-3.5 mt-7.5 line-clamp-2 inline-block text-lg font-medium text-black duration-300 hover:text-primary dark:text-white dark:hover:text-primary xl:text-itemtitle2">
          <Link href={`/user/destinations/destination-details/${destination.destinationId}`}>{destinationName}</Link>
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {/* {address}, {district.name} */}
          {/* {address}, {district?.name}{city ? `, ${city.name}` : ""} */}
          {/* {address}, {district?.name}{district?.city ? `, ${district.city.name}` : ""} */}
          {address}
          {district?.name ?
            <>
              , {district.name}
              {district.city ? `, ${district.city.name}` : ""}
            </>
            :
            districtName ? `, ${districtName}` : ""
          }
        </p>
        {/* , {city.name} */}
        <p className="line-clamp-3 mt-2">{description}</p>
        <p className="mt-2 text-yellow-500 font-bold">⭐ {rate}</p>
      </div>
    </motion.div>
  );
};

export default DestinationItem;
