'use client'
import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';

const CartTable = ({ items }) => {
  const [cartItems, setCartItems] = useState(items);

  useEffect(() => {
    setCartItems(items); 
    }, [items]);

  const handleDelete = (idToRemove) => {
    const updatedItems = cartItems.filter((item, index) => index !== idToRemove);
    setCartItems(updatedItems);
  };

  return (
    <div className='px-4 py-2 w-full overflow-x-scroll'>
      <h2 className="font-semibold text-xl flex gap-2 ">
        <ShoppingCart strokeWidth={2.5} /> Total Item in Cart
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
              <tr key={i} className="w-full text-center">
                <td>{item.material}</td>
                <td>{item.hsnNo}</td>
                <td>{item.quantity} {item.quantityUnit}</td>
                <td>{item.actualWeight}{item.actualWeightUnit}</td>
                <td>{item.chargedWeight}{item.chargedWeightUnit}</td>
                <td>{item.rate}({item.rateUnit})</td>
                <td>{item.basicAmount}</td>
                <td>{item.GSTPercentage * 100} % {item.GSTType}</td>
                <td>{item.amount}</td>
                <td>
                  <button  className="font-bold " >Edit</button> / <button className="font-bold " onClick={() => handleDelete(i)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CartTable;
