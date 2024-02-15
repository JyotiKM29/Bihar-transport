'use client'
import React, { useState } from 'react'
import { Button } from '../../../components/ui/button'
import Link from 'next/link'
import AddNew from './AddNew'

const MoneyReceipt = () => {
  const [showAddForm , setShowAddForm] = useState(false);

  return (
    <div className="mt-14 lg:my-4 max-w max-h  bg-white py-4 lg:p-8 px-4 md:px-10 lg:px-20 shadow-md rounded-md">
<div className='flex justify-between items-center'>
<h2 className="text-3xl  font-semibold mb-8">Money Receipt :</h2>
          <div className='flex gap-3'>
        
            <Button onClick={()=>setShowAddForm(!showAddForm)}>{!showAddForm ? "Add New ": "Back"}</Button>
            <Button variant='secondary'> Statements</Button>

          </div>
</div>

{
  showAddForm && <AddNew />
}
   
          
        </div>
  )
}

export default MoneyReceipt
