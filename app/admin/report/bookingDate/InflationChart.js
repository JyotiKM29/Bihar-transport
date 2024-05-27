"use client";
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import React, { useState, useEffect } from 'react';

const InflationChart = ({ data, category, fromDate, toDate, totalValue }) => {
  
  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: 'bar',
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '60px',
        dataLabels: {
          position: 'bottom', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => {
        return (parseInt(val / totalValue) * 100).toFixed(2) + '%';
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758'],
      },
    },
    xaxis: {
      categories: category,
      position: 'top',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      labels: {
        show: true,
      },
    },
    title: {
      text: `Booking from ${fromDate} to ${toDate}`,
      floating: true,
      offsetY: 330,
      align: 'center',
      style: {
        color: '#444',
      },
    },
  });

  const [series, setSeries] = useState([
    {
      name: 'Booking Report',
      data: data,
    },
  ]);

  return (
    <div id="bar">
      <ApexChart options={options} series={series} type="bar" height={'100%'} />
    </div>
  );
};

export default InflationChart;
