"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "../../account/data-table";
import { UserContext } from "@/app/context/UserContextProvider";
import ColumnHeader from "./ColumnHeader";

const BookingReport = () => {
  const columns = ColumnHeader();
  const [dataLoading, setDataLoading] = useState(false);
  const [data, setData] = useState([]);
  const [newDataAdded, setnewDataAdded] = useState(false);
  const { user } = useContext(UserContext);
  const router = useRouter();

  const userId = user?._id;

  const handleRefresh = () => {
    setnewDataAdded(!newDataAdded);
  };

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setDataLoading(true);

        const response = await fetch(`/api/report/customerWiseReport/${userId}`);
        const result = await response.json();

        console.log("result: ", result);
        setData(result.data);
        setDataLoading(false);
      } catch (error) {
        setDataLoading(false);
        console.error("Error fetching units:", error);
      }
    };

    fetchUnits();
  }, [user, newDataAdded]);

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h flex w-full flex-col gap-3 space-y-2 rounded-2xl bg-white px-4 py-4 shadow-md md:p-6 xl:min-h-[95%]">
      <div className="mt-8 flex lg:mt-3">
        <h1 className="flex-1 text-center text-2xl text-violet-800 lg:block xl:text-3xl">
         Customer Wise Report
        </h1>
        <Button
          variant="secondary"
          className="flex gap-2 self-end bg-violet-200 px-2 shadow-md hover:bg-violet-300"
          onClick={handleBack}
        >
          <ChevronLeft />
          Back
        </Button>
      </div>
      {/* <SearchState /> */}

      <div className="mt-8 min-h-[90vh] w-full space-y-6">
        <div className="min-h w-full space-y-2 rounded-2xl bg-white px-4 py-4 shadow-sm md:px-6 xl:h-[95%]">
          {/* <h1 className="hidden text-4xl font-semibold text-blue-600 lg:block">
            Customer Wise Report :{" "}
          </h1> */}

          <Button onClick={handleRefresh}>Refresh Data</Button>

          {dataLoading ? (
            <div className="max-w max-h bg-white">
              <h2 className="text-xl">Data Loading...</h2>
            </div>
          ) : (
            <DataTable columns={columns} data={data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingReport;
