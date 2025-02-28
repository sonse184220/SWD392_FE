import Image from "next/image";

interface DataType {
    imgSrc: string;
    city: string;
    description: string;
}

const CityData: DataType[] = [
    {
        imgSrc: "danang.svg",
        city: "Da Nang",
        description: "The most livable city in Vietnam, famous for My Khe Beach, Dragon Bridge, and Ba Na Hills.",
    },
    {
        imgSrc: "dalat.svg",
        city: "Da Lat",
        description: "The city of a thousand flowers with a cool climate all year round, featuring Xuan Huong Lake and the Valley of Love.",
    },
    {
        imgSrc: "quangninh.svg",
        city: "Quang Ninh",
        description: "Home to Ha Long Bay – a world natural wonder, along with many stunning landscapes.",
    },
];

const Network = () => {
    return (
        <div className="relative bg-babyblue" id="project">
            {/* Background Image */}
            <Image 
                src={'/WallpaperDog-20454369.jpg'} 
                alt={"Vietnam Map"} 
                width={1800} 
                height={1000} 
                className="absolute top-0 left-0 w-full h-full object-cover opacity-80"
            />

            {/* Content */}
            <div className="relative mx-auto max-w-2xl py-20 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <h3 className="text-4xl sm:text-6xl font-semibold text-white text-center my-10 lh-81">
                    Explore the Beauty of Vietnam 🌍
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-4 lg:gap-x-8">
                    {CityData.map((item, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 shadow-xl">
                            <div className="flex justify-start items-center gap-2">
                                <Image 
                                    src={"/reddestination.jpg"} 
                                    alt={item.city} 
                                    width={55} 
                                    height={55} 
                                    className="mb-2"
                                />
                                <h4 className="text-xl font-medium text-midnightblue">{item.city}</h4>
                            </div>
                            <hr />
                            <h4 className="text-lg font-normal my-2">{item.description}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default Network;
