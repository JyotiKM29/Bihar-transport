"use client";
import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useState } from "react";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StackedColumn = ({series, options}) => {

  return (
    <div id="chart" >
      
      <ApexChart options={options} series={series} type="bar" height={350} />
      
    </div>
  );
};

export default StackedColumn;
