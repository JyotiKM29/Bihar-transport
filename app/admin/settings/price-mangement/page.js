import React from "react";
import { Button } from "../../../components/ui/button";

const PriceMangement = () => {
  return (
    
      <div
        className="max-h flex 
        w-full  flex-col  gap-3 space-y-2 rounded-2xl 
         bg-white px-4 py-4 shadow-md md:p-6 xl:h-[95%]"
      >
        <h1 className="hidden text-3xl text-center lg:block ">Price Mangement</h1>
        <Button>Price Setting  </Button>
        <Button> Account wise Price Setting </Button>  
        {/* //(Upload Price Setting From Excel) */}
        <Button>  Manage booking Price Setting (PTL) </Button>
        <Button> Manage booking Price Setting (FTL) </Button>
        <Button>  Additional Charge </Button>
       
      </div>
 
  );
};

export default PriceMangement;
