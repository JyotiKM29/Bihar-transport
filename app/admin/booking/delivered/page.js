"use client";
import React, { useContext, useEffect, useState } from "react";
import ColumnHeader from './ColumnHeader';
import { DataTable } from "../../account/data-table";

import { UserContext } from "../../../context/UserContextProvider";

const DeliveredBooking = () => {
  const [formValue, setFormValue] = useState(true);
  const [loading , setLoading] = useState(true);
  const columns = ColumnHeader();

  const { user } = useContext(UserContext);

  const [data, setData] = useState(null);

  const userId = user?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const response = await fetch(`/api/getbooking/${userId}`, {
            method: "GET",
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const result = await response.json();
  
          setLoading(false);
  
          // Check if result.data is an array before applying filter
          const pendingOrders = Array.isArray(result.data) ? result.data.filter(
            (order) => order.status === "Delivered",
          ) : [];
  
          console.log(pendingOrders);
  
          setData(pendingOrders);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };
  
    fetchData();
  }, [userId]);
  
  
  

  console.log(data);

  return (
    <div className="min-h-[90vh] w-full space-y-6">
      
      <div
        className="min-h w-full 
      space-y-2 rounded-2xl  bg-white px-4 py-4 
     shadow-sm md:px-6 xl:h-[95%]"
      >
        
        <h1 className="hidden text-4xl text-blue-600 lg:block font-semibold">Delivered Bookings</h1>

       {loading ? (<div className="max-w max-h  bg-white"><h2
       className="text-xl"
       >Loading...</h2></div>) :  ( <DataTable columns={columns} data={data} />)}
      </div>
    </div>
  );
};

export default DeliveredBooking;