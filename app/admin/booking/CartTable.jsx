'use client'
import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';

const CartTable = ({ items }) => {
  const [cartItems, setCartItems] = useState(items);
  const [noOfItems , setNoOfItems] = useState(0);
  const [totalCost , setTotalCost] = useState(0.0) ;

  useEffect(() => {
    setCartItems(items); 
    let length = items.length ? items.length : 0;
    setNoOfItems(length)
    
  
// Calculate total cost using cartItems directly
const calculatedTotalCost = Array.isArray(cartItems) ? cartItems.reduce((accumulator, currentValue) => {
  return accumulator + currentValue.amount;
}, 0) : 0 ;

// Set the total cost
setTotalCost(calculatedTotalCost);

    },  [items, cartItems]); 

  const handleDelete = (idToRemove) => {
    console.log('delete',idToRemove)
    const updatedItems = cartItems.filter((item, index) => index !== idToRemove);
    setCartItems(updatedItems);
  };

  return (
    <div className='px-4 py-2 w-full overflow-x-scroll'>
      <h2 className="font-semibold text-xl flex gap-2 ">
        <ShoppingCart strokeWidth={2.5} /> Total Item in Cart <p> ({noOfItems})</p>
      </h2>

      <div className='w-full'>
        <table className="mx-2 my-4 w-full border">
          <thead>
            <tr className="font-semiBold w-full border bg-slate-50">
              <th className="font-medium pr-3 text-nowrap ">Material </th>
              <th className="font-medium pr-3 text-nowrap ">HSN</th>
              <th className="font-medium pr-3 text-nowrap ">Qty</th>
              <th className="font-medium pr-3 text-nowrap ">A.Weight</th>
              <th className="font-medium pr-3 text-nowrap ">C.Weight</th>
              <th className="font-medium pr-3 text-nowrap ">Rate</th>
              {/* <th className="font-medium pr-3 text-nowrap ">Rate/Per</th> */}
              <th className="font-medium pr-3 text-nowrap ">Basic Amount</th>
              <th className="font-medium pr-3 text-nowrap ">Tax</th>
              <th className="font-medium pr-3 text-nowrap ">Amount</th>
              <th className="font-medium pr-3 text-nowrap ">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(cartItems) && cartItems.map((item, i) => (
              <tr key={item.hsnNo} className="w-full text-center">
                <td>{item.material}</td>
                <td>{item.hsnNo}</td>
                <td>{item.quantity} {item.quantityUnit}</td>
                <td>{item.actualWeight}{item.actualWeightUnit}</td>
                <td>{item.chargedWeight}{item.chargedWeightUnit}</td>
                <td>{item.rate}({item.rateUnit})</td>
                <td>{item.basicAmount}</td>
                <td>
  {item.GSTPercentage && item.GSTType ? `${item.GSTPercentage * 100} % ${item.GSTType}` : '0%'}
</td>

                <td>{item.amount}</td>
                <td>
                  <button type='button' className="font-bold " >Edit</button> / <button type='button' className="font-bold " onClick={() => handleDelete(item.hsnNo)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='flex justify-end'>
        <p className='w-max'>Total: <span className='bg-green-200 ml-2 border border-green-400 rounded px-4 py-1 '> &#8377; {totalCost.toFixed(2)}  </span></p>
        </div>
      </div>
    </div>
  );
};

export default CartTable;
