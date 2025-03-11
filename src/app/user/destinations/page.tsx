"use client";
import BlogData from "@/components/Blog/blogData";
import BlogItem from "@/components/Blog/BlogItem";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React, { useEffect } from "react";
import { getCityList } from "@/services/cityService";
import { getDistrictList } from "@/services/districtService";
import { getCategoryList } from "@/services/categoryService";
import { getSubCategoryList } from "@/services/subCategoryService";

interface LocationOption {
    label: string;
    value: string;
}

interface City {
    cityId: number;
    name: string;
}

interface District {
    districtId: number;
    name: string;
    cityId: number;
}

interface Category {
    categoryId: number;
    name: string;
}

interface SubCategory {
    subCategoryId: number;
    name: string;
    categoryId: number;
}

const BlogPage = () => {
    // State for storing cities and districts (Initially empty, will be filled via API later)
    const [cities, setCities] = React.useState<City[]>([]);
    const [districts, setDistricts] = React.useState<District[]>([]);
    const [filteredDistricts, setFilteredDistricts] = React.useState<District[]>([]);

    // State for selected city and district
    const [selectedCity, setSelectedCity] = React.useState<City | null>(null);
    const [selectedDistrict, setSelectedDistrict] = React.useState<District | null>(null);

    // State for categories & subcategories
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [subCategories, setSubCategories] = React.useState<SubCategory[]>([]);
    const [filteredSubCategories, setFilteredSubCategories] = React.useState<SubCategory[]>([]);
    const [selectedCategories, setSelectedCategories] = React.useState<number[]>([]); // Store category IDs
    const [selectedSubCategories, setSelectedSubCategories] = React.useState<number[]>([]); // Store subcategory IDs


    useEffect(() => {
        fetchCities();
        fetchDistricts();
        fetchCategories();
        fetchSubCategories();
    }, [])

    useEffect(() => {
        if (selectedCity) {
            setFilteredDistricts(districts.filter(district => district.cityId === selectedCity.cityId));
            setSelectedDistrict(null); // Reset district when city changes
        } else {
            setFilteredDistricts([]);
            setSelectedDistrict(null)
        }
    }, [selectedCity, districts]);

    useEffect(() => {
        setFilteredSubCategories(subCategories.filter(sub => selectedCategories.includes(sub.categoryId)));
        setSelectedSubCategories([]); // Reset subcategories when category changes
    }, [selectedCategories, subCategories]);

    const fetchCities = async () => {
        try {
            const response = await getCityList();
            if (response.status === 200) {
                setCities(response.data); // Assuming response.data is an array of cities
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    const fetchDistricts = async () => {
        try {
            const response = await getDistrictList();
            if (response.status === 200) {
                setDistricts(response.data); // Assuming response.data is an array of districts
            }
        } catch (error) {
            console.error("Error fetching districts:", error);
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

    const fetchSubCategories = async () => {
        try {
            const response = await getSubCategoryList();
            if (response.status === 200) setSubCategories(response.data);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };

    // Handle category selection (checkbox)
    const handleCategoryToggle = (id: number) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    // Handle subcategory selection (checkbox)
    const handleSubCategoryToggle = (id: number) => {
        setSelectedSubCategories(prev =>
            prev.includes(id) ? prev.filter(sc => sc !== id) : [...prev, id]
        );
    };

    // const handleSearch = () => {
    //     const searchData = {
    //         selectedCity,
    //         selectedDistricts,
    //         selectedCategories,
    //         selectedSubCategories,
    //     };
    //     console.log("Search Data:", searchData);
    //     // TODO: Implement API call to fetch destinations based on selected filters
    // };



    return (
        <>
            <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar - Auto-Height Based on Categories */}
                    <aside className="lg:w-1/4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md self-start">
                        <div>
                            <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                                Categories
                            </h4>
                            {/* <Autocomplete
                                disablePortal
                                options={top100Films}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Movie" />}
                            /> */}

                            {/* City Selection */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                                    Select City
                                </label>
                                <Autocomplete
                                    options={cities}
                                    getOptionLabel={(option) => option.name}
                                    value={selectedCity}
                                    onChange={(event, newValue) => setSelectedCity(newValue)}
                                    sx={{ width: "100%" }}
                                    renderInput={(params) => <TextField {...params} label="City" />}
                                />
                            </div>

                            {/* District Selection */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                                    Select District
                                </label>
                                <Autocomplete
                                    options={filteredDistricts}
                                    getOptionLabel={(option) => option.name}
                                    value={selectedDistrict}
                                    onChange={(event, newValue) => setSelectedDistrict(newValue)}
                                    sx={{ width: "100%" }}
                                    renderInput={(params) => <TextField {...params} label="District" />}
                                    disabled={!selectedCity}
                                />
                            </div>
                            {/* <ul className="space-y-3">
                                {["Blog", "Events", "Grids", "News", "Rounded"].map((category, index) => (
                                    <li key={index} className="transition-all duration-300 hover:text-primary">
                                        <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
                                            {category}
                                        </a>
                                    </li>
                                ))}
                            </ul> */}
                            {/* Category Selection (Checkbox) */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                                    Select Categories
                                </label>
                                <FormGroup>
                                    {categories.map((category) => (
                                        <FormControlLabel
                                            key={category.categoryId}
                                            control={
                                                <Checkbox
                                                    checked={selectedCategories.includes(category.categoryId)}
                                                    onChange={() => handleCategoryToggle(category.categoryId)}
                                                />
                                            }
                                            label={category.name}
                                        />
                                    ))}
                                </FormGroup>
                            </div>

                            {/* SubCategory Selection (Checkbox) */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                                    Select Subcategories
                                </label>
                                <FormGroup>
                                    {filteredSubCategories.map((subCategory) => (
                                        <FormControlLabel
                                            key={subCategory.subCategoryId}
                                            control={
                                                <Checkbox
                                                    checked={selectedSubCategories.includes(subCategory.subCategoryId)}
                                                    onChange={() => handleSubCategoryToggle(subCategory.subCategoryId)}
                                                />
                                            }
                                            label={subCategory.name}
                                        />
                                    ))}
                                </FormGroup>
                            </div>
                        </div>
                    </aside>

                    {/* Blog Grid */}
                    {/* <section className="lg:col-span-3"> */}
                    <section className="lg:w-3/4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {BlogData.map((post, key) => (
                                <BlogItem key={key} blog={post} />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default BlogPage;
