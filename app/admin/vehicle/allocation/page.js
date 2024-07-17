"use client";
import React, { useContext, useEffect, useState } from "react";
import ColumnHeader from './ColumnHeader';
import { DataTable } from "./data-table";
import { UserContext } from "../../../context/UserContextProvider";

const Allocation = () => {
  const [loading , setLoading] = useState(true);

  const { user } = useContext(UserContext);

  const [data, setData] = useState(null);
  const columns = ColumnHeader();
  const userId = user?._id;

  useEffect(() => {
    const fetchData = async () => {
    
      try {
        if (userId) {
          const response = await fetch(`/api/vehicledata/${userId}`, {
            method: "GET",
          });
          console.log(response)
  
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const data = await response.json();

          setLoading(false);
        
          setData(data);
          console.log('vehicle ' ,data)
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };
  
    fetchData();
  }, [userId ]);

  return (
    <div className="min-h h-[94vh] w-full space-y-6">
      <div className="h-8  w-full ">
        <h1 className="hidden text-4xl  lg:block ">Vehicle Details</h1>
      </div>
      <div
        className="min-h w-full 
      space-y-2 rounded-2xl  bg-white px-4 py-4 
     shadow-sm md:px-6 xl:h-[95%]"
      >
       {loading ? 'Loading.....' : <DataTable columns={columns} data={data?.data} />}
       
      </div>
    </div>
  );
};

export default Allocation;