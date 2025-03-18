import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDestinationList } from "@/services/destinationService";
import { getOpeningHoursByDestinationId, addOpeningHour, updateOpeningHour, deleteOpeningHour } from "@/services/openingHourService";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

interface OpeningHour {
    destinationId: string;
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
}

interface Destination {
    destinationId: string;
    destinationName: string;
}

const dayOfWeekOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const OpeningHours = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);
    const [selectedDestinationId, setSelectedDestinationId] = useState<string>("");
    const [selectedDestinationName, setSelectedDestinationName] = useState<string>("");

    const [isOpen, setIsOpen] = useState(false);
    const [currentOpeningHour, setCurrentOpeningHour] = useState<OpeningHour | null>(null);
    const [dayOfWeek, setDayOfWeek] = useState("");
    const [openTime, setOpenTime] = useState("");
    const [closeTime, setCloseTime] = useState("");
    const [isClosed, setIsClosed] = useState(false);

    useEffect(() => {
        fetchDestinations();
    }, []);

    useEffect(() => {
        if (selectedDestinationId) {
            fetchOpeningHours(selectedDestinationId);
        }
    }, [selectedDestinationId]);

    const fetchDestinations = async () => {
        setIsLoading(true);
        try {
            const response = await getDestinationList();
            if (response.status === 200) {
                setDestinations(response.data);
                if (response.data.length > 0 && !selectedDestinationId) {
                    setSelectedDestinationId(response.data[0].destinationId);
                    setSelectedDestinationName(response.data[0].destinationName);
                }
            }
        } catch (error) {
            console.error("Error fetching destinations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOpeningHours = async (destinationId: string) => {
        setIsLoading(true);
        try {
            const response = await getOpeningHoursByDestinationId(destinationId);
            if (response.status === 200) {
                setOpeningHours(response.data);
            }
        } catch (error) {
            console.error("Error fetching opening hours:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const destinationId = e.target.value;
        setSelectedDestinationId(destinationId);
        const destinationName = destinations.find(d => d.destinationId === destinationId)?.destinationName || "";
        setSelectedDestinationName(destinationName);
    };

    const openDialog = (openingHour?: OpeningHour) => {
        if (openingHour) {
            setCurrentOpeningHour(openingHour);
            setDayOfWeek(openingHour.dayOfWeek);
            setOpenTime(openingHour.openTime);
            setCloseTime(openingHour.closeTime);
            setIsClosed(openingHour.isClosed);
        } else {
            setCurrentOpeningHour(null);
            setDayOfWeek("");
            setOpenTime("08:00");
            setCloseTime("17:00");
            setIsClosed(false);
        }
        setIsOpen(true);
    };

    const handleSave = async () => {
        if (!selectedDestinationId) {
            alert("Please select a destination first");
            return;
        }

        try {
            const openingHourData = {
                destinationId: selectedDestinationId,
                dayOfWeek,
                openTime,
                closeTime,
                isClosed,
            };

            if (!currentOpeningHour) {
                await addOpeningHour(openingHourData);
            } else {
                await updateOpeningHour(selectedDestinationId, currentOpeningHour.dayOfWeek, openingHourData);
            }

            fetchOpeningHours(selectedDestinationId);
            setIsOpen(false);
        } catch (error) {
            console.error("Error saving opening hour:", error);
        }
    };

    const handleDelete = async (destinationId: string, dayOfWeek: string) => {
        try {
            await deleteOpeningHour(destinationId, dayOfWeek);
            fetchOpeningHours(selectedDestinationId);
        } catch (error) {
            console.error("Error deleting opening hour:", error);
        }
    };

    const formatTimeString = (timeString: string) => {
        if (!timeString) return "-";
        return timeString;
    };

    if (isLoading && !destinations.length) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                {/* <h2 className="text-2xl font-bold mb-4">Opening Hours Management</h2> */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-64">
                        <Label htmlFor="destination-select">Select Destination</Label>
                        <select
                            id="destination-select"
                            value={selectedDestinationId}
                            onChange={handleDestinationChange}
                            className="w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Select Destination</option>
                            {destinations.map(dest => (
                                <option key={dest.destinationId} value={dest.destinationId}>
                                    {dest.destinationName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button
                        onClick={() => openDialog()}
                        className="bg-blue-500 hover:bg-blue-600 mt-6"
                        disabled={!selectedDestinationId}
                    >
                        + Add Opening Hours
                    </Button>
                </div>
                {selectedDestinationName && (
                    <p className="font-medium mb-2">Showing opening hours for: <span className="text-blue-400">{selectedDestinationName}</span></p>
                )}
            </div>

            {selectedDestinationId ? (
                <Table className="w-full border">
                    <TableHeader>
                        <TableRow className="bg-gray-200 dark:bg-gray-700">
                            <TableHead className="border px-4 py-2">Day of Week</TableHead>
                            <TableHead className="border px-4 py-2">Open Time</TableHead>
                            <TableHead className="border px-4 py-2">Close Time</TableHead>
                            <TableHead className="border px-4 py-2">Status</TableHead>
                            <TableHead className="border px-4 py-2">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {openingHours.length > 0 ? (
                            openingHours.map((hour) => (
                                <TableRow key={`${hour.destinationId}-${hour.dayOfWeek}`}>
                                    <TableCell className="border px-4 py-2">{hour.dayOfWeek}</TableCell>
                                    <TableCell className="border px-4 py-2">{hour.isClosed ? "-" : formatTimeString(hour.openTime)}</TableCell>
                                    <TableCell className="border px-4 py-2">{hour.isClosed ? "-" : formatTimeString(hour.closeTime)}</TableCell>
                                    <TableCell className="border px-4 py-2">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${hour.isClosed ? "bg-red-900 text-red-200" : "bg-green-900 text-green-200"}`}>
                                            {hour.isClosed ? "Closed" : "Open"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="border px-4 py-2">
                                        <Button variant="outline" onClick={() => openDialog(hour)} className="mr-2">
                                            Edit
                                        </Button>
                                        <Button variant="destructive" onClick={() => handleDelete(hour.destinationId, hour.dayOfWeek)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4">
                                    No opening hours found for this destination
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            ) : (
                <div className="text-center p-8 border rounded-md bg-gray-800">
                    <p>Please select a destination to view and manage its opening hours</p>
                </div>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-h-100 overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{currentOpeningHour ? "Edit Opening Hours" : "Add Opening Hours"}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        <div>
                            <Label htmlFor="day-of-week">Day of Week</Label>
                            <select
                                id="day-of-week"
                                value={dayOfWeek}
                                onChange={(e) => setDayOfWeek(e.target.value)}
                                className="w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                disabled={!!currentOpeningHour}
                            >
                                <option>
                                    {dayOfWeek}
                                </option>
                                {/* <option value="">Select Day</option>
                                {dayOfWeekOptions.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))} */}
                            </select>
                        </div>

                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isClosed}
                                        onChange={(e) => setIsClosed(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Closed on this day"
                            />
                        </FormGroup>

                        {!isClosed && (
                            <>
                                <div>
                                    <Label htmlFor="open-time">Opening Time</Label>
                                    <Input
                                        id="open-time"
                                        type="time"
                                        value={openTime}
                                        onChange={(e) => setOpenTime(e.target.value)}
                                        className="w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="close-time">Closing Time</Label>
                                    <Input
                                        id="close-time"
                                        type="time"
                                        value={closeTime}
                                        onChange={(e) => setCloseTime(e.target.value)}
                                        className="w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <DialogFooter className="mt-6">
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600" disabled={!dayOfWeek}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OpeningHours;