"use client";
import React, { useContext, useEffect, useState } from "react";
// import { columns } from "../ColumnHeader";
import ColumnHeader from '../ColumnHeader';
import { DataTable } from "../data-table";
import BookingForm from "../BookingForm";
import { UserContext } from "../../../context/UserContextProvider";

const NewBooking = () => {
  const [formValue, setFormValue] = useState(true);
  const [loading , setLoading] = useState(true);

  const { user } = useContext(UserContext);

  const [data, setData] = useState(null);
  const columns = ColumnHeader();


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
  
          const data = await response.json();

          setLoading(false);
        
          setData(data);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };
  
    fetchData();
  }, [userId ,formValue]);
  

  

  return (
    <div className="min-h-[90vh] w-full space-y-6">
     
      <div
        className="min-h w-full 
      space-y-2 rounded-2xl  bg-white px-4 py-4 
     shadow-sm md:px-6 xl:h-[95%]"
      >
       <h1 className="hidden text-4xl font-semibold lg:block ">New Booking Form </h1>
        
         <BookingForm />

       
      </div>
    </div>
  );
};

export default NewBooking;