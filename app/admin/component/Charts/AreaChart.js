"use client";
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const AreaChart = ({options, series}) => {
 


  return (
    <div id="art">
      <ApexChart options={options} series={series} type="area" height={'100%'} />
    </div>
  );
};

export default AreaChart;
