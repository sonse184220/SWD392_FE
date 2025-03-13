// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// const District = () => {
//     const [districts, setDistricts] = useState<{ id: number; name: string }[]>(
//         []
//     );
//     const [isOpen, setIsOpen] = useState(false);
//     const [currentDistrict, setCurrentDistrict] = useState<{ id: number; name: string } | null>(null);

//     const openDialog = (district?: { id: number; name: string }) => {
//         setCurrentDistrict(district || { id: 0, name: "" });
//         setIsOpen(true);
//     };

//     return (
//         <div>
//             {/* <Button onClick={() => openDialog()}>Add District</Button> */}
//             <div className="mb-4">
//                 <Button onClick={() => openDialog()} className="bg-blue-500 hover:bg-blue-600">
//                     + Add District
//                 </Button>
//             </div>
//             <Table>
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead>ID</TableHead>
//                         <TableHead>Name</TableHead>
//                         <TableHead>Actions</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {districts.map((district) => (
//                         <TableRow key={district.id}>
//                             <TableCell>{district.id}</TableCell>
//                             <TableCell>{district.name}</TableCell>
//                             <TableCell>
//                                 <Button onClick={() => openDialog(district)}>Edit</Button>
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//             <Dialog open={isOpen} onOpenChange={setIsOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>{currentDistrict?.id ? "Edit District" : "Add District"}</DialogTitle>
//                     </DialogHeader>
//                     {/* Form Fields Here */}
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// };
// export default District;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { getDistrictList } from "@/services/districtService";

interface District {
    districtId: number;
    name: string;
    description: string;
    cityId: number;
}

const District = () => {
    const [districts, setDistricts] = useState<District[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [currentDistrict, setCurrentDistrict] = useState<District | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [cityId, setCityId] = useState(0);

    useEffect(() => {
        fetchDistricts();
    }, []);

    const fetchDistricts = async () => {
        try {
            const response = await getDistrictList();
            if (response.status === 200) setDistricts(response.data);
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    const openDialog = (district?: District) => {
        if (district) {
            setCurrentDistrict(district);
            setName(district.name);
            setDescription(district.description);
            setCityId(district.cityId);
        } else {
            setCurrentDistrict(null);
            setName("");
            setDescription("");
            setCityId(0);
        }
        setIsOpen(true);
    };

    const handleSave = async () => {
        const method = currentDistrict ? "PUT" : "POST";
        const endpoint = currentDistrict ? `/api/districts/${currentDistrict.districtId}` : "/api/districts";
        try {
            await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description, cityId }),
            });
            fetchDistricts();
            setIsOpen(false);
        } catch (error) {
            console.error("Error saving district:", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await fetch(`/api/districts/${id}`, { method: "DELETE" });
            fetchDistricts();
        } catch (error) {
            console.error("Error deleting district:", error);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-4">
                <Button onClick={() => openDialog()} className="bg-blue-500 hover:bg-blue-600">
                    + Add District
                </Button>
            </div>
            <Table className="w-full border">
                <TableHeader>
                    <TableRow className="bg-gray-200 dark:bg-gray-700">
                        <TableHead className="border px-4 py-2">ID</TableHead>
                        <TableHead className="border px-4 py-2">Name</TableHead>
                        <TableHead className="border px-4 py-2">Description</TableHead>
                        <TableHead className="border px-4 py-2">City ID</TableHead>
                        <TableHead className="border px-4 py-2">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {districts.map((district) => (
                        <TableRow key={district.districtId}>
                            <TableCell className="border px-4 py-2">{district.districtId}</TableCell>
                            <TableCell className="border px-4 py-2">{district.name}</TableCell>
                            <TableCell className="border px-4 py-2">{district.description}</TableCell>
                            <TableCell className="border px-4 py-2">{district.cityId}</TableCell>
                            <TableCell className="border px-4 py-2">
                                <Button variant="outline" onClick={() => openDialog(district)} className="mr-2">
                                    Edit
                                </Button>
                                <Button variant="destructive" onClick={() => handleDelete(district.districtId)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{currentDistrict ? "Edit District" : "Add District"}</DialogTitle>
                    </DialogHeader>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter district name"
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    />
                    <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description"
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    />
                    <Input type="number" value={cityId} onChange={(e) => setCityId(Number(e.target.value))} placeholder="Enter City ID"
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    />
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default District;
