"use client";
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const AreaChart = () => {
  const series = [
    {
      name: "series1",
      data: [3, 6, 8, 10, 5, 9, 11],
    },
    {
      name: "series2",
      data: [7, 3, 5, 6, 4, 8, 9],
    },
  ];
  const options = {
    chart: {
      height:"100%",
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },

    yaxis:{
      show: false,
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
    },

    title: {
      text: "Total Order",
      style: {
        color: '#334155',
        fontSize:'24px',
        fontWeight:'500',
      }
    },
    tooltip: {
      xaxis:{
        show: false,
      },
      axis:{
        show: false,
      },
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
      offsetX: 5,
    },
  };


  return (
    <div id="chart">
      <ApexChart options={options} series={series} type="area" height={'100%'} />
    </div>
  );
};

export default AreaChart;
