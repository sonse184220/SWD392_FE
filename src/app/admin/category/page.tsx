"use client"
import DefaultLayout from "@/components/Layouts/DefaultLayout"
import { motion } from "framer-motion";
import Category from "@/components/Category/Category";

const CategoryPage: React.FC = () => {
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
                    <h1 className="text-2xl font-semibold mb-4">Category Management</h1>
                    <Category />
                </div>
                {/* <div>
                    <h1 className="text-2xl font-semibold mb-4">District Management</h1>
                    <District />
                </div> */}
                {/* </div> */}
            </motion.div>
        </DefaultLayout >
    );
};

export default CategoryPage;