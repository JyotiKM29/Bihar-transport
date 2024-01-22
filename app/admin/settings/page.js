import React from 'react'
import MasterSetting from './master-setting/page'
import VehicleSetting from './vehicle-setting/page'
import PriceMangement from './price-mangement/page'
import TaxSetting from './tax-setting/page'
import OtherSetting from './other-setting/page'

const page = () => {
  return (
    <div className="w-full h-full rounded-2xl  bg-white p-6 shadow-sm ">
    <h5 className='text-center text-lg mb-8'>Search report from below filters :</h5>
    <div className='grid grid-cols-3 gap-6'>
     <MasterSetting />
     <VehicleSetting />
     <PriceMangement />
     <OtherSetting />
     <TaxSetting />
     
    
    </div>
     
    </div>
  )
}

export default page
