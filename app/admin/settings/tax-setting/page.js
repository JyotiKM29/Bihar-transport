import React from "react";
import { Button } from "../../../components/ui/button";

const TaxSetting = () => {
  return (
    
      <div
        className="max-h flex 
        w-full  flex-col  gap-3 space-y-2 rounded-2xl 
         bg-white px-4 py-4 shadow-md md:p-6 xl:h-[95%]"
      >
        <h1 className="text-2xl xl:text-3xl text-center lg:block ">TaxSetting</h1>
        <Button> Tax </Button>
       
        <Button> Manage Account Wise Tax		 </Button>
       
      </div>
 
  );
};

export default TaxSetting;
