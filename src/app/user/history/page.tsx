"use client"
import History from "@/components/DestinationHistory/DestinationHistory";
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
                    <History />
                </div>
            </motion.div>
        </>
    );
};

export default CulturalPage;