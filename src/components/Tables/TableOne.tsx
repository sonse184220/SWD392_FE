import Image from "next/image";

const travelData = [
  {
    image: "/images/locations/ba-na-hills.jpg",
    name: "Ba Na Hills",
    location: "Da Nang",
    visitors: 3.2,
    rating: 4.8,
    reviews: 1250,
  },
  {
    image: "/images/locations/my-khe-beach.jpg",
    name: "My Khe Beach",
    location: "Da Nang",
    visitors: 2.8,
    rating: 4.7,
    reviews: 980,
  },
  {
    image: "/images/locations/xuan-huong-lake.jpg",
    name: "Xuan Huong Lake",
    location: "Da Lat",
    visitors: 1.9,
    rating: 4.6,
    reviews: 850,
  },
  {
    image: "/images/locations/valley-of-love.jpg",
    name: "Valley of Love",
    location: "Da Lat",
    visitors: 2.1,
    rating: 4.5,
    reviews: 1020,
  },
  {
    image: "/images/locations/do-temple.jpg",
    name: "Do Temple",
    location: "Bac Ninh",
    visitors: 1.4,
    rating: 4.4,
    reviews: 600,
  },
  {
    image: "/images/locations/but-thap-pagoda.jpg",
    name: "But Thap Pagoda",
    location: "Bac Ninh",
    visitors: 1.2,
    rating: 4.3,
    reviews: 550,
  },
];

const TravelTable = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Top Travel Places
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Place
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Location
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Visitors (M)
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Rating
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Reviews
            </h5>
          </div>
        </div>

        {travelData.map((place, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === travelData.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">
                <Image src={place.image} alt={place.name} width={48} height={48} />
              </div>
              <p className="hidden text-black dark:text-white sm:block">
                {place.name}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{place.location}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{place.visitors}M</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{place.rating}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">{place.reviews}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelTable;
