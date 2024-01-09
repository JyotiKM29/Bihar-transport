import React from "react";
import StackedColumn from './Charts/StackedColumn'
import StackedRow from './Charts/StackedRow'
import BasicBarChart from './Charts/BasicBarChart'
import AreaChart from './Charts/AreaChart'
import RadialBarChart from './Charts/RadialBarChart'



const YearData = () => {
  return (
    <div className="h-[90vh] w-full">
    <div className="mb-4 w-full">
      <h1  className="text-4xl opacity-0 lg:opacity-100">Yearly Dashboard</h1>
    </div>
    <div
        className="grid  min-h-[95%] 
           w-full  grid-cols-1 grid-rows-4 gap-6 md:grid-cols-5 md:grid-rows-2"
      >
        <div className="rounded-3xl bg-white p-4 shadow-md md:col-span-3 ">
         <StackedColumn  />
        </div>
        <div className="rounded-3xl bg-white p-4 shadow-md md:col-span-2 ">
        <StackedRow />
        </div>
        <div className=" md:col-span-2 grid grid-cols-2 grid-row-2 gap-6">
          
          <div className="col-span-2 rounded-3xl bg-white p-4 shadow-md">
          <AreaChart />
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-md"><RadialBarChart /></div>
          <div className="rounded-3xl bg-white p-4 shadow-md">row 3</div>

        </div>
        <div className="rounded-3xl bg-white p-4 shadow-md md:col-span-3 ">
          <BasicBarChart />
        </div>
      </div>
  </div>
  )
}

export default YearData
