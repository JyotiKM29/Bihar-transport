"use client";
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

function StackedRow({options, series}) {

  

  return (
    <div id="chart">
      <ApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
}

export default StackedRow;
