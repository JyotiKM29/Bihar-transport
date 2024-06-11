"use client";
import { Button } from '@/app/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UpdateLocationPop from './UpdateLocation';
import { Input } from '@/app/components/ui/input';
import { useToast } from '@/app/components/ui/use-toast';

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0')  ;
  return `${year}-${month}-${day}`;
};

const Attendence = () => {
  const [attendenceData , setAttendenceData] = useState();
  const [todayDate , setTodayDate] = useState(getCurrentDate());
  const route = useRouter();
  const { toast } = useToast();
  function handleNewEntry (){
    route.push("/admin/vehicle/attendence/vehicleEntry")
  }

  

  

  useEffect(() => {
   

    const fetchData = async () => {
      // console.log(dateToday);
      // setLoading(true);
      try {
        const response = await fetch(
          `/api/Attendence/get/${todayDate}`,
          {
            method: "GET",
          },
        );
        const data = await response.json();
        if (response.ok) {
          console.log("attendence", data);
          // setLoading(false);
          setAttendenceData(data)
          displayToast("Fetch Booking Detail Succesfully ", "✅");
        } else {
          // setLoading(false);
          console.error("Error: ", response);
          displayToast("Error in Fetching Data", "❌", data.message);
        }
      } catch (error) {
        // setLoading(false);
        console.error("Error:", error);
        displayToast("Error in Fetching Data", "❌", error.message);
      }
    };

    
      fetchData();
    
  }, [todayDate]);


  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  return (
    <div className="min-h-[90vh] w-full space-y-6 ">
      <div className="h-8  w-full ">
        <h1 className="hidden text-4xl  lg:block ">Vehicle Attendence</h1>
      </div>
      <div
        className="min-h-[80vh] w-full 
      space-y-2 rounded-2xl  bg-white px-4 py-4 
     shadow-sm md:px-6 xl:h-[95%]"
      >
      <div className='flex  items-center justify-between'>
      <label className='flex font-medium items-center  gap-4'>
      Date :
      <Input type='date' value={todayDate} onChange={(e)=>setTodayDate(e.target.value)} className='w-38'/>
      </label>
     

<Button onClick={handleNewEntry}>In a vehicle</Button>
      </div>
  
      { attendenceData?.length > 0 ? 
 <div className="overflow-x-auto md:overflow-x-visible">
       <table className="min-w-full border  border-gray-300 bg-white">
            <thead>
              <tr className=" w-full border border-blue-600 bg-blue-300 text-blue-900">
                <th className=" text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900  md:text-base  ">Vehicle No</th>
                <th className=" text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900  md:text-base  ">Current Location</th>
                <th className=" text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900  md:text-base  ">In-time</th>
                <th className=" text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900  md:text-base  ">Out-time</th>
                <th className=" text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900  md:text-base  ">Update loaction</th>
                <th className=" text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900  md:text-base  ">View loaction</th>
                <th className=" text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900  md:text-base  ">Owner Mobile.No</th>
                <th className=" text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900  md:text-base  ">Driver Mobile.No</th>
              </tr>
            </thead>
            <tbody>
              { attendenceData.map((attendence, index) => (
                <tr className="w-full text-center" key={index}>
                 
                  <td className="border border-blue-900 p-2 text-blue-900">
                    {attendence.vehicleNo}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-900">
                    {attendence.location[attendence.location.length - 1]}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-900">
                    {attendence.inTime}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-900">
                    {attendence.outTime}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-900">
                    <UpdateLocationPop bookingId={attendence._id}/>
                  </td>
                    <td className="border border-blue-900 p-2 text-blue-900">
                    {attendence.location.join(",")}
                  </td>
                    <td className="border border-blue-900 p-2 text-blue-900">
                    {attendence.ownerMobileNo}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-900">
                    {attendence.driverMobileNo}
                  </td>
                </tr>
              )) }
            </tbody>
          </table> 
 </div>: <p className='font-light text-center'>No data is present</p>}
    </div>
   

    </div>
  )
}

export default Attendence