import Image from "next/image";

const Clientsay = () => {
    return (
        <div className="relative mx-auto max-w-2xl py-40 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {/* Background Image */}
            <Image 
                src={'/travel4K.jpg'} 
                alt="happy-travelers" 
                width={1000} 
                height={800} 
                className="w-full h-auto rounded-lg shadow-lg"
            />


            <div className="mt-10 text-center">
                <h3 className='text-navyblue text-4xl lg:text-6xl font-semibold'>
                    What Travelers Say About Us ✈️🌍
                </h3>
                <h4 className="text-lg font-normal text-darkgray mt-4">
                    Our AI-powered travel service has transformed how people explore the world. <br />
                    Here’s what our happy travelers have to say!
                </h4>

                <div className="flex flex-col items-center mt-10">
    <div className="flex flex-wrap justify-center gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-lg max-w-sm">
            <p className="text-base font-normal text-darkgray">
                “My trip to Ha Long was amazing thanks to AI suggestions for the perfect itinerary. <br />
                From a cruise tour to local eateries, everything was just perfect!”
            </p>
            <h3 className="text-2xl font-medium py-2">Nguyen Minh</h3>
            <h4 className="text-sm font-normal">Traveler from Hanoi</h4>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg max-w-sm">
            <p className="text-base font-normal text-darkgray">
                “Thanks to AI, I found a beautiful homestay in Da Lat and <br />
                experienced an unforgettable cloud-hunting adventure at sunrise!”
            </p>
            <h3 className="text-2xl font-medium py-2">Tran Phuong Anh</h3>
            <h4 className="text-sm font-normal">Backpacker</h4>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg max-w-sm">
            <p className="text-base font-normal text-darkgray">
                “I explored all the best street food in Saigon with AI recommendations! <br />
                Pho, banh mi, and com tam – everything was irresistibly delicious.”
            </p>
            <h3 className="text-2xl font-medium py-2">Le Hoang</h3>
            <h4 className="text-sm font-normal">Foodie Traveler</h4>
        </div>
    </div>
</div>



            </div>
        </div>
    )
}

export default Clientsay;
