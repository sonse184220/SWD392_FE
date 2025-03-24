import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { addDistrict, deleteDistrict, getDistrictList, updateDistrict } from "@/services/districtService";
import { getCityList } from "@/services/cityService";
import { toast } from "react-toastify";

interface District {
    districtId?: string;
    name: string;
    description: string;
    cityId: string;
}

interface City {
    cityId: string;
    name: string;
}

const District = () => {
    const [districts, setDistricts] = useState<District[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [currentDistrict, setCurrentDistrict] = useState<District | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [cityId, setCityId] = useState("");

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchDistricts();
        fetchCities();
    }, []);

    const fetchDistricts = async () => {
        try {
            const response = await getDistrictList();
            if (response.status === 200) setDistricts(response.data);
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    const fetchCities = async () => {
        try {
            const response = await getCityList();
            if (response.status === 200) setCities(response.data);
        } catch (error) {
            console.error("Error fetching cities:", error);
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
            setCityId("");
        }
        setIsOpen(true);
    };

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("District name is required!");
            return;
        }

        if (!description.trim()) {
            toast.error("District description is required!");
            return;
        }
        if (!cityId) {
            toast.error("CityId is required!");
            return;
        }

        const districtData: District = { name, description, cityId };

        try {
            if (currentDistrict?.districtId) {
                await updateDistrict(currentDistrict.districtId, districtData);
            } else {
                await addDistrict(districtData);
            }
            fetchDistricts();
            setIsOpen(false);
        } catch (error) {
            console.error("Error saving district:", error);
        }
    };

    // const handleDelete = async (id: string) => {
    //     try {
    //         await deleteDistrict(id);
    //         fetchDistricts();
    //     } catch (error) {
    //         console.error("Error deleting district:", error);
    //     }
    // };

    const confirmDelete = (id?: string) => {
        setDeleteId(id ?? null);
        setIsConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteDistrict(deleteId);
            toast.success("District deleted successfully");
            fetchDistricts();
        } catch (error) {
            toast.error("Error deleting district");
        } finally {
            setIsConfirmOpen(false);
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
                                <Button variant="destructive" onClick={() => confirmDelete(district.districtId)}>
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
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name"
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none" />
                    <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description"
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none" />
                    {/* <Input value={cityId} onChange={(e) => setCityId(e.target.value)} placeholder="Enter city ID"
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none" /> */}
                    <select value={cityId} onChange={(e) => setCityId(e.target.value)} className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none">
                        <option value="">Select City</option>
                        {cities.map(city => (
                            <option key={city.cityId} value={city.cityId}
                                className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none">{city.name}</option>
                        ))}
                    </select>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this district?</p>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default District;
