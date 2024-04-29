"use client";
import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

const CartTable = ({ items , onDelete }) => {
  // const [itemNew , setItemNew] = useState([...items])
  const [cartItems, setCartItems] = useState(items);
  const [noOfItems, setNoOfItems] = useState(0);
  const [totalCost, setTotalCost] = useState(0.0);

  useEffect(() => {
    setCartItems(items);
    let length = cartItems.length ? cartItems.length : 0;
    setNoOfItems(length);

    const calculatedTotalCost = Array.isArray(items)
      ? items.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.amount;
        }, 0)
      : 0;

    setTotalCost(calculatedTotalCost);
  }, [items]);

  // const handleDelete = (hsnRemove) => {

  //  items = items.filter((item) => item.hsnNo !== hsnRemove);

  //   setCartItems([...items]);
  // };

  return (
    <div className="w-full overflow-x-scroll px-4 py-2">
      <h2 className="flex gap-2 text-xl font-semibold ">
        <ShoppingCart strokeWidth={2.5} /> Total Item in Cart{" "}
        <p> ({noOfItems})</p>
      </h2>

      <div className="w-full">
        <table className="mx-2 my-4 w-full border">
          <thead>
            <tr className="font-semiBold w-full border bg-slate-50">
              <th className="text-nowrap pr-3 font-medium ">Material </th>
              <th className="text-nowrap pr-3 font-medium ">HSN</th>
              <th className="text-nowrap pr-3 font-medium ">Qty</th>
              <th className="text-nowrap pr-3 font-medium ">A.Weight</th>
              <th className="text-nowrap pr-3 font-medium ">C.Weight</th>
              <th className="text-nowrap pr-3 font-medium ">Rate</th>
              {/* <th className="font-medium pr-3 text-nowrap ">Rate/Per</th> */}
              <th className="text-nowrap pr-3 font-medium ">Basic Amount</th>
              <th className="text-nowrap pr-3 font-medium ">Tax</th>
              <th className="text-nowrap pr-3 font-medium ">Amount</th>
              <th className="text-nowrap pr-3 font-medium ">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(cartItems) &&
              cartItems.map((item, i) => (
                <tr key={item.hsnNo} className="w-full text-center">
                  <td>{item.material}</td>
                  <td>{item.hsnNo}</td>
                  <td>
                    {item.quantity} {item.quantityUnit}
                  </td>
                  <td>
                    {item.actualWeight}
                    {item.actualWeightUnit}
                  </td>
                  <td>
                    {item.chargedWeight}
                    {item.chargedWeightUnit}
                  </td>
                  <td>
                    {item.rate}({item.rateUnit})
                  </td>
                  <td>{item.basicAmount}</td>
                  <td>
                    {item.GSTPercentage && item.GSTType
                      ? `${item.GSTPercentage * 100} % ${item.GSTType}`
                      : "0%"}
                  </td>

                  <td>{item.amount}</td>
                  <td>
                    <button type="button" className="font-bold ">
                      Edit
                    </button>{" "}
                    /{" "}
                    <button
                      type="button"
                      className="font-bold "
                      onClick={() => onDelete(item.hsnNo)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <p className="w-max">
            Total:{" "}
            <span className="ml-2 rounded border border-green-400 bg-green-200 px-4 py-1 ">
              {" "}
              &#8377; {parseFloat(totalCost).toFixed(2)}{" "}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTable;
