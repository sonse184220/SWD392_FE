import Image from 'next/image';

interface CardDataType {
    imgSrc: string;
    heading: string;
    percent: string;
    subheading: string;
}

const cardData: CardDataType[] = [
    {
        imgSrc: '/tourists.jpg',
        percent: '500K+',
        heading: "Tourists Visited",
        subheading: "Over 500,000 tourists visit our destinations every year.",
    },
    {
        imgSrc: '/satisfaction.jpg',
        percent: '95%',
        heading: "Customer Satisfaction",
        subheading: "95% of travelers highly rate our services and experiences.",
    },
    {
        imgSrc: '/destinations.jpg',
        percent: '100+',
        heading: "Amazing Destinations",
        subheading: "Explore more than 100 breathtaking destinations worldwide.",
    },
    {
        imgSrc: '/guides.jpg',
        percent: '300+',
        heading: "Professional Tour Guides",
        subheading: "A team of 300+ experienced and passionate local guides.",
    }
];

const Travelers = () => {
    return (
        <div className='mx-auto max-w-7xl py-16 px-6'>
            <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-y-20 gap-x-5'>
                {cardData.map((item, i) => (
                    <div className='flex flex-col justify-center items-center relative' key={i}>
                        <div className='flex justify-center border border-gray-300 p-2 w-20 h-20 rounded-lg transform -translate-y-6 shadow-lg bg-white'>
                            <Image 
                                src={item.imgSrc} 
                                alt={item.heading} 
                                width={80} 
                                height={80} 
                                className="rounded-full object-cover"
                            />
                        </div>
                        <h2 className='text-4xl lg:text-6xl text-blue-600 font-semibold text-center mt-2'>{item.percent}</h2>
                        <h3 className='text-2xl text-gray-800 font-semibold text-center lg:mt-6'>{item.heading}</h3>
                        <p className='text-lg font-normal text-gray-600 text-center mt-2'>{item.subheading}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Travelers;
