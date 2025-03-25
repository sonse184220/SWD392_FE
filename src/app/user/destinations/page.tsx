"use client";
import DestinationItem from "@/components/Destination/DestinationItem";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React, { useEffect } from "react";
import { getCityList } from "@/services/cityService";
import { getDistrictList } from "@/services/districtService";
import { getCategoryList } from "@/services/categoryService";
import { getSubCategoryList } from "@/services/subCategoryService";
import { getRecommendation } from "@/services/geminiAIService";
import { Destination } from "@/types/destination";
import SectionHeader from "@/components/CommonHeader/SectionHeader";
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ollamaSearch } from "@/services/ollamaAIService";
import { saveData } from "@/lib/dbIndex";

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

const DestinationRecommendPage = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [progress, setProgress] = React.useState<number>(0);

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

    const [destinationList, setDestinationList] = React.useState<Destination[]>([]);


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

    const handleSearch = async () => {
        try {
            setLoading(true);
            setProgress(0);

            let progressInterval = setInterval(() => {
                setProgress((prev) => (prev < 90 ? prev + 10 : prev)); // Increment but stop at 90%
            }, 500);

            let promptParts: string[] = ["Recommend places"];

            if (selectedCity) {
                promptParts.push(`in ${selectedCity.name}`);
            }

            if (selectedDistrict) {
                promptParts.push(`at ${selectedDistrict.name}`);
            }

            if (selectedCategories.length > 0) {
                const categoryNames = categories
                    .filter(cat => selectedCategories.includes(cat.categoryId))
                    .map(cat => cat.name)
                    .join(", ");
                promptParts.push(`about categories: ${categoryNames}`);
            }

            if (selectedSubCategories.length > 0) {
                const subCategoryNames = subCategories
                    .filter(sub => selectedSubCategories.includes(sub.subCategoryId))
                    .map(sub => sub.name)
                    .join(", ");
                promptParts.push(`covering subcategories: ${subCategoryNames}`);
            }

            const searchData = promptParts.join(" ") + "."; // Final prompt

            const response = await ollamaSearch(searchData);
            // const response = await getRecommendation(searchData);
            if (response.status === 200) {
                // setDestinationList(response.data); // Update the list with fetched destinations
                // Normalize data structure
                const normalizedData = response.data.results.map((destination: any) => ({
                    // const normalizedData = response.data.response.map((destination: any) => ({
                    destinationId: destination.destinationId ?? destination.id,
                    destinationName: destination.destinationName ?? destination.name,
                    address: destination.address,
                    description: destination.description,
                    rate: destination.rate,
                    categoryID: destination.categoryID,
                    ward: destination.ward,
                    status: destination.status,
                    categoryName: destination.categoryName,
                    districtName: destination.districtName,
                    openTime: destination.openTime,
                    closeTime: destination.closeTime
                }));
                setDestinationList(normalizedData);
                // saveData(normalizedData)
            }
        } catch (error) {
            console.error('Error fetching destinations:', error);
        } finally {
            setProgress(100);
            setTimeout(() => {
                setLoading(false);
                setProgress(0); // Hide progress after a short delay
            }, 500);
        }
    };



    return (
        <>
            <section id="features" className="py-10 lg:py-10 xl:py-10">
                <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
                    {/* <!-- Section Title Start --> */}
                    <SectionHeader
                        headerInfo={{
                            title: "Discover & Experience the Best of Every Destination",
                            subtitle: "Your Personalized Guide to Unforgettable Journeys",
                            description: `CityScout is your AI-powered travel companion, helping you explore vibrant cultures, iconic landmarks, and hidden gems. Whether you're looking for must-visit attractions, cultural experiences, or upcoming events, we provide personalized recommendations to make your journey unforgettable.`,
                        }}
                    />
                    {/* <!-- Section Title End --> */}

                </div>
            </section>

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
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                                Select Categories
                            </label>
                            <div className="mb-4 max-h-50 overflow-y-auto">

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

                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                                Select Subcategories
                            </label>
                            {/* SubCategory Selection (Checkbox) */}
                            <div className="mb-4 max-h-90 overflow-y-auto">

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

                            {/* Search Button */}
                            <Button variant="contained" color="primary" fullWidth onClick={handleSearch} disabled={!selectedCity}>
                                Search
                            </Button>
                        </div>
                    </aside>

                    {/* Destination Grid */}
                    {/* <section className="lg:w-3/4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {destinationList.map((place, key) => (
                                <DestinationItem key={key} destination={place} />
                            ))}
                        </div>
                    </section> */}
                    {/* Destination Grid */}
                    <section className="lg:w-3/4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md">
                        {loading ? (
                            // <LinearProgressWithLabel value={50} />} {/* Show progress when loading */}
                            <div className="h-full w-full flex items-center justify-center">

                                {/* <LinearProgress variant="determinate" className="w-3/4" /> */}
                                <Box sx={{ width: '75%', display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{ width: '100%', mr: 1 }}>
                                        <LinearProgress variant="determinate" value={progress} />
                                    </Box>
                                    <Box sx={{ minWidth: 35 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            {`${Math.round(progress)}%`}
                                        </Typography>
                                    </Box>
                                </Box>
                            </div>
                        )
                            :
                            ((destinationList.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {destinationList.map((place, key) => (
                                        <DestinationItem key={key} destination={place} />
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center text-center py-20">
                                    <img src="/noresult.png" alt="No results" className="w-48 h-48 mb-6 opacity-75" />
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">No destinations found</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        Try adjusting your filters or selecting a different city.
                                    </p>
                                </div>
                            )))}
                        {/* {destinationList.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {destinationList.map((place, key) => (
                                    <DestinationItem key={key} destination={place} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center py-20">
                                <img src="/noresult.png" alt="No results" className="w-48 h-48 mb-6 opacity-75" />
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">No destinations found</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    Try adjusting your filters or selecting a different city.
                                </p>
                            </div>
                        )} */}
                    </section>
                </div>
            </div>
        </>
    );
};

export default DestinationRecommendPage;
