import React from 'react'
import { Button } from '../../../components/ui/button'

const InvoiceReport = () => {
    return (
        <div
        className="max-h flex 
        w-full xl:w-1/3 flex-col  gap-3 space-y-2 rounded-2xl 
         bg-white px-4 py-4  shadow-md md:p-6 xl:h-[95%]"
      >
        <h1 className="text-2xl xl:text-3xl text-center lg:block ">InVoice Report</h1>
        <Button > Billing Report</Button>
<Button > Outstanding Report</Button>
      </div>
      
  )
}

export default InvoiceReport

