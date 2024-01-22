import React from "react";
import { Button } from "../../../components/ui/button";

const VehicleReport = () => {
  return (
    
      <div
        className="max-h flex 
          w-1/3 flex-col  gap-3 space-y-2 rounded-2xl 
         bg-white px-4 py-4 shadow-md md:p-6 xl:h-[95%]"
      >
        <h1 className="hidden text-3xl text-center lg:block ">Vehicle Report</h1>
        <Button > Truck Wise Report </Button>
        <Button > Lorry Attendence report </Button>
        <Button > Vehicle Trip Register Report </Button>
        <Button > Vehicle Payment History </Button>
        <Button >Trip wise Profit & loss Statement </Button>
        <Button >
          {" "}
          Vehicle wise Profit & loss Statement{" "}
        </Button>
        <Button > Date Wise Fuel Statement </Button>
        <Button >
          {" "}
          Vehicle Vendor wise Outstanding Report{" "}
        </Button>
        <Button > Summary of Fuel Supply </Button>
      </div>
 
  );
};

export default VehicleReport;
