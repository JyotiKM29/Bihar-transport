"use client";
import React, { useState } from "react";
import Link from "next/link";

function Setting() {
  const [showBooking, setShowBooking] = useState(true);

  return (
    <div className="min-h-[90vh] w-full rounded-2xl bg-white p-8 shadow-sm xl:px-24">
      <h2 className="mb-14 mt-4 text-3xl font-semibold text-violet-800">
        Settings:
      </h2>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div>
          <h1 className="mb-4 text-xl font-semibold">Booking Setting</h1>
          <Link
            href="/admin/settings/financeyear"
            className="mb-4 block rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700"
          >
            Finance Year
          </Link>
          <Link
            href="/admin/settings/newunit"
            className="mb-4 block rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700"
          >
            Unit Setting
          </Link>
          <Link
            href="/admin/settings/triptype"
            className="mb-4 block rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700"
          >
            Trip Type Setting
          </Link>
          <Link
            href="/admin/settings/material"
            className="mb-4 block rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700"
          >
            Material Setting
          </Link>
          <Link
            href="/admin/settings/rateasper"
            className="mb-4 block rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700"
          >
            Rate As Per Setting
          </Link>
          <Link
            href="/admin/settings/additionalCharges"
            className="mb-4 block rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700"
          >
            Additional Charge Setting
          </Link>
          <Link
            href="/admin/settings/paymentTerm"
            className="mb-4 block rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700"
          >
            Payment Term Setting
          </Link>
        </div>

        <div>
          <h1 className="mb-4 text-xl font-semibold">
            Allocate Vehicle Setting
          </h1>
          <Link
            href="/admin/settings/paymentLibility"
            className="mb-4 block rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700"
          >
            Payment Liability Setting
          </Link>
          <Link
            href="/admin/settings/receivable"
            className="mb-4 block rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700"
          >
            Receivable Setting
          </Link>
        </div>

        <div>
          <h1 className="mb-4 text-xl font-semibold">Dispatch Setting</h1>
          <Link
            href="/admin/settings/bilty"
            className="mb-4 block rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700"
          >
            Bilty Setting
          </Link>
          <Link
            href="/admin/settings/insurence"
            className="mb-4 block rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700"
          >
            Insurance Provider Setting
          </Link>
        </div>

        <div>
          <h1 className="mb-4 text-xl font-semibold">Delivery Setting</h1>
          <Link
            href="/admin/settings/paymentMode"
            className="mb-4 block rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700"
          >
            Payment Mode Setting
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div>
          <h1 className="mb-4 text-xl font-semibold">Others Setting</h1>
          <Link
            href="/admin/settings/paymentMode"
            className="mb-4 block rounded-lg bg-violet-500 px-8 py-2 text-white shadow-md hover:bg-violet-700"
          >
            Price Setting
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Setting;
