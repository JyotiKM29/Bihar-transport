"use client";
import React, { useState } from "react";

import BookingReport from "./bookingReport/page";
import VehicleReport from "./vehicleNoReport/page";
import InvoiceReport from "./stateReport/page";
import { Button } from "../../components/ui/button";
import Link from "next/link";

function Report() {
  const [showBooking, setShowBooking] = useState(true);

  return (
    <div className="min-h-[90vh] w-full rounded-2xl  bg-white p-6 shadow-sm ">
     
      <div className="flex flex-col gap-6 xl:flex-row">
        
        <Link href='/admin/report/bookingReport' className="px-8 py-2 rounded-lg shadow-md bg-blue-600 text-white max-w-full ">
        Booking Report
        </Link>
        <Link href='/admin/report/stateReport' className="px-8 py-2 rounded-lg shadow-md bg-blue-600 text-white max-w-full ">
        State Report
        </Link>
        <Link href='/admin/report/vehicleNoReport' className="px-8 py-2 rounded-lg shadow-md bg-blue-600 text-white max-w-full ">
        Vehicle No Report
        </Link>

      </div>
    </div>
  );
}

export default Report;
