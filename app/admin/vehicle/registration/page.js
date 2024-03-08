"use client";
import React from "react";
import RegistrationForm from './RegistrationForm'



const Registration = () => {
 


  return (
    <div className="min-h-[90vh] w-full space-y-6">
      <div className="h-8  w-full ">
        <h1 className="hidden text-4xl  lg:block ">Registration</h1>
      </div>
      <div
        className="min-h w-full 
      space-y-2 rounded-2xl  bg-white px-4 py-4 
     shadow-sm md:px-6 xl:h-[95%]"
      >
       
         
          <RegistrationForm />
      </div>
    </div>
  );
};

export default Registration;