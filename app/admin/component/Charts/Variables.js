"use client";

const generateDateLabels = () => {
  const startDate = new Date();
  const numberOfDays = 15;
  const dateLabels = [];
  for (let i = 0; i < numberOfDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
    dateLabels.push(formattedDate);
  }

  return dateLabels;
};

const startDate = new Date();
const numberOfDays = 15;
const dateLabels = generateDateLabels(startDate, numberOfDays);

export const WeekAreaChartSeries = [
  {
    name: "Order Delivery",
    data: [3, 6, 8, 10, 5, 9, 11],
  },
  {
    name: "Pending Delivery",
    data: [7, 3, 5, 6, 4, 8, 9],
  },
];

export const WeekAreaChartOptions = {
  chart: {
    height: "100%",
    type: "area",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },

  yaxis: {
    show: false,
  },
  xaxis: {
    type: "day",
    categories: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
  },

  title: {
    text: "Total Order",
    style: {
      color: "#334155",
      fontSize: "24px",
      fontWeight: "500",
    },
  },
  tooltip: {
    xaxis: {
      show: false,
    },
    axis: {
      show: false,
    },
    // x: {
    //   format: "dd/MM/yy HH:mm",
    // },
  },
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
    offsetX: 5,
  },
};
export const MonthAreaChartSeries = [
  {
    name: "Order Delivery",
    data: [3, 6, 8, 10, 5, 9,3, 6, 8, 10,5, 6, 5, 11],
  },
  {
    name: "Pending Delivery",
    data: [7, 3, 5, 6, 4,3, 6, 8,5, 6, 10, 5, 8, 9],
  },
];

export const MonthAreaChartOptions = {
  chart: {
    height: "100%",
    type: "area",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },

  yaxis: {
    show: false,
  },
  xaxis: {
    categories: dateLabels,
  },

  title: {
    text: "Total Order",
    style: {
      color: "#334155",
      fontSize: "24px",
      fontWeight: "500",
    },
  },
  tooltip: {
    xaxis: {
      show: false,
    },
    axis: {
      show: false,
    },
    // x: {
    //   format: "dd/MM/yy HH:mm",
    // },
  },
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
    offsetX: 5,
  },
};
export const YearAreaChartSeries = [
  {
    name: "series1",
    data: [3, 6, 8, 10, 5, 9, 11, 6, 8, 10, 5, 9],
  },
  {
    name: "series2",
    data: [7, 3, 5, 6, 8, 10, 5, 9, 6, 4, 8, 9],
  },
];

export const YearAreaChartOptions = {
  chart: {
    height: "100%",
    type: "area",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },

  yaxis: {
    show: false,
  },
  xaxis: {
    type:"category",
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    labels: {
      formatter: function (val) {
        return val.substring(0, 3);
      },
    },
  },

  title: {
    text: "Total Order",
    style: {
      color: "#334155",
      fontSize: "24px",
      fontWeight: "500",
    },
  },
  tooltip: {
    xaxis: {
      show: false,
    },
    axis: {
      show: false,
    },
    // x: {
    //   format: "dd/MM/yy HH:mm",
    // },
  },
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
    offsetX: 5,
  },
};

export const WeekBarChartSeries = [
  {
    name: "Inflation",
    data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6],
  },
];

