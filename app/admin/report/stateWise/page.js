"use client";
import React from "react";
import { Button } from "../../../components/ui/button";
import SearchState from "./SearchState";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BookingReport = () => {
  const router = useRouter();

  function handleBack() {
    router.back();
  }
  return (
    <div
      className="min-h flex 
    w-full  flex-col  gap-3 space-y-2 rounded-2xl 
     bg-white px-4 py-4 shadow-md md:p-6 xl:min-h-[95%]"
    >
      <div className="flex ">
        <h1 className="flex-1 text-center text-2xl lg:block xl:text-3xl ">
          State-wise Report
        </h1>
        <Button
          variant="secondary"
          className="flex gap-2 self-end"
          onClick={handleBack}
        >
          <ChevronLeft />
          Back
        </Button>
      </div>
      <SearchState />
    </div>
  );
};

export default BookingReport;
