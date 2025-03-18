import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { addDestination, deleteDestination, getDestinationList, updateDestination } from "@/services/destinationService";
import { getCategoryList } from "@/services/categoryService";
import { getDistrictList } from "@/services/districtService";

interface Destination {
    destinationId: string;
    destinationName: string;
    address: string;
    description: string;
    rate: number;
    categoryId: string;
    ward: string;
    status: string;
    districtId: string;
}

interface Category {
    categoryId: string;
    name: string;
    description: string;
}

interface District {
    districtId?: string;
    name: string;
    description: string;
    cityId: string;
}

// const categories = [
//     { id: "1", name: "Nature" },
//     { id: "2", name: "Historical" },
//     { id: "3", name: "Entertainment" }
// ];

// const districts = [
//     { id: "1", name: "District 1" },
//     { id: "2", name: "District 2" },
//     { id: "3", name: "District 3" }
// ];

const Destination = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);

    const [isOpen, setIsOpen] = useState(false);
    const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
    const [destinationName, setDestinationName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [rate, setRate] = useState(0);
    const [categoryId, setCategoryId] = useState("");
    const [districtId, setDistrictId] = useState("");
    const [status, setStatus] = useState("Active");
    const [ward, setWard] = useState("");

    useEffect(() => {
        setIsLoading(true);
        fetchDestinations();
        fetchCategories();
        fetchDistricts();
        setIsLoading(false);
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getCategoryList();
            if (response.status === 200) setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchDistricts = async () => {
        try {
            const response = await getDistrictList();
            if (response.status === 200) setDistricts(response.data);
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    const fetchDestinations = async () => {
        try {
            const response = await getDestinationList();
            if (response.status === 200) setDestinations(response.data);
        } catch (error) {
            console.error("Error fetching destinations:", error);
        }
    };

    const openDialog = (destination?: Destination) => {
        if (destination) {
            setCurrentDestination(destination);
            setDestinationName(destination.destinationName);
            setAddress(destination.address);
            setDescription(destination.description);
            setRate(destination.rate);
            setCategoryId(destination.categoryId);
            setDistrictId(destination.districtId);
            setWard(destination.ward);
            setStatus(destination.status);
        } else {
            setCurrentDestination(null);
            setDestinationName("");
            setAddress("");
            setDescription("");
            setRate(0);
            setCategoryId("");
            setDistrictId("");
            setWard("");
            setStatus("Active");
        }
        setIsOpen(true);
    };

    const handleSave = async () => {
        try {
            const destinationData = { destinationName, address, description, rate, categoryId, districtId, status, ward };
            if (!currentDestination) {
                await addDestination(destinationData);
            } else {
                await updateDestination(currentDestination.destinationId, destinationData);
            }
        } catch (error) {
            console.error("Error saving destination:", error);
        } finally {
            fetchDestinations();
            setIsOpen(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteDestination(id);
            fetchDestinations();
        } catch (error) {
            console.error("Error deleting destination:", error);
        }
    };

    if (isLoading)
        return (
            <div>Loading...</div>
        )

    return (
        <div className="p-6">
            <div className="mb-4">
                <Button onClick={() => openDialog()} className="bg-blue-500 hover:bg-blue-600">
                    + Add Destination
                </Button>
            </div>
            <Table className="w-full border">
                <TableHeader>
                    <TableRow className="bg-gray-200 dark:bg-gray-700">
                        {/* <TableHead className="border px-4 py-2">ID</TableHead> */}
                        <TableHead className="border px-4 py-2">Name</TableHead>
                        <TableHead className="border px-4 py-2">Address</TableHead>
                        <TableHead className="border px-4 py-2">Rate</TableHead>
                        <TableHead className="border px-4 py-2">Category</TableHead>
                        <TableHead className="border px-4 py-2">District</TableHead>
                        <TableHead className="border px-4 py-2">Status</TableHead>
                        <TableHead className="border px-4 py-2">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {destinations.map((destination) => (
                        <TableRow key={destination.destinationId}>
                            {/* <TableCell className="border px-4 py-2">{destination.destinationId}</TableCell> */}
                            <TableCell className="border px-4 py-2">{destination.destinationName}</TableCell>
                            <TableCell className="border px-4 py-2">{destination.address}</TableCell>
                            <TableCell className="border px-4 py-2">{destination.rate}</TableCell>
                            <TableCell className="border px-4 py-2">{categories.find(c => c.categoryId === destination.categoryId)?.name}</TableCell>
                            <TableCell className="border px-4 py-2">{districts.find(d => d.districtId === destination.districtId)?.name}</TableCell>
                            <TableCell className="border px-4 py-2">{destination.status}</TableCell>
                            <TableCell className="border px-4 py-2">
                                <Button variant="outline" onClick={() => openDialog(destination)} className="mr-2">
                                    Edit
                                </Button>
                                <Button variant="destructive" onClick={() => handleDelete(destination.destinationId)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-h-100 overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{currentDestination ? "Edit Destination" : "Add Destination"}</DialogTitle>
                    </DialogHeader>
                    <Input value={destinationName} onChange={(e) => setDestinationName(e.target.value)} placeholder="Enter destination name"
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none" />
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter address"
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none" />
                    <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description"
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none" />
                    <Input value={ward} onChange={(e) => setWard(e.target.value)} placeholder="Enter ward"
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none" />
                    <Input type="number" value={rate} onChange={(e) => setRate(Math.max(0, Math.min(5, Number(e.target.value))))} placeholder="Enter rate (0-5)"
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none" />
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none">
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat.categoryId} value={cat.categoryId}
                            className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none">{cat.name}</option>)}
                    </select>
                    <select value={districtId} onChange={(e) => setDistrictId(e.target.value)}
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none">
                        <option value="">Select District</option>
                        {districts.map(dist => <option key={dist.districtId} value={dist.districtId}
                            className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none">{dist.name}</option>)}
                    </select>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none">
                        <option value="Active"
                            className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none">Active</option>
                        <option value="Inactive"
                            className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none">Inactive</option>
                    </select>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Destination;