"use client";
import { Button } from '@/app/components/ui/button'
import { UserContext } from '@/app/context/UserContextProvider';
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

import { IoIosArrowBack } from "react-icons/io";

const PriceSetting = () => {
    const route = useRouter();
    const { user } = useContext(UserContext);

    const [data, setData] = useState(null);
  
    const userId = user?._id;
  

    useEffect(() => {
        const fetchData = async () => {
        
          try {
            if (userId) {
              const response = await fetch(`/api/setting/priceSetting/get/${userId}&1`, {
                method: "GET",
              });
      
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
      
              const data = await response.json();
    
            //   setLoading(false);
              console.log("data", data);
              setData(data.data);
            }
          } catch (error) {
            // setLoading(false);
            console.error("Error:", error);
          }
        };
      
        fetchData();
      }, []);

    function handleBack(){
      route.back();
    }

    function handleNewPriceSetting(){
      route.push("/admin/settings/priceSetting/newPriceSetting")
    }

  return (
    <div className='min-h-[90vh] bg-white rounded-xl shadow-lg p-8 '>
    <div className='flex justify-between items-center'>
        <Button onClick={handleBack} className="flex gap-4 items-center bg-indigo-600 hover:bg-indigo-700">   <IoIosArrowBack className=" fill-white" /> Back</Button>
        <Button onClick={handleNewPriceSetting} className="bg-indigo-600 hover:bg-indigo-700">Add new Price Setting</Button>

    </div>
    <h2 className=" mb-10 text-center text-3xl font-semibold text-blue-800 underline">
        Price Setting
      </h2>

      <div className="overflow-x-auto md:overflow-x-visible">
          <table className="min-w-full border  border-gray-300 bg-white">
            <thead>
              <tr className=" w-full border border-indigo-600 bg-indigo-300 text-indigo-900">
                <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  ">Customer</th>
                <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  ">From Location</th>
                <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  ">To Location</th>
                <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  ">Item</th>
                <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  ">Way</th>
                <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  "> Rate as per</th>
                <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  ">Vehicle Type</th>
                <th className=" text-nowrap border border-indigo-600 p-2 pr-3 text-sm font-medium text-indigo-900  md:text-base  ">Additional Charges</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((price, index) => (
                <tr className="w-full text-center" key={index}>
                
                  <td className="border border-indigo-900 p-2 text-indigo-900">
                    {price.customer}
                  </td>
                  <td className="border border-indigo-900 p-2 text-indigo-900">
                    {price.fromLocation}
                  </td>
                  <td className="border border-indigo-900 p-2 text-indigo-900">
                    {price.toLocation}
                  </td>
                  <td className="border border-indigo-900 p-2 text-indigo-900">
                    {price.searchItemProduct}
                  </td>
                  <td className="border border-indigo-900 p-2 text-indigo-900">
                    {price.way}
                  </td>
                  <td className="border border-indigo-900 p-2 text-indigo-900">
                    {price.rateAsPer}
                  </td>
                  <td className="border border-indigo-900 p-2 text-indigo-900">
                    {price.vehicleType}
                  </td>

                  <td className="border border-indigo-900 p-2 text-indigo-900">
                    {price.additionalCharges.map((item,i)=>(
                        <div key={i} className='border-b-2'>
                            <span>{item.chargeName}</span>,
                            <span>{item.rate}</span>,
                            <span>{item.qty}</span>,
                            <span>{item.amount}</span>
                        </div>
                    ))}
                  </td>
                
                </tr>
              ))}
            </tbody>
          </table>
 </div>
        

    </div>
  )
}

export default PriceSetting