"use client";
import React, { useState } from "react";

import BookingReport from "./booking-report/page";
import VehicleReport from "./vehicle-report/page";
import InvoiceReport from "./invoice-report/page";
import { Button } from "../../components/ui/button";

function Report() {
  const [showBooking, setShowBooking] = useState(true);

  return (
    <div className="min-h-[90vh] w-full rounded-2xl  bg-white p-6 shadow-sm ">
      <h5 className="mb-4 text-center text-base  md:text-lg xl:mb-8">
        Search report from below filters :
      </h5>
      <div className="flex flex-col gap-6 xl:flex-row">
        {showBooking ? (
          <Button onClick={() => setShowBooking(!showBooking)}>
            Booking Report
          </Button>
        ) : (
          <BookingReport />
        )}
        {/* <VehicleReport />
        <InvoiceReport /> */}
      </div>
    </div>
  );
}

export default Report;
