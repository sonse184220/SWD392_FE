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
  const { destinationName, address, description, rate, district } = destination;

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
      <Link href={`/destination/${destination.destinationId}`} className="relative block aspect-[368/239]">
        <Image
          src="/images/default-destination.jpg" // Replace with actual image source if available
          alt={destinationName}
          fill
        />
      </Link>
      <div className="px-4">
        <h3 className="mb-3.5 mt-7.5 line-clamp-2 inline-block text-lg font-medium text-black duration-300 hover:text-primary dark:text-white dark:hover:text-primary xl:text-itemtitle2">
          <Link href={`/destination/${destination.destinationId}`}>{destinationName}</Link>
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{address}, {district.name}</p>
        {/* , {city.name} */}
        <p className="line-clamp-3 mt-2">{description}</p>
        <p className="mt-2 text-yellow-500 font-bold">⭐ {rate}</p>
      </div>
    </motion.div>
  );
};

export default DestinationItem;
