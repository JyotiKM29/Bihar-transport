"use client";
import React, { useContext, useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";
import ColumnHeader from './ColumnHeader';
import { DataTable } from "../../account/data-table";


const AddUnit = () => {
  const [unitName, setUnitName] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [newDataAdded, setnewDataAdded] = useState(false);
  const [units, setUnits] = useState([]);
  const { toast } = useToast();
  const { user } = useContext(UserContext);
    const columns = ColumnHeader();


    const userId = user?._id;
    console.log("user: ", user);

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  // Fetch data from API
  useEffect(() => {
    const fetchUnits = async () => {
      try {

        setDataLoading(true);
       
        const response = await fetch(`/api/getunits/${userId}`);
        const result = await response.json();

        console.log(result);
        setUnits(result.data);
        setDataLoading(false);
      } catch (error) {
        setDataLoading(false);
        console.error("Error fetching units:", error);
      }
    };


    fetchUnits();
  }, [user, newDataAdded]);

  const handleRefresh = () => {
    setnewDataAdded(~newDataAdded);
  };

  // Handle delete
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/addunit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          adminId: userId,
          unitName
        }),
      });

      const result = await response.json();

      if (response.ok) {
        displayToast("Unit Added Successfully", "✅");
        setUnitName("");
        setUnits([...units, result.unit]); // Update the units list with the new unit
        setnewDataAdded(~newDataAdded);
      } else {
        console.error("Error:", result.message);
        displayToast("Failed to add unit", "❌", result.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
      displayToast("Server Error", "❌", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full w-full rounded-3xl bg-white px-6 py-4 shadow-sm">
      <h2 className="font-semiBold mt-12 text-3xl lg:mt-0">Add a New Unit:</h2>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex w-full flex-col items-start justify-between self-end rounded-xl border px-6 py-4 shadow-md"
      >
        <label className="w-full items-center gap-4 md:flex">
          <Input
            label="Unit Name"
            placeholder="Enter unit name"
            id="unitName"
            type="text"
            required
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
            className="w-full"
          />
        </label>
        <Button type="submit">{loading ? "Adding..." : "Add Unit"}</Button>
      </form>

      {/* showing data  */}
     
      <div className="mt-8 min-h-[90vh] w-full space-y-6">
        <div
          className="min-h w-full 
      space-y-2 rounded-2xl  bg-white px-4 py-4 
     shadow-sm md:px-6 xl:h-[95%]"
        >
          <h1 className="hidden text-4xl  font-semibold text-blue-600 lg:block">
            Units Data:{" "}
          </h1>

           <Button onClick={handleRefresh}>Refresh Data</Button>


          {dataLoading ? (
            <div className="max-w max-h  bg-white">
              <h2 className="text-xl">Data Loading...</h2>
            </div>
          ) : (
            <DataTable columns={columns} data={units} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddUnit;
