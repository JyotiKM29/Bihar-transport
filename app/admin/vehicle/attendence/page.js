"use client";
import { Button } from '@/app/components/ui/button'
import React from 'react'
import VehicleEntry from './vehicleEntry/page'
import { useRouter } from 'next/navigation'

const Attendence = () => {
  const route = useRouter();
  function handleNewEntry (){
    route.push("/admin/vehicle/vehicleEntry")
  }
  return (
    <div className="min-h-[90vh] w-full space-y-6">
      <div className="h-8  w-full ">
        <h1 className="hidden text-4xl  lg:block ">Vehicle Attendence</h1>
      </div>
      <div
        className="min-h w-full 
      space-y-2 rounded-2xl  bg-white px-4 py-4 
     shadow-sm md:px-6 xl:h-[95%]"
      >
 <Button onClick={handleNewEntry}>In a vehicle</Button>
 <VehicleEntry />

    </div>
   

    </div>
  )
}

export default Attendence