"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import FinanceYear from "./FinanceYear";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";

const FinanceYearReport = () => {
 
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const router = useRouter();
  const userID = user?._id;

  async function handleFinanceYear() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/setting/financeYear/${userID}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch finance year data');
      }
      
      const result = await response.json();
      setIsLoading(false);
      setData(result);
      console.log(result); 
    } catch (error) {
      console.error('Error fetching finance year data:', error);
      setIsLoading(false);
      
      showToast('Error fetching finance year data');
    }
  }
  

  function handleBack() {
    router.back();
  }
  return (
    <div
      className="max-h flex 
    w-full  flex-col  gap-3 space-y-2 rounded-2xl 
     bg-white px-4 py-4 shadow-md md:p-6 xl:min-h-[95%]"
    >
      <div className="flex ">
        <h1 className="flex-1 text-center text-2xl text-emerald-800 lg:block xl:text-3xl  ">
          {" "}
          Set Finance year{" "}
        </h1>
        <Button
          variant="secondary"
          className="flex gap-2 self-end bg-emerald-200 shadow-md hover:bg-emerald-300 "
          onClick={handleBack}
        >
          <ChevronLeft />
          Back
        </Button>
      </div>

      <FinanceYear />

      <p className="text-sm ">Click below button to get finance year :</p>
      <Button
        onClick={handleFinanceYear}
        className="w-full bg-emerald-500 text-white shadow-md hover:bg-emerald-700 lg:w-1/5 "
      >
        {isloading ? "Loading..." : " Get Finance year"}
      </Button>
      {data && Object.keys(data).length > 0 && (
        <div className="max-h grid-col-1 mb-8 grid max-w-full rounded-xl bg-teal-100 p-4 px-6 shadow-xl md:grid-cols-2">
          <label className="flex gap-2">
            <h2 className="mr-3 text-nowrap text-lg font-semibold ">
              Finance year:
            </h2>
            <p className="mr-3 text-nowrap text-lg "> {data[0]?.financeYear}</p>
          </label>
        </div>
      )}
    </div>
  );
};

export default FinanceYearReport;
