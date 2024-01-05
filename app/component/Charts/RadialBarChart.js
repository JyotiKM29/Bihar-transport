'use client'
import React, { useEffect, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';

const RadialBarChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const options = {
      series: [70],
      chart: {
        height: "100%",
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 15,
            size: '56%',
          },
          

          dataLabels: {
            showOn: "always",
            name: {
              // offsetY: -10,
              show: false,
              // color: "#888",
              // fontSize: "13px"
            },
            value: {
              // offset:-5,
              color: "#1e40af",
              fontSize: "2vw",
              fontWeight:"bold",
              show: true,
              
            }
          }
        },

        
      },

      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          gradientToColors: ["#1e40af"],
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: "round",
      },
      labels: ['Cricket'],
    };

    if (chartRef.current) {
      const chart = new ApexCharts(chartRef.current, options);
      chart.render();
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.innerHTML = '';
      }
    };
  }, []);

  return <div ref={chartRef} id="chart" />;
};

export default RadialBarChart;
