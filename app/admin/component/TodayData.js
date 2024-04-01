"use client";
import React, { useContext, useEffect, useState } from "react";
import RadialBarChart from "./Charts/RadialBarChart";
import { BsBank2 } from "react-icons/bs";
import { Progress } from "../../components/ui/progress";
import { FiBarChart } from "react-icons/fi";
import { FaClock } from "react-icons/fa";
import { UserContext } from "../../context/UserContextProvider";
import Link from "next/link";

const TodayData = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);

 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`api/dashboard/today/${user._id}`);
        const result = await response.json();
  
        console.log(result);
        setData(result.data);
        console.log(data);
  
        if (response.ok) {
          setLoading(false);
        } else {
          console.log("Error while fetching data");
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
  
    fetchData();
  }, [user?._id]);
  

 

  const pendingOrder = Math.round((data?.pendingOrder / data?.totalOrder) * 100);
  const dispatchedOrder = Math.round((data?.orderDispatched / data?.totalOrder) * 100);
  const lorryInCampus = Math.round((data?.lorryInCampus / data?.totalOrder) * 100);
  const inTransit = Math.round((data?.inTransit / data?.totalOrder) * 100);
  const orderDilevered = Math.round((data?.orderDelivered / data?.totalOrder) * 100);
  const pendingPOD = Math.round((data?.pendingPOD / data?.totalOrder) * 100);
  const invoice = Math.round((data?.invoice / data?.invoice) * 100);
  const pendingInvoice = Math.round((data?.pendingInvoice / data?.invoice) * 100);
  const generatedInvoice = Math.round((data?.generatedInvoice / data?.invoice) * 100);
  const totalAmount = Math.round((data?.totalAmount)/1000)
  const advanceAmount = Math.round((data?.advanceAmount)/1000)

  

  return (
    <div className="h-[90vh] w-full">
      <div className="mb-4 h-8 w-full ">
        <h1 className="hidden text-4xl  lg:block">Today Dashboard</h1>
      </div>
      {loading ? (
        "loading..."
      ) : (
        <div
          className="min-h grid w-full grid-cols-4
  grid-rows-4  gap-6 md:grid-rows-5
   xl:h-[95%] xl:grid-cols-5 xl:grid-rows-2"
        >
          <div
            className="col-span-4 row-span-2 
                      grid grid-cols-1 
                     grid-rows-6 gap-6 
                      md:grid-cols-2 
                       md:grid-rows-3 lg:col-span-4
                        lg:row-span-2 xl:col-span-4
                       xl:row-span-1 xl:grid-cols-3 xl:grid-rows-2 "
          >
            <Link href='/admin/booking?tab=pending'
              className="flex  h-full w-full  
          rounded-3xl bg-white p-4 shadow-md "
            >
              <div  className=" flex h-full w-2/5 flex-col justify-between p-2 xl:p-1 2xl:p-2">
                <p className="text-lg text-slate-400 xl:text-wrap xl:text-base 2xl:text-wrap 2xl:text-lg">
                  Pending Order
                </p>
                <h2 className="text-semiBold text-6xl lg:text-5xl ">
                  {data?.pendingOrder}
                </h2>
              </div>
              <div className=" flex-grow-1 h-full w-3/5 ">
                <RadialBarChart value={pendingOrder} />
              </div>
            </Link>
            <Link href='/admin/booking?tab=dispatch'
              className="flex  h-full w-full  
          rounded-3xl bg-white p-4 shadow-md "
            >
              <div className=" flex h-full w-2/5 flex-col justify-between p-2 xl:p-1 2xl:p-2">
                <p className="text-lg text-slate-400 xl:text-wrap xl:text-base 2xl:text-wrap 2xl:text-lg">
                  Dispatched Order
                </p>
                <h2 className="text-semiBold text-6xl lg:text-5xl ">
                  {data?.orderDispatched}
                </h2>
              </div>
              <div className=" flex-grow-1 h-full w-3/5 ">
                <RadialBarChart value={dispatchedOrder} />
              </div>
            </Link>
            <Link href='/admin/booking'
              className="flex  h-full w-full  
          rounded-3xl bg-white p-4 shadow-md "
            >
              <div className=" flex h-full w-2/5 flex-col justify-between p-2 xl:p-1 2xl:p-2">
                <p className="text-lg text-slate-400 xl:text-wrap xl:text-base 2xl:text-wrap 2xl:text-lg">
                  Lorry In Campus
                </p>
                <h2 className="text-semiBold text-6xl lg:text-5xl ">
                  {data?.lorryInCampus}
                </h2>
              </div>
              <div className=" flex-grow-1 h-full w-3/5 ">
                <RadialBarChart value={lorryInCampus} />
              </div>
            </Link>
            <Link href='/admin/booking?tab=intransist'
              className="flex  h-full w-full  
          rounded-3xl bg-white p-4 shadow-md "
            >
              <div className=" flex h-full w-2/5 flex-col justify-between p-2 xl:p-1 2xl:p-2">
                <p className="text-lg text-slate-400 xl:text-wrap xl:text-base 2xl:text-wrap 2xl:text-lg">
                  In Transit
                </p>
                <h2 className="text-semiBold text-6xl lg:text-5xl ">
                  {data?.inTransit}
                </h2>
              </div>
              <div className=" flex-grow-1 h-full w-3/5 ">
                <RadialBarChart value={inTransit} />
              </div>
            </Link>
            <Link href='/admin/booking?tab=delivered'
              className="flex  h-full w-full  
          rounded-3xl bg-white p-4 shadow-md "
            >
              <div className=" flex h-full w-2/5 flex-col justify-between p-2 xl:p-1 2xl:p-2">
                <p className="text-lg text-slate-400 xl:text-wrap xl:text-base 2xl:text-wrap 2xl:text-lg">
                  Order Delivered
                </p>
                <h2 className="text-semiBold text-6xl lg:text-5xl ">
                  {data?.orderDelivered}
                </h2>
              </div>
              <div className=" flex-grow-1 h-full w-3/5 ">
                <RadialBarChart value={orderDilevered} />
              </div>
            </Link>
            <Link href='/admin/booking'
              className="flex  h-full w-full  
          rounded-3xl bg-white p-4 shadow-md "
            >
              <div className=" flex h-full w-2/5 flex-col justify-between p-2 xl:p-1 2xl:p-2">
                <p className="text-lg text-slate-400 xl:text-wrap xl:text-base 2xl:text-wrap 2xl:text-lg">
                  Pending POD
                </p>
                <h2 className="text-semiBold text-6xl lg:text-5xl ">
                  {data?.pendingPOD}
                </h2>
              </div>
              <div className=" flex-grow-1 h-full w-3/5 ">
                <RadialBarChart value={pendingPOD}/>
              </div>
            </Link>
          </div>

          <div
            className="
    col-span-4 row-start-3
    grid gap-6 md:grid-cols-3 
    md:grid-rows-1 xl:col-span-1
    xl:row-span-2 xl:grid-cols-1 xl:grid-rows-3"
          >
            <div className="flex flex-col justify-between rounded-3xl border bg-gradient-to-t from-[#0906b7] to-blue-500 p-4 text-white shadow-md lg:p-7">
              <p className="text-2xl font-light">Total Order</p>
              <h4 className="font-semiBold  text-center text-8xl xl:text-7xl">
                {data?.totalOrder}
              </h4>
              <FiBarChart className="relative h-12 w-12 self-end" />
            </div>

            <div className="flex flex-col justify-between rounded-3xl border bg-white p-4 shadow-md lg:p-6">
              <div>
                <p className="text-md text-left  text-slate-400">
                  Easy way Bill Expiry{" "}
                </p>
                <p className="text-left text-blue-700 ">in 2 days</p>
              </div>

              <h4 className="text-bold text-center text-8xl  xl:text-6xl">
                {data?.ewayWayBillExpiry}
              </h4>

              <FaClock className="h-12  self-end fill-blue-700" size={20} />
            </div>

            <div className="flex flex-col justify-between  rounded-3xl border bg-gradient-to-t from-[#0906b7] to-blue-500 p-4 text-white shadow-md lg:p-7 ">
              <p className="self-start text-2xl font-light">Advance Booking</p>
              <h4
                className="self-end text-7xl xl:text-5xl"
                style={{ fontWeight: "300" }}
              >
                <span style={{ fontWeight: "500" }}>{data?.advanceBooking}</span>
                /10
              </h4>
            </div>
          </div>

          <div
            className="
      col-span-4
    row-span-2 space-y-6 md:flex md:gap-6 xl:row-start-2 xl:row-end-3"
          >
            <div className=" grid w-full grid-rows-3 gap-6  md:w-2/5">
              <div className="flex  h-full w-full  flex-col justify-between rounded-3xl bg-white p-4 shadow-md lg:px-6 lg:py-4">
                <div className=" flex w-full justify-between ">
                  <h2 className="text-4xl md:text-6xl">{data?.invoice}</h2>
                  <div>
                    <h4 className="text-lg text-slate-400">Invoice</h4>
                    <h2 className="text-right text-lg text-blue-700">
                    {invoice}%</h2>
                  </div>
                </div>

                <Progress value={invoice} />
              </div>
              <div className="flex  h-full w-full  flex-col justify-between rounded-3xl bg-white p-4 shadow-md lg:px-6 lg:py-4">
                <div className=" flex w-full justify-between ">
                  <h2 className="text-4xl md:text-6xl">
                    {data?.pendingInvoice}
                  </h2>
                  <div>
                    <h4 className="text-lg text-slate-400">Pending Invoice</h4>
                    <h2 className="text-right text-lg text-blue-700">{pendingInvoice}%</h2>
                  </div>
                </div>

                <Progress value={pendingInvoice} />
              </div>
              <div className="flex  h-full w-full  flex-col justify-between rounded-3xl bg-white p-4 shadow-md lg:px-6 lg:py-4">
                <div className=" flex w-full justify-between ">
                  <h2 className="text-4xl md:text-6xl">{data?.generatedInvoice}</h2>
                  <div>
                    <h4 className="text-lg text-slate-400">Generated Invoice</h4>
                      <h2 className="text-right text-lg text-blue-700">{generatedInvoice}%</h2>
                  </div>
                </div>

                <Progress value={pendingInvoice} />
              </div>
            </div>
            <div className="grid  w-full grid-rows-2 gap-6 md:w-3/5">
              <div className="flex rounded-3xl border bg-white p-4 shadow-md   lg:p-7">
                <div className="flex h-full w-2/3 flex-col justify-between">
                  <p className="text-xl text-slate-400">Advance Amount</p>
                  <h2 className="text-4xl 2xl:text-6xl">
                    {advanceAmount}K
                  </h2>
                </div>
                <div className="flex h-full w-1/3 items-center justify-center">
                  <div className="flex h-[20vw] w-[20vw] items-center  justify-center rounded-full border bg-blue-100 md:h-[15vw] md:w-[15vw] xl:h-[8vw] xl:w-[8vw] 2xl:h-[6vw] 2xl:w-[6vw]">
                    <BsBank2
                      className="h-[10vw] w-[10vw] 
                    fill-blue-700 md:h-[6vw] md:w-[6vw] xl:h-[3vw] xl:w-[3vw] 2xl:h-[1.5vw] 2xl:w-[1.5vw]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex rounded-3xl border bg-white p-4 shadow-md   lg:p-7">
                <div className="flex h-full w-2/3 flex-col justify-between">
                  <p className="text-xl text-slate-400">Total Amount</p>
                  <h2 className="text-4xl 2xl:text-6xl">{totalAmount}K</h2>
                </div>
                <div className="flex h-full w-1/3 items-center justify-center">
                  <div className="flex h-[20vw] w-[20vw] items-center  justify-center rounded-full border bg-blue-100 md:h-[15vw] md:w-[15vw] xl:h-[8vw] xl:w-[8vw] 2xl:h-[6vw] 2xl:w-[6vw]">
                    <BsBank2
                      className="h-[10vw] w-[10vw] 
                    fill-blue-700 md:h-[6vw] md:w-[6vw] xl:h-[3vw] xl:w-[3vw] 2xl:h-[1.5vw] 2xl:w-[1.5vw]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayData;
