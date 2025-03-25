import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { getSubCategoryList, addSubCategory, updateSubCategory, deleteSubCategory } from "@/services/subCategoryService";
import { getCategoryList } from "@/services/categoryService";
import { toast } from "react-toastify";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface SubCategory {
    subCategoryId?: string;
    name: string;
    description: string;
    categoryId: string;
}

interface Category {
    categoryId: string;
    name: string;
}

const ITEMS_PER_PAGE = 5; // Adjust as needed

const SubCategoryComponent = () => {
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [currentSubCategory, setCurrentSubCategory] = useState<SubCategory | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [subCategoryToDelete, setSubCategoryToDelete] = useState<SubCategory | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(subCategories.length / ITEMS_PER_PAGE);
    const paginatedSubCategories = subCategories.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        fetchSubCategories();
        fetchCategories();
    }, []);

    const fetchSubCategories = async () => {
        try {
            const response = await getSubCategoryList();
            if (response.status === 200) setSubCategories(response.data);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getCategoryList();
            if (response.status === 200) setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const openDialog = (subCategory?: SubCategory) => {
        if (subCategory) {
            setCurrentSubCategory(subCategory);
            setName(subCategory.name);
            setDescription(subCategory.description);
            setCategoryId(subCategory.categoryId);
        } else {
            setCurrentSubCategory(null);
            setName("");
            setDescription("");
            setCategoryId("");
        }
        setIsOpen(true);
    };

    const handleSave = async () => {
        const subCategoryData: SubCategory = { name, description, categoryId };
    
        try {
            if (currentSubCategory?.subCategoryId) {
                await updateSubCategory(currentSubCategory.subCategoryId, subCategoryData);
                toast.success("SubCategory updated successfully!");
            } else {
                await addSubCategory(subCategoryData);
                toast.success("SubCategory added successfully!");
            }
            fetchSubCategories();
            setIsOpen(false);
        } catch (error) {
            toast.error("Failed to save subcategory. Please try again.");
            console.error("Error saving subcategory:", error);
        }
    };
    

    const openDeleteDialog = (subCategory: SubCategory) => {
        setSubCategoryToDelete(subCategory);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (subCategoryToDelete?.subCategoryId) {
            try {
                await deleteSubCategory(subCategoryToDelete.subCategoryId);
                toast.success("SubCategory deleted successfully!");
                fetchSubCategories();
            } catch (error) {
                toast.error("Failed to delete subcategory. Please try again.");
                console.error("Error deleting subcategory:", error);
            } finally {
                setIsDeleteOpen(false);
                setSubCategoryToDelete(null);
            }
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-6">
            <div className="mb-4">
                <Button onClick={() => openDialog()} className="bg-blue-500 hover:bg-blue-600">
                    + Add SubCategory
                </Button>
            </div>
            <Table className="w-full border">
                <TableHeader>
                    <TableRow className="bg-gray-200 dark:bg-gray-700">
                        <TableHead className="border px-4 py-2">ID</TableHead>
                        <TableHead className="border px-4 py-2">Name</TableHead>
                        <TableHead className="border px-4 py-2">Description</TableHead>
                        <TableHead className="border px-4 py-2">Category</TableHead>
                        <TableHead className="border px-4 py-2">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedSubCategories.map((subCategory) => (
                        <TableRow key={subCategory.subCategoryId}>
                            <TableCell className="border px-4 py-2">{subCategory.subCategoryId}</TableCell>
                            <TableCell className="border px-4 py-2">{subCategory.name}</TableCell>
                            <TableCell className="border px-4 py-2">{subCategory.description}</TableCell>
                            <TableCell className="border px-4 py-2">
                                {categories.find(cat => cat.categoryId === subCategory.categoryId)?.name || subCategory.categoryId}
                            </TableCell>
                            <TableCell className="border px-4 py-2">
                                <Button variant="outline" onClick={() => openDialog(subCategory)} className="mr-2">
                                    Edit
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    onClick={() => openDeleteDialog(subCategory)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            {subCategories.length > 0 && (
                <Pagination className="mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                onClick={handlePrevious}
                                className={`cursor-pointer ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    onClick={() => handlePageClick(page)}
                                    isActive={currentPage === page}
                                    className="cursor-pointer"
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext 
                                onClick={handleNext}
                                className={`cursor-pointer ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{currentSubCategory ? "Edit SubCategory" : "Add SubCategory"}</DialogTitle>
                    </DialogHeader>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name"
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none" />
                    <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description"
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none" />
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} 
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none">
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        Are you sure you want to delete <span className="font-bold">{subCategoryToDelete?.name}</span>?
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsDeleteOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SubCategoryComponent;