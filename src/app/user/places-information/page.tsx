"use client"
import Cultural from "@/components/Places-Information/Cultural";
import { motion } from "framer-motion";

const CulturalPage: React.FC = () => {
    return (
        <>
            {/* <div> */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6"
            >
                <div>
                    {/* <h1 className="text-2xl font-semibold mb-4">Destination Management</h1> */}
                    <Cultural />
                </div>
                {/* <div>
                    <h1 className="text-2xl font-semibold mb-4">Opening Hours Management</h1>
                    <OpeningHours />
                </div> */}
                {/* </div> */}
            </motion.div>
        </>
    );
};

export default CulturalPage;