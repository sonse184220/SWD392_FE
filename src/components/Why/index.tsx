import Image from "next/image";

interface whydata {
    heading: string;
    subheading: string;
}

const whydata: whydata[] = [
    {
        heading: "Unforgettable Experiences",
        subheading: "Explore hidden gems and iconic destinations with expertly curated travel plans.",
    },
    {
        heading: "Seamless Planning",
        subheading: "Enjoy hassle-free booking for accommodations, tours, and local experiences.",
    },
    {
        heading: "24/7 Support",
        subheading: "Travel with confidence knowing our team is always ready to assist you.",
    }
];

const Why = () => {
    return (
        <div id="about">
            <div className='mx-auto max-w-7xl px-4 my-20 sm:py-20 lg:px-8'>
                <div className='grid grid-cols-1 lg:grid-cols-2'>

                    {/* COLUMN-1 */}
                    <div className="lg:-ml-64">
                        <Image src="/TravelExperience.jpg" alt="Travel Experience" width={800} height={800} />
                    </div>

                    {/* COLUMN-2 */}
                    <div>
                        <h3 className="text-4xl lg:text-5xl pt-4 font-semibold sm:leading-tight mt-5 text-center lg:text-start">
                            Why Choose Us for Your Next Adventure?
                        </h3>
                        <h4 className="text-lg pt-4 font-normal sm:leading-tight text-center text-beach lg:text-start">
                            Let us take care of your travel plans while you enjoy unforgettable journeys. Discover new places, experience different cultures, and travel stress-free with our expert guidance.
                        </h4>
                        <div className="mt-10">
                        {whydata.map((items, i) => (
                            <div className="flex mt-4 items-start" key={i}>
                                <span className="text-xl text-blue-500 mr-3">●</span> {/* Thêm dấu chấm */}
                                <div>
                                    <h4 className="text-2xl font-semibold">{items.heading}</h4>
                                    <h5 className="text-lg text-beach font-normal mt-2">{items.subheading}</h5>
                                </div>
                            </div>
                        ))}
                    </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default Why;
