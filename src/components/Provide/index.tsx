import Image from "next/image";
import Link from "next/link";

interface datatype {
    title: string;
    desc: string;
}

const Aboutdata: datatype[] = [
    { title: "Foods/Drinks", desc: "Experience the finest local cuisine and drinks, from street food to gourmet dining." },
    { title: "Hotels", desc: "Book top-rated hotels and unique stays that fit your budget and style." },
    { title: "Tours", desc: "Discover breathtaking destinations with guided tours and local adventures." },
    { title: "AI", desc: "Get smart travel insights and personalized recommendations." },
];

const Provide = () => {
    return (
        <div id="services">
            <div className='mx-auto max-w-7xl px-4 my-10 sm:py-20 lg:px-8'>
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
                    <div className='col-span-6 flex justify-center relative'>

                      
                        <div 
                            className="absolute inset-0 bg-cover bg-center rounded-2xl z-0"
                            style={{ backgroundImage: "url('/4k.jpg')" }}
                        />

                   
                        <div className="flex flex-col justify-center p-10  bg-white/20 rounded-2xl shadow-lg z-10">
                            <p className="text-4xl lg:text-6xl pt-4 font-semibold mt-5 text-white text-center lg:text-start">
                                Explore the World with Us
                            </p>
                            <h4 className="text-lg pt-4 font-normal text-center lg:text-start text-white">
                                Discover curated travel services that offer the best in local cuisines, accommodations, tours, and smart travel insights.
                            </h4>
                            <Link href='/' className="mt-4 text-xl font-medium text-blue flex justify-end gap-2 w-full">
                            Learn more
                        </Link>

                        </div>
                    </div>

                    <div className='lg:col-span-1'></div>

                    {/* RIGHT COLUMN */}
                    <div className='col-span-6 lg:col-span-5'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-10 lg:gap-x-40 px-10 py-12 bg-bluebg rounded-3xl'>
                            {Aboutdata.map((item, i) => (
                                <div key={i} className='bg-white rounded-3xl lg:-ml-32 p-6 shadow-xl'>
                                    <h4 className="text-2xl font-semibold">{item.title}</h4>
                                    <h4 className='text-lg font-normal text-bluegray my-2'>{item.desc}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Provide;
