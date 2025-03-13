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
    // const [data, setData] = React.useState<CityDistrict[]>([
    //     { id: 1, name: "New York" },
    //     { id: 2, name: "Los Angeles" },
    // ]);

    // const [selectedItem, setSelectedItem] = React.useState<CityDistrict | null>(null);
    // const [isOpen, setIsOpen] = React.useState(false);
    // const [name, setName] = React.useState("");

    // // Open dialog for create or update
    // const openDialog = (item?: CityDistrict) => {
    //     setSelectedItem(item || null);
    //     setName(item?.name || "");
    //     setIsOpen(true);
    // };

    // // Close dialog
    // const closeDialog = () => {
    //     setIsOpen(false);
    //     setSelectedItem(null);
    //     setName("");
    // };

    // // Handle save (Create or Update)
    // const handleSave = () => {
    //     if (selectedItem) {
    //         // Update
    //         setData((prev) =>
    //             prev.map((item) => (item.id === selectedItem.id ? { ...item, name } : item))
    //         );
    //     } else {
    //         // Create
    //         setData((prev) => [...prev, { id: prev.length + 1, name }]);
    //     }
    //     closeDialog();
    // };

    // // Handle delete
    // const handleDelete = (id: number) => {
    //     setData((prev) => prev.filter((item) => item.id !== id));
    // };


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

// <div className="p-6">
//                 <h1 className="text-2xl font-semibold mb-4">City & District Management</h1>

//                 {/* Add Button */}
//                 <div className="mb-4">
//                     <Button onClick={() => openDialog()} className="bg-blue-500 hover:bg-blue-600">
//                         + Add City/District
//                     </Button>
//                 </div>

//                 {/* Table */}
//                 <Table className="w-full border">
//                     <TableHeader>
//                         <TableRow className="bg-gray-200 dark:bg-gray-700">
//                             <TableHead className="border px-4 py-2">ID</TableHead>
//                             <TableHead className="border px-4 py-2">Name</TableHead>
//                             <TableHead className="border px-4 py-2">Actions</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {data.map((item) => (
//                             <TableRow key={item.id}>
//                                 <TableCell className="border px-4 py-2">{item.id}</TableCell>
//                                 <TableCell className="border px-4 py-2">{item.name}</TableCell>
//                                 <TableCell className="border px-4 py-2">
//                                     <Button variant="outline" onClick={() => openDialog(item)} className="mr-2">
//                                         Edit
//                                     </Button>
//                                     <Button variant="destructive" onClick={() => handleDelete(item.id)}>
//                                         Delete
//                                     </Button>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>

//                 {/* Dialog for Create & Edit */}
//                 <Dialog open={isOpen} onOpenChange={setIsOpen}>
//                     <DialogContent>
//                         <DialogHeader>
//                             <DialogTitle>{selectedItem ? "Edit City/District" : "Add City/District"}</DialogTitle>
//                         </DialogHeader>
//                         <Input
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             placeholder="Enter name"
//                             className="mt-4"
//                         />
//                         <DialogFooter>
//                             <Button variant="secondary" onClick={closeDialog}>
//                                 Cancel
//                             </Button>
//                             <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
//                                 Save
//                             </Button>
//                         </DialogFooter>
//                     </DialogContent>
//                 </Dialog>
//             </div>