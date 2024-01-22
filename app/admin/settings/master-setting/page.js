import React from "react";
import { Button } from "../../../components/ui/button";

const MasterSetting = () => {
  return (
    <div
      className="max-h flex 
          w-full flex-col  gap-3 space-y-2 rounded-2xl 
         bg-white px-4 py-4 shadow-md md:p-6 xl:h-[95%]"
    >
      <h1 className="hidden text-center text-3xl lg:block ">Master Setting</h1>
      <Button> Product List </Button>
      <Button> Package Category </Button>
      <Button> Unit Measerment </Button>
      <Button> Transportation mode </Button>
    </div>
  );
};

export default MasterSetting;