export const WeekBarChartOptions = {
  chart: {
    height: 350,
    type: "bar",
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      dataLabels: {
        position: "top", // top, center, bottom
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => {
      return val + "%";
    },
    offsetY: -20,
    style: {
      fontSize: "12px",
      colors: ["#304758"],
    },
  },

  xaxis: {
    categories: ["Mon", "Tues", "Thur", "Fri ", "Sat", "Sun"],

    position: "top",
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      fill: {
        type: "gradient",
        gradient: {
          colorFrom: "#D8E3F0",
          colorTo: "#BED1E6",
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
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
      formatter: function (val) {
        return val + "%";
      },
    },
  },
  title: {
    text: "Total Amounts Recieved ",
    style: {
      color: "#334155",
      fontSize: "24px",
      fontWeight: "500",
    },
  },
};
export const MonthBarChartSeries = [
  {
    name: "Inflation",
    data: [2.3, 3.1, 4.0, 10.1, 4.0,2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 2.3, 3.1, 4.0, 10.1],
  },
];

export const MonthBarChartOptions = {
  chart: {
    height: 350,
    type: "bar",
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      dataLabels: {
        position: "top", // top, center, bottom
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return val + "%";
    },
    offsetY: -20,
    style: {
      fontSize: "12px",
      colors: ["#304758"],
    },
  },

  xaxis: {
    categories: dateLabels,
    position: "top",
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      fill: {
        type: "gradient",
        gradient: {
          colorFrom: "#D8E3F0",
          colorTo: "#BED1E6",
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
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
      formatter: function (val) {
        return val + "%";
      },
    },
  },
  title: {
    text: "Total Amounts Recieved ",
    style: {
      color: "#334155",
      fontSize: "24px",
      fontWeight: "500",
    },
  },
};
export const YearBarChartSeries = [
  {
    name: "Inflation",
    data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 2.3, 3.1, 4.0, 10.1, 4.0, 3.6],
  },
];

export const YearBarChartOptions = {
  chart: {
    height: 350,
    type: "bar",
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      dataLabels: {
        position: "top", // top, center, bottom
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => {
      return val + "%";
    },
    offsetY: -20,
    style: {
      fontSize: "12px",
      colors: ["#304758"],
    },
  },

  xaxis: {
    type: "category",
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],

    labels: {
      formatter: function (val) {
        return val.substring(0, 3);
      },
    },
    position: "top",
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      fill: {
        type: "gradient",
        gradient: {
          colorFrom: "#D8E3F0",
          colorTo: "#BED1E6",
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
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
      formatter: function (val) {
        return val + "%";
      },
    },
  },
  title: {
    text: "Total Amounts Recieved ",
    style: {
      color: "#334155",
      fontSize: "24px",
      fontWeight: "500",
    },
  },
};

export const WeekStackColumnSeries = [
  {
    name: "Pending Order",
    data: [44, 55, 41, 67, 22, 43],
  },
  {
    name: "Dispatch Order",
    data: [13, 23, 20, 8, 13, 27],
  },
  {
    name: "Loory in campus",
    data: [11, 17, 15, 15, 21, 14],
  },

];

export const WeekStackColumnOptions = {
  chart: {
    type: "bar",
    height: 350,
    stacked: true,
    toolbar: {
      show: true,
    },
    zoom: {
      enabled: true,
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: "bottom",
          offsetX: -10,
          offsetY: 0,
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 10,
      dataLabels: {
        total: {
          enabled: true,
          style: {
            fontSize: "13px",
            fontWeight: 900,
          },
        },
      },
    },
  },
  xaxis: {
  
    categories: ["Mon", "Tues", "Thur", "Fri ", "Sat", "Sun"],
  },
  legend: {
    position: "bottom",
    offsetX: 10,
  },
  fill: {
    opacity: 1,
  },

  title: {
    text: "Orders",
     style: {
            color: '#334155',
            fontSize:'24px',
            fontWeight:'500',
          }
  
  },
};

export const MonthStackColumnSeries = [
  {
    name: "Pending Order",
    data: [44, 55, 41, 67, 22, 43 ,13, 23, 20, 8, 13, 15, 21],
  },
  {
    name: "Dispatch Order",
    data: [13, 23, 20, 8, 13, 27, 44, 55, 41, 67, 22, 43 ,13,11, 23],
  },
  {
    name: "Loory in campus",
    data: [11, 17, 15, 15, 21, 14 ,55, 41, 67, 22, 43 ,13, 23, 20, 8],
  },

];

export const MonthStackColumnOptions = {
  chart: {
    type: "bar",
    height: 350,
    stacked: true,
    toolbar: {
      show: true,
    },
    zoom: {
      enabled: true,
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: "bottom",
          offsetX: -10,
          offsetY: 0,
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 10,
      dataLabels: {
        total: {
          enabled: true,
          style: {
            fontSize: "13px",
            fontWeight: 900,
          },
        },
      },
    },
  },
  xaxis: {
  
    categories:dateLabels,
  },
  legend: {
    position: "bottom",
    offsetX: 10,
  },
  fill: {
    opacity: 1,
  },

  title: {
    text: "Orders",
     style: {
            color: '#334155',
            fontSize:'24px',
            fontWeight:'500',
          }
  
  },
};
export const YearStackColumnSeries = [
  {
    name: "Pending Order",
    data: [44, 55, 41, 67, 22, 43,11, 17, 15, 15, 21, 14],
  },
  {
    name: "Dispatch Order",
    data: [13, 23, 20, 8, 13, 27,44, 55, 41, 67, 22, 43],
  },
  {
    name: "Loory in campus",
    data: [11, 17, 15, 15, 21, 14,13, 23, 20, 8, 13, 27],
  },

];

export const YearStackColumnOptions = {
  chart: {
    type: "bar",
    height: 350,
    stacked: true,
    toolbar: {
      show: true,
    },
    zoom: {
      enabled: true,
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: "bottom",
          offsetX: -10,
          offsetY: 0,
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 10,
      dataLabels: {
        total: {
          enabled: true,
          style: {
            fontSize: "13px",
            fontWeight: 900,
          },
        },
      },
    },
  },
  xaxis: {
  
    type: "category",
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    labels: {
      formatter: function (val) {
        return val.substring(0, 3);
      },
    },
  },
  legend: {
    position: "bottom",
    offsetX: 10,
  },
  fill: {
    opacity: 1,
  },

  title: {
    text: "Orders",
     style: {
            color: '#334155',
            fontSize:'24px',
            fontWeight:'500',
          }
  
  },
};

export const WeekStackRowSeries = [
  {
    name: "Order Delivered",
    data: [44, 55, 41, 37, 22, 43, 21],
  },
  {
    name: "Pending POD",
    data: [53, 32, 33, 52, 13, 43, 32],
  },
  {
    name: "In Transit",
    data: [12, 17, 11, 9, 15, 11, 20],
  },

];

export const  WeekStackRowOptions = {
  chart: {
    type: "bar",
    height: 350,
    stacked: true,
  },
  plotOptions: {
    bar: {
      horizontal: true,
      dataLabels: {
        total: {
          enabled: true,
          offsetX: 0,
          style: {
            fontSize: "13px",
            fontWeight: 900,
          },
        },
      },
    },
  },
  stroke: {
    width: 1,
    colors: ["#fff"],
  },
  title: {
    text: "Delivary Status",
    style: {
      color: '#334155',
      fontSize:'24px',
      fontWeight:'500',
    }
  },
  xaxis: {
    categories: ["Mon", "Tues", "Thur", "Fri ", "Sat", "Sun"],
    labels: {
      formatter: function (val) {
        return val + "K";
      },
    },
  },
  yaxis: {
    title: {
      text: undefined,
    },
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + "K";
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    offsetX: 40,
  },
};
export const MonthStackRowSeries = [
  {
    name: "Order Delivered",
    data: [44, 55, 41, 37, 22, 43, 21 , 12, 17, 11, 9, 15, 11, 20 ,51],
  },
  {
    name: "Pending POD",
    data: [53, 32, 33, 52, 13, 43, 32,44, 55, 41, 37, 22, 43, 21 , 12],
  },
  {
    name: "In Transit",
    data: [12, 17, 11, 9, 15, 11, 20, 53, 32, 33, 52, 13, 43, 32,44],
  },

];

export const  MonthStackRowOptions = {
  chart: {
    type: "bar",
    height: 350,
    stacked: true,
  },
  plotOptions: {
    bar: {
      horizontal: true,
      dataLabels: {
        total: {
          enabled: true,
          offsetX: 0,
          style: {
            fontSize: "13px",
            fontWeight: 900,
          },
        },
      },
    },
  },
  stroke: {
    width: 1,
    colors: ["#fff"],
  },
  title: {
    text: "Delivary Status",
    style: {
      color: '#334155',
      fontSize:'24px',
      fontWeight:'500',
    }
  },
  xaxis: {
    categories: dateLabels,
    labels: {
      formatter: function (val) {
        return val + "K";
      },
    },
  },
  yaxis: {
    title: {
      text: undefined,
    },
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + "K";
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    offsetX: 40,
  },
};
export const YearStackRowSeries = [
  {
    name: "Order Delivered",
    data: [44, 55, 41, 37, 22, 43, 21,53, 32, 33, 52, 13, 43, 32],
  },
  {
    name: "Pending POD",
    data: [53, 32, 33, 52, 13, 43, 32,12, 17, 11, 9, 15, 11],
  },
  {
    name: "In Transit",
    data: [12, 17, 11, 9, 15, 11, 20,44, 55, 41, 37, 22, 43],
  },

];

export const  YearStackRowOptions = {
  chart: {
    type: "bar",
    height: 350,
    stacked: true,
  },
  plotOptions: {
    bar: {
      horizontal: true,
      dataLabels: {
        total: {
          enabled: true,
          offsetX: 0,
          style: {
            fontSize: "13px",
            fontWeight: 900,
          },
        },
      },
    },
  },
  stroke: {
    width: 1,
    colors: ["#fff"],
  },
  title: {
    text: "Delivary Status",
    style: {
      color: '#334155',
      fontSize:'24px',
      fontWeight:'500',
    }
  },
  xaxis: {
    type: "category",
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    labels: {
      formatter: function (val) {
        return val.substring(0, 3);
      },
    },
  },
  yaxis: {
    title: {
      text: undefined,
    },
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + "K";
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    offsetX: 40,
  },
};
