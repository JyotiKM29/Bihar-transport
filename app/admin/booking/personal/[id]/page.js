'use client'

import { useEffect, useState } from "react";
import FieldComponent from './FieldComponent'
import { Button } from "../../../../components/ui/button";

const page = ({params}) => {
  const [booking , setBooking] = useState(null);
  const [loading , setLoading] = useState(false);

  useEffect(()=>{
    const fetchData = async () => {
      setLoading(true);
      try{
        const response = await fetch(`/api/bookingdetails/${params.id}`,{
          method: "GET",
        });
        // console.log(params)
        // console.log(response)


        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
          setLoading(false);
        }

        const data = await response.json();
        setLoading(false);
        setBooking(data)
        
        console.log('data',data)
       
     
      } catch(error){
        setLoading(false);
        console.error("Error:", error);
      }
    };
    fetchData();
    
  },[params.id])
  

  return (
    <div className="min-h-[90vh] w-full bg-white rounded-2xl shadow-sm px-6 py-4 ">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl mb-6">Booking Details: </h1>
        <Button>Edit</Button>
      </div>
      {loading ?
      (<p>Loading.....</p>):<div>
        <FieldComponent 
          label={"Order Id:"}
          value={booking?.orderNumber}
        />
        <FieldComponent 
          label={"Booked Date:"}
          value={booking?.createdAt} // Use the appropriate key for booked date
        />
        <FieldComponent 
          label={"Vehicle Required Date:"}
          value={booking?.vehicleRequiredDate}
        />
        <FieldComponent 
          label={"Consignor Name:"}
          value={booking?.consignorName}
        />
        <FieldComponent 
          label={"Consignor Mobile Number:"}
          value={booking?.consignorMobileNumber}
        />
        <FieldComponent 
          label={"Loading Points:"}
          value={booking?.loadingPoints ? booking.loadingPoints.join(', ') : ''}
        />
        <FieldComponent 
          label={"Consignee Name:"}
          value={booking?.consigneeName}
        />
        <FieldComponent 
          label={"Consignee Mobile Number:"}
          value={booking?.consigneeMobileNumber}
        />
        <FieldComponent 
          label={"Unloading Points:"}
          value={booking?.loadingPoints ? booking.loadingPoints.join(', ') : ''}
        />
      </div>}
    </div>
  )
  
}

export default page
