import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { addDestination, deleteDestination, getDestinationList, updateDestination } from "@/services/destinationService";
import { getCategoryList } from "@/services/categoryService";
import { getDistrictList } from "@/services/districtService";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "react-toastify";
import { error } from "console";

const ITEMS_PER_PAGE = 5; // Number of items per page

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
    imageUrl: string;
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
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(filteredDestinations.length / ITEMS_PER_PAGE);

    // Get paginated items
    const paginatedDestinations = filteredDestinations.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [categories, setCategories] = useState<Category[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);

    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [destinationToDelete, setDestinationToDelete] = useState<Destination | null>(null);


    const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
    const [destinationName, setDestinationName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [rate, setRate] = useState(0);
    const [categoryId, setCategoryId] = useState("");
    const [districtId, setDistrictId] = useState("");
    const [status, setStatus] = useState("Active");
    const [ward, setWard] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageView, setImageView] = useState<string | null>(null);


    useEffect(() => {
        setIsLoading(true);
        fetchDestinations();
        fetchCategories();
        fetchDistricts();
        setIsLoading(false);
    }, []);

    useEffect(() => {
        // Filter destinations whenever the search term changes
        filterDestinations();
    }, [searchTerm, destinations]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const filterDestinations = () => {
        if (!searchTerm.trim()) {
            setFilteredDestinations(destinations);
            return;
        }

        const filtered = destinations.filter(dest =>
            dest.destinationName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredDestinations(filtered);
    };

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
            if (response.status === 200) {
                setDestinations(response.data);
                setFilteredDestinations(destinations);
            }
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
            if (destination.imageUrl) setImageView(destination.imageUrl);
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
            setImageFile(null);
            setImageView(null);
        }
        setIsOpen(true);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setImageFile(event.target.files[0]);
        }
    };

    const handleSave = async () => {
        try {
            if (!destinationName.trim()) {
                toast.error("Destination name is required!");
                return;
            }
            if (!address.trim()) {
                toast.error("Address is required!");
                return;
            }
            if (!description.trim()) {
                toast.error("Description is required!");
                return;
            }
            if (!categoryId) {
                toast.error("Category is required!");
                return;
            }
            if (!districtId) {
                toast.error("District is required!");
                return;
            }
            if (rate < 0 || rate > 5) {
                toast.error("Rate must be between 0 and 5!");
                return;
            }
            if (!ward.trim()) {
                toast.error("Ward is required!");
                return;
            }
            const destinationData = { destinationName, address, description, rate, categoryId, districtId, status, ward, imageFile };
            if (!currentDestination) {
                const response = await addDestination(destinationData);
                if (response.status === 201) {
                    setIsOpen(false);
                    toast.success("Destination added successful!");
                } else if (response.status === 500) {
                    throw new Error("Failed to add destination");
                }
            } else {
                const response = await updateDestination(currentDestination.destinationId, destinationData);
                if (response.status === 204) {
                    setIsOpen(false);
                    toast.success("Destination updated successful!");
                } else if (response.status === 500) {
                    throw new Error("Failed to add destination");
                }
            }
            fetchDestinations();
        } catch (error) {
            toast.error("An error occurred. Please try again.");
            console.error("Error saving destination:", error);
        }
        //  finally {
        //     fetchDestinations();
        //     setIsOpen(false);
        // }
    };

    const handleDelete = async () => {
        try {
            if (!destinationToDelete) return;
            await deleteDestination(destinationToDelete.destinationId);
            toast.success("Destination deleted successfully!");
            fetchDestinations();
        } catch (error) {
            toast.error("Error deleting destination!");
            console.error("Error deleting destination:", error);
        } finally {
            setIsDeleteOpen(false);
            setDestinationToDelete(null);
        }
    };

    const openConfirmDialog = (destination: Destination) => {
        setDestinationToDelete(destination);
        setIsDeleteOpen(true);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
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
                <div className="relative flex items-center w-64 m-2">
                    <Search className="absolute left-2 text-gray-400" size={18} />
                    <Input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="pl-8 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <Table className="w-full">
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
                    {paginatedDestinations.map((destination) => (
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
                                <Button variant="destructive" onClick={() => openConfirmDialog(destination)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-center mt-4">
    <Pagination>
        <PaginationContent>
            {/* Nút Previous */}
            <PaginationItem>
                <PaginationPrevious 
                    href="#" 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
            </PaginationItem>

            {/* Trang đầu tiên */}
            <PaginationItem>
                <PaginationLink
                    href="#"
                    isActive={currentPage === 1}
                    onClick={() => handlePageChange(1)}
                >
                    1
                </PaginationLink>
            </PaginationItem>

            {/* Hiển thị dấu "..." nếu trang hiện tại cách trang đầu > 2 */}
            {currentPage > 4 && totalPages > 5 && (
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
            )}

            {/* Các trang xung quanh trang hiện tại */}
            {Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter(page => {
                    // Chỉ hiển thị các trang gần trang hiện tại (trừ trang đầu và cuối)
                    return (
                        page > 1 && 
                        page < totalPages && 
                        Math.abs(page - currentPage) <= 1
                    );
                })
                .map(page => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

            {/* Hiển thị dấu "..." nếu trang hiện tại cách trang cuối > 2 */}
            {currentPage < totalPages - 2 && totalPages > 3 && (
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
            )}

            {/* Trang cuối cùng (nếu totalPages > 1) */}
            {totalPages > 1 && (
                <PaginationItem>
                    <PaginationLink
                        href="#"
                        isActive={currentPage === totalPages}
                        onClick={() => handlePageChange(totalPages)}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            )}

            {/* Nút Next */}
            <PaginationItem>
                <PaginationNext 
                    href="#" 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
            </PaginationItem>
        </PaginationContent>
    </Pagination>
</div>

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
                    {imageView && (
                        <img
                            src={imageView}
                            alt="Current"
                            className="h-32 w-32 object-cover my-2"
                        />
                    )}
                    <Input type="file" accept="image/*" onChange={handleFileChange}
                        className="mt-4 w-full h-auto cursor-pointer rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 
                         file:mr-4 file:rounded-md file:border-0 file:bg-blue-600  file:text-black-2 
                         hover:file:bg-blue-500 focus:border-blue-500 focus:outline-none transition duration-300 file:cursor-pointer"
                    // className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    />
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Confirm Delete
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        Are you sure you want to delete  <span className="font-bold">{destinationToDelete?.destinationName}</span>?
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsDeleteOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Destination;