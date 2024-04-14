"use client";
import React, { useContext, useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";
import AllocateVehicle from './AllocateVehicle';
import Link from "next/link";

const Allocation = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const {toast} = useToast()
  const { user } = useContext(UserContext);
  const [vehicleData, setVehicleData] = useState([]);
  const [vehicleNo, setVehicleNo] = useState("");
  const userId = user?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const response = await fetch(`/api/vehicledata/${userId}`, {
            method: "GET",
          });
          // console.log(response);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();

          setLoading(false);

          setVehicleData(data);
          // console.log("vehicle ", data);

        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [userId]);

  const filterData =
    vehicleData && vehicleData.data && Array.isArray(vehicleData.data)
      ? vehicleData.data.filter((vehicle) =>
          vehicle.vehicleNo.toLowerCase().includes(vehicleNo.toLowerCase()),
        )
      : [];

    
  const   vehicleDataSlice =  filterData.slice(0,4);

  

 


  return (
    <div className=" h-fit  w-full overflow-hidden rounded-3xl bg-white px-6 py-4  shadow-sm">
      <h2 className="font-bold  text-blue-700  text-4xl p-1">Vehicle Allocation : </h2>
      <div className="flex flex-col mt-6 h-full w-full ">
        <div 
        
        className="self-end w-full flex justify-between items-center shadow-md border px-6 py-4 rounded-xl  mb-8"
        >
          <label className="flex items-center justify-start gap-4 text-nowrap">
            Order No :<h2 className="font-semibold">{params.OrderId}</h2>
          </label>
          <div className="flex gap-3 items-center">
          <label className="flex items-center justify-start gap-4 text-nowrap">
            Search by Vehicle No:
            <Input
              className='w-[20rem]'
              type="text"
              placeholder="Enter Vehicle No"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
            />
          </label>

         


          <Link href='/admin/vehicle' className="bg-blue-600 text-white w-fit px-4 py-2 rounded text-nowrap  self-center"
          type='submit'

          >
           Add New Vehicle 
          </Link>
          </div>
          
        </div>

         {/* data table */}
        
  <table className="min-w-full divide-y divide-gray-200 border rounder-lg">
    <thead className="bg-gray-50 ">
      <tr>
        <th className="px-4 py-2 font-medium text-left">Vehicle No</th>
        <th className="px-4 py-2 font-medium text-left">Driver Name</th>
        <th className="px-4 py-2 font-medium text-left">Vehicle Type</th>
        <th className="px-4 py-2  font-medium text-left">Capacity </th>
        <th className="px-4 py-2  font-medium text-left">Filled</th>
        <th className="px-4 py-2 font-medium text-left">Vehicle Age</th>
        <th className="px-4 py-2 font-medium text-left">Allocation</th>
        <th className="px-4 py-2 font-medium text-left">Owner Name</th>
      </tr>
    </thead>
    <tbody>
      {vehicleDataSlice.map((data) => (
        <tr key={data._id} className="border-t">
          <td className="px-4 py-2 whitespace-nowrap">{data.vehicleNo}</td>
          <td className="px-4 py-2 whitespace-nowrap">{data.driver.name}</td>
          <td className="px-4 py-2 whitespace-nowrap">{data.vehicleType}</td>
          <td className="px-4 py-2 whitespace-nowrap">{data.maxCapacity} ton</td>
          <td className="px-4 py-2 whitespace-nowrap">{ data.maxCapacity * 100 -  data.filledWeight} kg</td>
          <td className="px-4 py-2 whitespace-nowrap">{data.vehicleAge}</td>
          <td className="px-4 py-2 whitespace-nowrap">{data.allotmentStatus ? "Booked" :"UnBooked"}</td>
          <td className="px-4 py-2 whitespace-nowrap">{data.owner.name}</td>
        </tr>
      ))}
    </tbody>
  </table>


<AllocateVehicle params={params} />
      </div>
    </div>
  );
};

export default Allocation;