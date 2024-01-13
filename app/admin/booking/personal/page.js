"use client";
import React, { useState } from "react";
import { Input } from "../../../components/ui/input";
import DataTableDemo from "./Table";
import Form from "./BookingForm";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import BookingForm from './BookingForm'


const PersonalBooking = () => {
  const [formValue, setFormValue] = useState(true);

  const data = [
    {orderNumber : 21345 , vehicleRequiredDate : '24-1-2024' , consignorName : "Suraj Kumar" , consigneeName:"Jyoti Kumari", formModeTo:"delhi-truck-jalandhar",
    actualWeight: "100Kg",
    quantity: 300,
    ContNo: "23456789",
    status:'pending',
    vehicleno:'FGF324564',
    
    
    },
    {orderNumber : 21345 , vehicleRequiredDate : '24-1-2024' , consignorName : "niraj Kumar" , consigneeName:"Jyoti Kumari", formModeTo:"delhi-truck-jalandhar",
    actualWeight: "100Kg",
    quantity: 300,
    ContNo: "23456789",
    vehicleno:'FGF324564',
    status:'pending'
    
    
    },
    {orderNumber : 21345 , vehicleRequiredDate : '24-1-2024' , consignorName : "ronak Kumar" , consigneeName:"Jyoti Kumari", formModeTo:"delhi-truck-jalandhar",
    actualWeight: "100Kg",
    quantity: 300,
    ContNo: "23456789",
    vehicleno:'FGF324564',
    status:'pending'
    
    
    },
    {orderNumber : 21345 , vehicleRequiredDate : '24-1-2024' , consignorName : "aanchaal Kumar" , consigneeName:"Jyoti Kumari", formModeTo:"delhi-truck-jalandhar",
    actualWeight: "100Kg",
    quantity: 300,
    ContNo: "23456789",
    vehicleno:'FGF324564',
    status:'pending'
    
    
    },
    {orderNumber : 21345 , vehicleRequiredDate : '24-1-2024' , consignorName : "Suraj Kumar" , consigneeName:"Jyoti Kumari", formModeTo:"delhi-truck-jalandhar",
    actualWeight: "100Kg",
    quantity: 300,
    ContNo: "23456789",
    status:'pending',
    vehicleno:'FGF324564',
    
    
    },
    {orderNumber : 21345 , vehicleRequiredDate : '24-1-2024' , consignorName : "niraj Kumar" , consigneeName:"Jyoti Kumari", formModeTo:"delhi-truck-jalandhar",
    actualWeight: "100Kg",
    quantity: 300,
    ContNo: "23456789",
    vehicleno:'FGF324564',
    status:'pending'
    
    
    },
    {orderNumber : 21345 , vehicleRequiredDate : '24-1-2024' , consignorName : "ronak Kumar" , consigneeName:"Jyoti Kumari", formModeTo:"delhi-truck-jalandhar",
    actualWeight: "100Kg",
    quantity: 300,
    ContNo: "23456789",
    vehicleno:'FGF324564',
    status:'pending'
    
    
    },
    {orderNumber : 21345 , vehicleRequiredDate : '24-1-2024' , consignorName : "aanchaal Kumar" , consigneeName:"Jyoti Kumari", formModeTo:"delhi-truck-jalandhar",
    actualWeight: "100Kg",
    quantity: 300,
    ContNo: "23456789",
    vehicleno:'FGF324564',
    status:'pending'
    
    
    },
    {orderNumber : 21345 , vehicleRequiredDate : '24-1-2024' , consignorName : "Suraj Kumar" , consigneeName:"Jyoti Kumari", formModeTo:"delhi-truck-jalandhar",
    actualWeight: "100Kg",
    quantity: 300,
    ContNo: "23456789",
    status:'pending',
    vehicleno:'FGF324564',
    
    
    },
    {orderNumber : 21345 , vehicleRequiredDate : '24-1-2024' , consignorName : "niraj Kumar" , consigneeName:"Jyoti Kumari", formModeTo:"delhi-truck-jalandhar",
    actualWeight: "100Kg",
    quantity: 300,
    ContNo: "23456789",
    vehicleno:'FGF324564',
    status:'pending'
    
    
    },
    {orderNumber : 21345 , vehicleRequiredDate : '24-1-2024' , consignorName : "ronak Kumar" , consigneeName:"Jyoti Kumari", formModeTo:"delhi-truck-jalandhar",
    actualWeight: "100Kg",
    quantity: 300,
    ContNo: "23456789",
    vehicleno:'FGF324564',
    status:'pending'
    
    
    },
    {orderNumber : 21345 , vehicleRequiredDate : '24-1-2024' , consignorName : "aanchaal Kumar" , consigneeName:"Jyoti Kumari", formModeTo:"delhi-truck-jalandhar",
    actualWeight: "100Kg",
    quantity: 300,
    ContNo: "23456789",
    vehicleno:'FGF324564',
    status:'pending'
    
    
    }
  
  ];

  return (
    <div className="min-h-[90vh] w-full space-y-6">
      <div className="h-8  w-full ">
        <h1 className="hidden text-4xl  lg:block ">Personal Booking</h1>
      </div>
      <div
        className="min-h w-full 
      space-y-2 rounded-2xl  bg-white px-4 md:px-6 
     py-4 shadow-sm xl:h-[95%]"
      >
        <div className="flex w-full items-center justify-end gap-20 ">
          <button
            className="font-semiBold rounded-lg bg-blue-700 p-2 px-6 text-lg text-white"
            onClick={() => setFormValue(!formValue)}
          >
            {formValue ?  "View Bookings" : "New Booking" }
          </button>
          
        </div>
        {formValue && <BookingForm />}
     {/* { !formValue && <DataTableDemo /> } */}

     { !formValue && <DataTable columns={columns} data={data} />}
      </div>
    </div>
  );
};

export default PersonalBooking;
