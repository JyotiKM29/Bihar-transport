import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/ui/use-toast";

const LocationTable = ({ locations }) => {
  // const [locations, setLocations] = useState([]);
  const [editingLocation, setEditingLocation] = useState(null);
  const [editedDate, setEditedDate] = useState("");
  const [editedTime, setEditedTime] = useState("");
  const [editedReason, setEditedReason] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();


 if (locations.date) {
  const dateString = locations.date;
  const [finalDate, timePart] = dateString.split("T");
  console.log(finalDate); // Output: 2024-05-09
  console.log(timePart); // Output: 00:00:00.000Z
} else {
  console.log("Date is undefined");
}




  // useEffect(() => {
  //   // Fetch locations from the backend API
  //   fetchLocations();
  // }, [id]);

  // const fetchLocations = async () => {
  //   try {
  //     const response = await fetch(`/api/bookingdetails/${id}`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       setLocations(data?.location || []); // Ensure locations is initialized
  //     } else {
  //       throw new Error("Failed to fetch locations");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //     toast({
  //       title: "Error",
  //       description: "Failed to fetch locations",
  //       status: "error",
  //     });
  //   }
  // };

  const handleEditClick = (location) => {
    setEditingLocation(location);
    setEditedDate(location.date);
    setEditedTime(location.time);
    setEditedReason(location.reason);
  };

  const handleUpdateLocation = ()=>{

    console.log("okau");


  }



  // const handleUpdateLocation = async () => {
  //   if (!editingLocation) return;

  //   try {
  //     setLoading(true);
  //     const response = await fetch(`/api/location/${editingLocation.id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         date: editedDate,
  //         time: editedTime,
  //         reason: editedReason,
  //       }),
  //     });

  //     if (response.ok) {
  //       toast({
  //         title: "Success",
  //         description: "Location updated successfully",
  //         status: "success",
  //       });
  //       setEditingLocation(null);
  //       fetchLocations(); // Refresh locations after update
  //     } else {
  //       throw new Error("Failed to update location");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //     toast({
  //       title: "Error",
  //       description: "Failed to update location",
  //       status: "error",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Locations</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Location
                </th>
                {/* <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {locations?.length > 0 ? (
                locations.map((location) => (
                  <tr key={location?._id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>{location?.date.split("T")[0]}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {location?.time}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {location?.location}
                    </td>
                    {/* <td className="whitespace-nowrap px-6 py-4">
                      <Button onClick={() => handleEditClick(location)}>
                        Edit
                      </Button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="whitespace-nowrap px-6 py-4" colSpan="4">
                    No locations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Dialog for editing location */}
        <Dialog
          isOpen={!!editingLocation}
          onClose={() => setEditingLocation(null)}
        >
          <DialogContent>
            <h2 className="mb-4 text-xl font-bold">Edit Location</h2>
            <div className="flex flex-col space-y-4">
              <Input
                label="Date"
                type="date"
                value={editedDate}
                onChange={(e) => setEditedDate(e.target.value)}
              />
              <Input
                label="Time"
                type="time"
                value={editedTime}
                onChange={(e) => setEditedTime(e.target.value)}
              />
              <Input
                label="Location"
                type="text"
                value={editedReason}
                onChange={(e) => setEditedReason(e.target.value)}
              />
              <Button onClick={handleUpdateLocation} disabled={loading}>
                {loading ? "Updating..." : "Update Location"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default LocationTable;
