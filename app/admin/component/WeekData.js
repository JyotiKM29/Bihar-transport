"use client"

import React, { useContext, useEffect, useState } from "react";
import StackedColumn from './Charts/StackedColumn'
import StackedRow from './Charts/StackedRow'
import BasicBarChart from './Charts/BasicBarChart'
import AreaChart from './Charts/AreaChart'
import RadialBarChart from './Charts/RadialBarChart'
import {WeekAreaChartSeries , WeekAreaChartOptions , WeekBarChartSeries , WeekBarChartOptions , WeekStackColumnSeries, WeekStackColumnOptions, WeekStackRowSeries, WeekStackRowOptions} from "./Charts/Variables"
import { UserContext } from "@/app/context/UserContextProvider";

const WeekData = () => {

   const [loading, setLoading] = useState(true);
   const { user } = useContext(UserContext);
  const [data, setData] = useState(null);
  const [amount, setAmount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`api/dashboard/weekly/${user._id}`);
        const result = await response.json();

        console.log("form : ", result.metrics);
        setData(result.metrics);
        setAmount(result.amount);
        // Remove the console.log here

        if (response.ok) {
          setLoading(false);
        } else {
          console.log("Error while fetching data");
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    fetchData();
  }, [user?._id]);

  // Move the console.log here
  console.log("data: ", data);



  return (
    <div className="h-[90vh] w-full">
      <div className="mb-4 h-8 w-full ">
        <h1 className="hidden text-4xl  lg:block">Weekly Dashboard</h1>
      </div>
      {loading ? (
        "loading..."
      ) : (
        <div className="h-[90vh] w-full">
          {/* <div className="mb-4 h-8 w-full">
            <h1 className="hidden text-4xl  lg:block">Weekly Dashboard</h1>
          </div> */}
          <div
            className="grid  min-h-[95%] 
           w-full  grid-cols-1 grid-rows-4 gap-6 md:grid-cols-5 md:grid-rows-2"
          >
            <div className="rounded-3xl bg-white p-4 shadow-md md:col-span-3 ">
              <StackedColumn
                options={WeekStackColumnOptions}
                series={WeekStackColumnSeries(data.pendingOrder, data.orderDispatched, data.lorryInCampus)}
              />
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-md md:col-span-2 ">
              <BasicBarChart
                series={WeekBarChartSeries(data.advanceOrder)}
                options={WeekBarChartOptions}
              />
            </div>
            <div className=" grid-row-2 grid grid-cols-2 gap-6 md:col-span-2">
              <div className="col-span-2 rounded-3xl bg-white p-4 shadow-md">
                <AreaChart
                  options={WeekAreaChartOptions}
                  series={WeekAreaChartSeries(data.orderDelivered, data.pendingPOD)}
                />
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-md">
                <h2 className="text-left text-lg ">Invoice Completed</h2>
                <RadialBarChart />
              </div>
              <div className="flex flex-col items-center rounded-3xl bg-white p-4 shadow-md">
                <h2 className="text-xl text-slate-500 xl:text-3xl ">
                  Total Amounts
                </h2>
                <div className=" flex flex-grow   flex-col justify-end ">
                  <p className="text-lg xl:text-2xl">Received - {parseFloat((amount.receivedAmount / 1000).toFixed(1))}K</p>
                  <p className="text-lg xl:text-2xl  ">Pending - {parseFloat((amount.balanceAmount / 1000).toFixed(1))}K</p>
                  <p className="text-lg xl:text-2xl  ">Total - {parseFloat((amount.totalAmount / 1000).toFixed(1))}K</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-md md:col-span-3 ">
              <StackedRow
                series={WeekStackRowSeries(data.orderDelivered, data.pendingPOD, data.inTransit)}
                options={WeekStackRowOptions}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekData;
