"use client"
import DefaultLayout from "@/components/Layouts/DefaultLayout"
import React from "react";
import { motion } from "framer-motion";
import Destination from "@/components/Destination/DestinationAdmin";
import OpeningHours from "@/components/OpeningHours/OpeningHoursAdmin";

const DestinationPage: React.FC = () => {
    return (
        <DefaultLayout>
            {/* <div> */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6"
            >
                <div>
                    <h1 className="text-2xl font-semibold mb-4">Destination Management</h1>
                    <Destination />
                </div>
                <div>
                    <h1 className="text-2xl font-semibold mb-4">Opening Hours Management</h1>
                    <OpeningHours />
                </div>
                {/* </div> */}
            </motion.div>
        </DefaultLayout >
    );
};

export default DestinationPage;