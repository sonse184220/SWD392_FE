import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { getSubCategoryList, addSubCategory, updateSubCategory, deleteSubCategory } from "@/services/subCategoryService";
import { getCategoryList } from "@/services/categoryService";

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

const SubCategoryComponent = () => {
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [currentSubCategory, setCurrentSubCategory] = useState<SubCategory | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");

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
            } else {
                await addSubCategory(subCategoryData);
            }
            fetchSubCategories();
            setIsOpen(false);
        } catch (error) {
            console.error("Error saving subcategory:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteSubCategory(id);
            fetchSubCategories();
        } catch (error) {
            console.error("Error deleting subcategory:", error);
        }
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
                    {subCategories.map((subCategory) => (
                        <TableRow key={subCategory.subCategoryId}>
                            <TableCell className="border px-4 py-2">{subCategory.subCategoryId}</TableCell>
                            <TableCell className="border px-4 py-2">{subCategory.name}</TableCell>
                            <TableCell className="border px-4 py-2">{subCategory.description}</TableCell>
                            <TableCell className="border px-4 py-2">{subCategory.categoryId}</TableCell>
                            <TableCell className="border px-4 py-2">
                                <Button variant="outline" onClick={() => openDialog(subCategory)} className="mr-2">
                                    Edit
                                </Button>
                                <Button variant="destructive" onClick={() => handleDelete(subCategory.subCategoryId!)}>
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
                        <DialogTitle>{currentSubCategory ? "Edit SubCategory" : "Add SubCategory"}</DialogTitle>
                    </DialogHeader>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name"
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none" />
                    <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description"
                        className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none" />
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none">
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.categoryId} value={category.categoryId} className="mt-4 w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none">
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
        </div>
    );
};

export default SubCategoryComponent;
