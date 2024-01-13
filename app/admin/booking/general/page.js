'use client'
import React, { useState } from "react";
import { Input } from "../../../components/ui/input";
import TableData from './Table';
import ProfileForm from './BookingForm';


const GeneralBooking = () => {
  const [formValue ,setFormValue] = useState(false);
    return (
      <div className="h-[90vh] w-full">
        <div className=" mb-4 w-full ">
          <h1 className="text-4xl opacity-0 lg:opacity-100">
         General Booking</h1>
        </div>
        <div
        className="min-h w-full 
      rounded-2xl bg-white  py-4 px-6 
     shadow-sm xl:h-[95%] space-y-4"
      >
        <div className="flex w-full justify-between items-center gap-20 ">
          <button className="rounded-lg text-lg font-semiBold bg-blue-700 p-2 px-6 text-white" onClick={()=>setFormValue(!formValue)}>
            New
          </button>
          <Input type="text" />
        </div>
       {formValue && <ProfileForm />}
       { !formValue && <TableData /> }
      </div>
      </div>
    );
  };
  
  export default GeneralBooking;
