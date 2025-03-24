"use client"
import DefaultLayout from "@/components/Layouts/DefaultLayout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React from "react";
import City from "@/components/CityDistrict/City";
import District from "@/components/CityDistrict/District";
import { motion } from "framer-motion";

interface CityDistrict {
    id: number;
    name: string;
}

const CityDistrictPage: React.FC = () => {
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
                    <h1 className="text-2xl font-semibold mb-4">City Management</h1>
                    <City />
                </div>
                <div>
                    <h1 className="text-2xl font-semibold mb-4">District Management</h1>
                    <District />
                </div>
                {/* </div> */}
            </motion.div>
        </DefaultLayout >
    );
};

export default CityDistrictPage;