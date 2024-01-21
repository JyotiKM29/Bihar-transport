"use client";
import React from "react";


const Allocation = () => {
 


  return (
    <div className="h-[90vh] w-full space-y-6">
      <div className="h-8  w-full ">
        <h1 className="hidden text-4xl  lg:block ">Allocation Vehicles</h1>
      </div>
      <div
        className="min-h w-full 
      space-y-2 rounded-2xl  bg-white px-4 py-4 
     shadow-sm md:px-6 xl:h-[95%]"
      >
        <div className="flex w-full items-center justify-end gap-20 ">
          <button
            className="font-semiBold rounded-lg bg-blue-700 p-2 px-6 text-lg text-white"
            onClick={() => setFormValue(!formValue)}
          >
          button
          </button>
        </div>
       
      </div>
    </div>
  );
};

export default Allocation;