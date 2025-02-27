import Image from "next/image";

const Banner = () => {
    return (
        <main>
            <div className="px-6 lg:px-8">
                <div className="mx-auto max-w-7xl pt-16 sm:pt-20 pb-20">
                    <div className="relative flex flex-col items-center justify-center text-center bg-gray-100 p-10 rounded-lg shadow-lg overflow-hidden min-h-[500px] w-full">
                        
                        {/* Background Image */}
                        <div className="absolute top-0 left-0 w-full h-full">
                            <Image 
                                src={'/travel4K.jpg'} 
                                alt="banner-image" 
                                fill
                                style={{ objectFit: "cover" }}
                                className="opacity-80"
                            />
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                        <h1 className="text-4xl font-semibold text-white sm:text-5xl lg:text-7xl">
                            Explore VietNam with <br /> Unforgettable Journeys
                        </h1>
                        <p className="mt-6 text-lg font-semibold leading-8 text-white">
                            Discover breathtaking destinations, immerse yourself in new cultures, and create lasting memories. <br /> Start your adventure with us today!
                        </p>


                            {/* Buttons */}
                            <div className="mt-5 flex justify-center gap-4">
                                <button 
                                    type="button" 
                                    className="text-white font-medium bg-blue-500 py-4 px-10 rounded-md transition-all duration-300 ease-in-out 
                                    hover:bg-blue-600 hover:scale-105 hover:shadow-xl"
                                >
                                    See our portfolio
                                </button>
                                <button 
                                    type="button" 
                                    className="text-white font-medium bg-blue-500 py-4 px-10 border border-gray-300 rounded-md transition-all duration-300 ease-in-out 
                                    hover:bg-blue-600 hover:border-blue-800 hover:scale-105 hover:shadow-xl"
                                >
                                    More info
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Banner;
