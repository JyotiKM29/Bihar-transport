import React from "react";
import { Button } from "../../../components/ui/button";

const BookingReport = () => {
  return (
    <div
    className="max-h flex 
      w-1/3 flex-col  gap-3 space-y-2 rounded-2xl 
     bg-white px-4 py-4 shadow-md md:p-6 xl:h-[95%]"
  >
    <h1 className="hidden text-3xl text-center lg:block ">Booking Report</h1>
    <Button >Party wise Booking statement</Button>
        <Button >Transportation mode wise booking </Button>
        <Button > Branch wise incoming booking register report </Button>
        <Button > Delivery type wise booking statement </Button>
        <Button >Bilty type wise booking statement </Button>
        <Button > Booking Register Report </Button>
        <Button >District Wise Booking Statement </Button>
        <Button > State Wise Booking Statement </Button>
        <Button >Date Wise Dleted Cn/LR </Button>
  </div>
  );
};

export default BookingReport;

