"use client";
import React, { useState } from "react";
import Link from "next/link";

function Report() {
  const [showBooking, setShowBooking] = useState(true);

  return (
    <div className="min-h-[90vh] w-full rounded-2xl bg-white p-8 shadow-sm xl:px-24">
      <h2 className="mb-14 mt-4 text-3xl font-semibold text-violet-800">
        Settings:
      </h2>
      <div className="flex w-full flex-col gap-6 lg:w-1/2">
        <Link
          href="/admin/settings/financeyear"
          className="max-w-full rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700"
        >
          Finance Year
        </Link>
        <Link
          href="/admin/settings/newunit"
          className="max-w-full rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700"
        >
          Unit Setting
        </Link>
      </div>
    </div>
  );
}

export default Report;
