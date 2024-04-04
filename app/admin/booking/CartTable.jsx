import React from 'react'
import { ShoppingCart } from 'lucide-react';

const CartTable = ({items}) => {
  return (
    <div className='px-4 py-2 w-full '>
        <h2 className="font-semibold text-xl flex gap-2 "><ShoppingCart strokeWidth={2.5} /> Total Item in Cart</h2>
   

 
    <div className=' w-full'>
    { (
      <table className="mx-2 my-4 w-full border">
        <thead>
          <tr className="w-full border bg-slate-50">
          <th>HSN</th>
            <th>Material Name</th>
            <th>Quantity</th>
            <th>Weight</th>
            <th>Rate</th>
            <th>Rate/Per</th>
            <th>Basic Amount</th>
           
            <th>Tax</th>
            <th>Amount</th>
             {/* <th>Action
</th> */}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(items) && items.map((items, i) => (
            <tr key={i} className="w-full text-center">
              <td>{items.hsnNo}</td>
              <td>{items.material}</td>
              <td>{items.quantity} {items.quantityUnit}</td>
              <td>{items.actualWeight}{items.actualWeightUnit} </td>
              {/* <td>{items.chargedWeight}{items.chargedWeightUnit}</td> */}
              <td>{items.rate}({items.rateUnit})</td>
              <td>{items.rateAsPer}({items.rateAsPerOption})</td>
             
              <td>{items.basicAmount}</td>
              <td>{ items.GSTPercentage * 100}%</td>
              <td>{items.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
  </div>
  )
}

export default CartTable
