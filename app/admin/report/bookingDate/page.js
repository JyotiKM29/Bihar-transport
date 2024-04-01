'use client'
import React from "react";
import { Button } from "../../../components/ui/button";
import SearchBooking from './SearchBooking'
import { Backpack, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BookingReport = () => {
  const router = useRouter();

  function handleBack(){
    router.back()
  }
  return (
    <div
    className="max-h flex 
    w-full  flex-col  gap-3 space-y-2 rounded-2xl 
     bg-white px-4 py-4 shadow-md md:p-6 xl:h-[95%]"
  >
  <div className="flex pt-8 lg:pt-3 ">

 
  
    <h1 className="flex-1 text-2xl xl:text-3xl text-center lg:block text-violet-800  ">Booking Report</h1>
    <Button  variant='secondary' className='flex gap-2 self-end shadow-md bg-violet-200 hover:bg-violet-300 ' onClick={handleBack}>
    <ChevronLeft />
     Back
  </Button>
    </div>
    <SearchBooking />
    
  </div>
  );
};

export default BookingReport;

