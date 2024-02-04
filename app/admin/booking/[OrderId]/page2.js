"use client";
import React, { useContext, useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";

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
          console.log(response);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();

          setLoading(false);

          setVehicleData(data);
          console.log("vehicle ", data);

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

      async function handleSubmit(e) {
        e.preventDefault();
      
        try {
          setLoading(true);
      
          const response = await fetch('/api/vehicleAllocation', {
            method: 'POST',
            body: JSON.stringify({
              vehicleNo,
              adminId: userId,
              orderNo: params.bookingId,
            }),
          });
      
          const result = await response.json();
      
          if (response.ok) {
            displayToast('Successfully allocated', '✅');
          } else {
            console.error('Error:', result.message);
            displayToast('Error', '❌', result.message);
          }
        } catch (error) {
          console.error('Error:', error.message);
          displayToast('Error', '❌', error.message);
        } finally {
          setLoading(false);
        }
      }
      

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };


  return (
    <div className="h-full w-full rounded-3xl bg-white px-6 py-4  shadow-sm">
      <h2 className="font-semiBold text-3xl ">Vehicle Allocation : </h2>
      <div className="flex flex-col mt-6 h-full w-full ">
        <form 
        onSubmit={handleSubmit}
        className="self-end w-full flex justify-between items-center shadow-md border px-6 py-4 rounded-xl  mb-8"
        >
          <label className="flex items-center justify-start gap-4 text-nowrap">
            Order No :<h2>{params.bookingId}</h2>
          </label>
          <div className="flex gap-3 items-center">
          <label className="flex items-center justify-start gap-4 text-nowrap">
            Vehicle Id:
            <Input
              className='w-[20rem]'
              type="text"
              placeholder="Enter Vehicle No"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
            />
          </label>

         


          <Button className="w-[8rem] self-center"
          type='submit'
          >
            {loading ? "loading ..." : "Submit"}
          </Button>
          </div>
          
        </form>

         {/* data table */}
         <div className="overflow-scroll h-full w-full">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-2 text-left">Vehicle No</th>
        <th className="px-4 py-2 text-left">Driver Name</th>
        <th className="px-4 py-2 text-left">Vehicle Type</th>
        <th className="px-4 py-2 text-left">Fuel Name</th>
        <th className="px-4 py-2 text-left">Vehicle Age</th>
        <th className="px-4 py-2 text-left">Allocation</th>
        <th className="px-4 py-2 text-left">Owner Name</th>
      </tr>
    </thead>
    <tbody>
      {filterData.map((data) => (
        <tr key={data._id} className="border-t">
          <td className="px-4 py-2 whitespace-nowrap">{data.vehicleNo}</td>
          <td className="px-4 py-2 whitespace-nowrap">{data.driver.name}</td>
          <td className="px-4 py-2 whitespace-nowrap">{data.vehicleType}</td>
          <td className="px-4 py-2 whitespace-nowrap">{data.fuelName}</td>
          <td className="px-4 py-2 whitespace-nowrap">{data.vehicleAge}</td>
          <td className="px-4 py-2 whitespace-nowrap">{data.allotmentStatus ? "Booked" :"UnBooked"}</td>
          <td className="px-4 py-2 whitespace-nowrap">{data.owner.name}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      </div>
    </div>
  );
};

export default Allocation;