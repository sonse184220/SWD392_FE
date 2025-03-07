import Link from "next/link";
import Image from "next/image";

const travelLocations = [
  {
    avatar: "/images/locations/ba-na-hills.jpg",
    name: "Ba Na Hills",
    city: "Da Nang",
    description: "Famous for its Golden Bridge and cable cars.",
  },
  {
    avatar: "/images/locations/my-khe-beach.jpg",
    name: "My Khe Beach",
    city: "Da Nang",
    description: "One of the most beautiful beaches in Vietnam.",
  },
  {
    avatar: "/images/locations/xuan-huong-lake.jpg",
    name: "Xuan Huong Lake",
    city: "Da Lat",
    description: "A peaceful lake in the heart of Da Lat.",
  },
  {
    avatar: "/images/locations/valley-of-love.jpg",
    name: "Valley of Love",
    city: "Da Lat",
    description: "A romantic destination surrounded by hills.",
  },
  {
    avatar: "/images/locations/do-temple.jpg",
    name: "Do Temple",
    city: "Bac Ninh",
    description: "An ancient temple with historical significance.",
  },
  {
    avatar: "/images/locations/but-thap-pagoda.jpg",
    name: "But Thap Pagoda",
    city: "Bac Ninh",
    description: "A famous Buddhist pagoda in Bac Ninh.",
  },
];

const TravelLocationCard = () => {
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Popular Travel Destinations
      </h4>

      <div>
        {travelLocations.map((location, index) => (
          <Link
            href="/"
            className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={index}
          >
            <div className="relative h-14 w-14 rounded-full overflow-hidden">
              <Image
                width={56}
                height={56}
                src={location.avatar}
                alt={location.name}
                style={{
                  width: "auto",
                  height: "auto",
                }}
              />
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {location.name}
                </h5>
                <p className="text-sm text-black dark:text-white">
                  {location.city}
                </p>
                <p className="text-xs">{location.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TravelLocationCard;
