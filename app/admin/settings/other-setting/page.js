import React from "react";
import { Button } from "../../../components/ui/button";

const OtherSetting = () => {
  return (
    
      <div
        className="max-h flex 
        w-full  flex-col  gap-3 space-y-2 rounded-2xl 
         bg-white px-4 py-4 shadow-md md:p-6 xl:h-[95%]"
      >
        <h1 className="text-2xl xl:text-3xl text-center lg:block ">Other Setting</h1>
        <Button> Delivery Type </Button>
        <Button> Expenditure List </Button>
        <Button> Manage Payment Term </Button>
        <Button>  Manage Expense type </Button>
       
      </div>
 
  );
};

export default OtherSetting;
