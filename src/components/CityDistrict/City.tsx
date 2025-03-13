// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// interface City {
//     id: number;
//     name: string;
// }

// const City = () => {
//     const [cities, setCities] = useState<City[]>([]);
//     const [isOpen, setIsOpen] = useState(false);
//     const [currentCity, setCurrentCity] = useState<City | null>(null);

//     const openDialog = (city?: City) => {
//         setCurrentCity(city || { id: 0, name: "" });
//         setIsOpen(true);
//     };

//     return (
//         <div>
//             {/* <Button onClick={() => openDialog()}>Add City</Button> */}
//             <div className="mb-4">
//                 <Button onClick={() => openDialog()} className="bg-blue-500 hover:bg-blue-600">
//                     + Add City
//                 </Button>
//             </div>
//             <Table className="w-full border">
//                 <TableHeader>
//                     <TableRow className="bg-gray-200 dark:bg-gray-700">
//                         <TableHead className="border px-4 py-2">ID</TableHead>
//                         <TableHead>Name</TableHead>
//                         <TableHead>Actions</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {cities.map((city) => (
//                         <TableRow key={city.id}>
//                             <TableCell className="border px-4 py-2">{city.id}</TableCell>
//                             <TableCell className="border px-4 py-2">{city.name}</TableCell>
//                             <TableCell className="border px-4 py-2">
//                                 <Button onClick={() => openDialog(city)}>Edit</Button>
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//             <Dialog open={isOpen} onOpenChange={setIsOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>{currentCity?.id ? "Edit City" : "Add City"}</DialogTitle>
//                     </DialogHeader>
//                     {/* Form Fields Here */}
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// };
// export default City;



// // // CityDistrictPage.tsx
// // import City from "./City";
// // import District from "./District";

// // const CityDistrictPage = () => {
// //   return (
// //     <div>
// //       <h2>City Management</h2>
// //       <City />
// //       <h2>District Management</h2>
// //       <District />
// //     </div>
// //   );
// // };

// // export default CityDistrictPage;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { addCity, deleteCity, getCityList, updateCity } from "@/services/cityService";

interface City {
    cityId: string;
    name: string;
    description: string;
}

const City = () => {
    const [cities, setCities] = useState<City[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [currentCity, setCurrentCity] = useState<City | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await getCityList() // Adjust API endpoint
            if (response.status === 200)
                setCities(response.data);
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    const openDialog = (city?: City) => {
        if (city) {
            setCurrentCity(city);
            setName(city.name);
            setDescription(city.description);
        } else {
            setCurrentCity(null);
            setName("");
            setDescription("");
        }
        setIsOpen(true);
    };

    const handleSave = async () => {
        // const method = currentCity ? "PUT" : "POST";
        // const endpoint = currentCity ? `/api/cities/${currentCity.cityId}` : "/api/cities";
        try {
            // await fetch(endpoint, {
            //     method,
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ name, description }),
            // });
            if (!currentCity) {
                const response = await addCity({ name, description });
                // if(response.status === 200 || response.status === 201)
            } else {
                const response = await updateCity(currentCity.cityId, { name, description });
            }
            // fetchCities();
            // setIsOpen(false);
        } catch (error) {
            console.error("Error saving city:", error);
        } finally {
            fetchCities();
            setIsOpen(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            // await fetch(`/api/cities/${id}`, { method: "DELETE" });
            const response = await deleteCity(id);
            fetchCities();
        } catch (error) {
            console.error("Error deleting city:", error);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-4">
                <Button onClick={() => openDialog()} className="bg-blue-500 hover:bg-blue-600">
                    + Add City
                </Button>
            </div>
            <Table className="w-full border">
                <TableHeader>
                    <TableRow className="bg-gray-200 dark:bg-gray-700">
                        <TableHead className="border px-4 py-2">ID</TableHead>
                        <TableHead className="border px-4 py-2">Name</TableHead>
                        <TableHead className="border px-4 py-2">Description</TableHead>
                        <TableHead className="border px-4 py-2">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cities.map((city) => (
                        <TableRow key={city.cityId}>
                            <TableCell className="border px-4 py-2">{city.cityId}</TableCell>
                            <TableCell className="border px-4 py-2">{city.name}</TableCell>
                            <TableCell className="border px-4 py-2">{city.description}</TableCell>
                            <TableCell className="border px-4 py-2">
                                <Button variant="outline" onClick={() => openDialog(city)} className="mr-2">
                                    Edit
                                </Button>
                                <Button variant="destructive" onClick={() => handleDelete(city.cityId)}>
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
                        <DialogTitle>{currentCity ? "Edit City" : "Add City"}</DialogTitle>
                    </DialogHeader>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter city name"
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    />
                    <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description"
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

export default City;
