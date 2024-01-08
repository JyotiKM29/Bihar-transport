'use client'

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const RadialBarChart = () => {
   
    const  series = [70];

    const options = {
     
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
              fontSize: "2.2vh",
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

   

  return <>
    <ApexChart type="radialBar" options={options} series={series} height={"100%"} width={"100%"} />
  </>;
};

export default RadialBarChart;
