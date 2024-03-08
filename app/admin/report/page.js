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
    <div className="min-h-[90vh] w-full rounded-2xl  bg-white p-8 xl:px-24 shadow-sm ">
    <h2 className="mb-14 mt-4 text-3xl font-semibold text-violet-800 ">
          Reports  :
        </h2>
      <div className="flex flex-col gap-6 w-full lg:w-1/2 ">
      
        <Link href='/admin/report/bookingDate' className="px-8 py-2 rounded-lg shadow-md bg-violet-500 hover:bg-violet-700 text-white max-w-full ">
        Booking Date
        </Link>
        <Link href='/admin/report/stateWise' className="px-8 py-2 rounded-lg shadow-md bg-violet-500 hover:bg-violet-700 text-white max-w-full ">
        State Wise
        </Link>
        <Link href='/admin/report/vehicleNo' className="px-8 py-2 rounded-lg shadow-md bg-violet-500 hover:bg-violet-700 text-white max-w-full ">
        Vehicle No
        </Link>
        <Link href='/admin/report/vehicleType' className="px-8 py-2 rounded-lg shadow-md bg-violet-500 hover:bg-violet-700 text-white max-w-full ">
        Vehicle Type
        </Link>
        <Link href='/admin/report/GST' className="px-8 py-2 rounded-lg shadow-md bg-violet-500 hover:bg-violet-700 text-white max-w-full ">
        GST wise
        </Link>

      </div>
    </div>
  );
}

export default Report;
