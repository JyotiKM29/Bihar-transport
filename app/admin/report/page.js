"use client";
import React, { useState } from "react";

import BookingReport from "./bookingReport/page";
import VehicleReport from "./vehicle-report/page";
import InvoiceReport from "./stateReport/page";
import { Button } from "../../components/ui/button";
import Link from "next/link";

function Report() {
  const [showBooking, setShowBooking] = useState(true);

  return (
    <div className="min-h-[90vh] w-full rounded-2xl  bg-white p-6 shadow-sm ">
     
      <div className="flex flex-col gap-6 xl:flex-row">
        {/* {showBooking ? (
          <Button onClick={() => setShowBooking(!showBooking)}>
            Booking Report
          </Button>
        ) : (
          <BookingReport />
        )} */}
        <Link href='/admin/report/bookingReport'>
        Booking Report
        </Link>
      </div>
    </div>
  );
}

export default Report;
