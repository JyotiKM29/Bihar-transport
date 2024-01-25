'use client'

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const RadialBarChart = (
  {value}
) => {
   
    const  series = [value];

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
              
              show: false,
            
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

   

  return   <div >
    <ApexChart type="radialBar" options={options} series={series} height={"100%"} width={"100%"} />
  </div>;
};

export default RadialBarChart;
