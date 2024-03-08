"use client";
import React, { useState } from "react";

import BookingReport from "./bookingDate/page";
import VehicleReport from "./vehicleNo/page";
import InvoiceReport from "./stateWise/page";
import { Button } from "../../components/ui/button";
import Link from "next/link";

function Report() {
  const [showBooking, setShowBooking] = useState(true);

  return (
    <div className="min-h-[90vh] w-full rounded-2xl  bg-white p-6 shadow-sm ">
     
      <div className="flex flex-col gap-6 xl:flex-row">
        
        <Link href='/admin/report/bookingDate' className="px-8 py-2 rounded-lg shadow-md bg-blue-600 text-white max-w-full ">
        Booking Date
        </Link>
        <Link href='/admin/report/stateWise' className="px-8 py-2 rounded-lg shadow-md bg-blue-600 text-white max-w-full ">
        State Wise
        </Link>
        <Link href='/admin/report/vehicleNo' className="px-8 py-2 rounded-lg shadow-md bg-blue-600 text-white max-w-full ">
        Vehicle No
        </Link>
        <Link href='/admin/report/vehicleType' className="px-8 py-2 rounded-lg shadow-md bg-blue-600 text-white max-w-full ">
        Vehicle Type
        </Link>

      </div>
    </div>
  );
}

export default Report;
