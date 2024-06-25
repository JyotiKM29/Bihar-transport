"use client";
import React, { useContext, useState } from "react";

import BookingReport from "./bookingDate/page";
import VehicleReport from "./vehicleNo/page";
import InvoiceReport from "./stateWise/page";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { UserContext } from "@/app/context/UserContextProvider";

function Report() {
  const [showBooking, setShowBooking] = useState(true);
  const user = useContext(UserContext);

   if (!user?.isOwner) {
     return (
       <div className="h-full w-full ">
         <h1 className="font-semiBold text-2xl">
           Your are not Allowed , ask Owner
         </h1>
       </div>
     );
   }

  return (
    <div className="min-h-[90vh] w-full rounded-2xl  bg-white p-8 shadow-sm xl:px-24 ">
      <h2 className="mb-14 mt-4 text-3xl font-semibold text-violet-800 ">
        Reports :
      </h2>
      <div className="flex w-full flex-col gap-6 lg:w-1/2 ">
        <Link
          href="/admin/report/bookingDate"
          className="max-w-full rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700 "
        >
          Booking Date
        </Link>
        <Link
          href="/admin/report/customer"
          className="max-w-full rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700 "
        >
          Customer wise
        </Link>
        <Link
          href="/admin/report/stateWise"
          className="max-w-full rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700 "
        >
          State Wise
        </Link>
        <Link
          href="/admin/report/vehicleNo"
          className="max-w-full rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700 "
        >
          Vehicle No
        </Link>

        <Link
          href="/admin/report/paymentHistory"
          className="max-w-full rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700 "
        >
          Vehicle Payment History
        </Link>

        <Link
          href="/admin/report/vehicleTrip"
          className="max-w-full rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700 "
        >
          Vehicle Trip
        </Link>

        <Link
          href="/admin/report/vehicleType"
          className="max-w-full rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700 "
        >
          Vehicle Type
        </Link>
        <Link
          href="/admin/report/GST"
          className="max-w-full rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700 "
        >
          GST wise
        </Link>
      </div>
    </div>
  );
}

export default Report;
