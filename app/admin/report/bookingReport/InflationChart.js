'use client'
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const InflationChart = ({ data, category, fromDate, toDate, totalValue }) => {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    setOptions({
      series: [
        {
          name: 'Booking Report',
          data: data,
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '60px',
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => {
          return ((val / totalValue).toFixed(2) * 100) + '%';
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#304758'], // Ensure color matches if needed
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
  }, [data, category, fromDate, toDate, totalValue]);

  return options ? <ApexChart options={options} type="bar" width="100%" height={350} /> : null;
};

export default InflationChart;
