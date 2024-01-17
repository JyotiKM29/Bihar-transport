"use client";
import React, { useContext, useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import BookingForm from "./BookingForm";
import { UserContext } from "../../../context/UserContextProvider";

const PersonalBooking = () => {
  const [formValue, setFormValue] = useState(true);
  const [loading , setLoading] = useState(true);

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
  }, [userId]);
  

  console.log(data);

  return (
    <div className="min-h-[90vh] w-full space-y-6">
      <div className="h-8  w-full ">
        <h1 className="hidden text-4xl  lg:block ">Personal Booking</h1>
      </div>
      <div
        className="min-h w-full 
      space-y-2 rounded-2xl  bg-white px-4 py-4 
     shadow-sm md:px-6 xl:h-[95%]"
      >
        <div className="flex w-full items-center justify-end gap-20 ">
          <button
            className="font-semiBold rounded-lg bg-blue-700 p-2 px-6 text-lg text-white"
            onClick={() => setFormValue(!formValue)}
          >
            {formValue ? "View Bookings" : "New Booking"}
          </button>
        </div>
        {formValue && <BookingForm />}

       {loading ? (<div className="max-w max-h  bg-white"><h2
       className="text-xl"
       >Loading...</h2></div>) :  (!formValue && <DataTable columns={columns} data={data?.data} />)}
      </div>
    </div>
  );
};

export default PersonalBooking;