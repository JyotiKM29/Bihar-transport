"use client";
import React, { useState } from "react";

import Link from "next/link";

function Report() {
  const [showBooking, setShowBooking] = useState(true);

  return (
    <div className="min-h-[90vh] w-full rounded-2xl  bg-white p-8 xl:px-24 shadow-sm ">
    <h2 className="mb-14 mt-4 text-3xl font-semibold text-emerald-800 ">
          Settings  :
        </h2>
      <div className="flex flex-col gap-6 w-full lg:w-1/2 ">
      
        <Link href='/admin/settings/financeyear' className="px-8 py-2 rounded-lg shadow-md bg-emerald-500 hover:bg-emerald-700 text-white max-w-full ">
        Finance Year
        </Link>
        

      </div>
    </div>
  );
}

export default Report;
