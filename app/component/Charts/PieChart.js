'use client'
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChart = () => {
  const [chartData, setChartData] = useState({
    series: [44, 55],
    
    options: {
      chart: {
        type: 'donut',
        height: "100%",
      },
      legend:{
        show : false,
    },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
                width: "100%",
                height: "auto",
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    
    return () => {
      
    };
  }, []); 

  return (
    <div id="chart" className="h-full w-full" >
      <ReactApexChart options={chartData.options} series={chartData.series} type="donut" />
    </div>
  );
};

export default PieChart;
