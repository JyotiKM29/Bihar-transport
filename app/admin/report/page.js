import React from 'react'

import BookingReport  from './booking-report/page'
import VehicleReport  from './vehicle-report/page'
import InvoiceReport  from './invoice-report/page'



function page() {
  return (
    <div className="w-full h-full rounded-2xl  bg-white p-6 shadow-sm ">
    <h5 className='text-center text-lg mb-8'>Search report from below filters :</h5>
    <div className='flex gap-6'>
    <BookingReport />
      <VehicleReport />
      <InvoiceReport />
    </div>
     
    </div>
  )
}

export default page











