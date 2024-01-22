import React from 'react'

import BookingReport  from './booking-report/page'
import VehicleReport  from './vehicle-report/page'
import InvoiceReport  from './invoice-report/page'



function page() {
  return (
    <div className="w-full min-h-[90vh] rounded-2xl  bg-white p-6 shadow-sm ">
    <h5 className='text-center text-base md:text-lg  mb-4 xl:mb-8'>Search report from below filters :</h5>
    <div className='flex flex-col xl:flex-row gap-6'>
    <BookingReport />
      <VehicleReport />
      <InvoiceReport />
    </div>
     
    </div>
  )
}

export default page











