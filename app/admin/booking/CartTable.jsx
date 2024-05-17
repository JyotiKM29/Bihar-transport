"use client";
import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

const CartTable = ({ form, items, onDelete, onEdit }) => {
  const [cartItems, setCartItems] = useState(items);
  const [noOfItems, setNoOfItems] = useState(0);
  const [totalCost, setTotalCost] = useState(0.0);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    setCartItems(items);
    const length =
      Array.isArray(cartItems) && cartItems.length ? cartItems.length : 0;
    setNoOfItems(length);

    const calculatedTotalCost = Array.isArray(items)
      ? items.reduce((accumulator, currentValue) => {
          return parseFloat(accumulator) + parseFloat(currentValue.amount);
        }, 0)
      : 0;

    setTotalCost(calculatedTotalCost);

    form.setValue("partyBhara", totalCost);
    console.log("partyBhara Jyoti KM", form.getValues("partyBhara"));
  }, [items]);

  const handleEditClick = (item) => {
    setIsEditing(true);
    setCurrentItem(item);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleEditSubmit = () => {
    onEdit(currentItem);
    setIsEditing(false);
    setCurrentItem(null);
  };

  return (
    <div className="w-full overflow-x-scroll px-4 py-2">
      <h2 className="flex gap-2 text-xl font-semibold">
        <ShoppingCart strokeWidth={2.5} /> Total Item in Cart{" "}
        <p>({noOfItems})</p>
      </h2>

      <div className="w-full">
        <table className="mx-2 my-4 w-full border">
          <thead>
            <tr className="font-semiBold w-full border bg-slate-50">
              <th className="text-nowrap pr-3 font-medium">Material</th>
              <th className="text-nowrap pr-3 font-medium">HSN</th>
              <th className="text-nowrap pr-3 font-medium">Qty</th>
              <th className="text-nowrap pr-3 font-medium">A.Weight</th>
              <th className="text-nowrap pr-3 font-medium">C.Weight</th>
              <th className="text-nowrap pr-3 font-medium">Rate</th>
              <th className="text-nowrap pr-3 font-medium">Basic Amount</th>
              <th className="text-nowrap pr-3 font-medium">Tax</th>
              <th className="text-nowrap pr-3 font-medium">Amount</th>
              <th className="text-nowrap pr-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(cartItems) &&
              cartItems.map((item, i) => (
                <tr key={i} className="w-full text-center">
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
                    <button
                      type="button"
                      className="font-bold"
                      onClick={() => handleEditClick(item)}
                    >
                      Edit
                    </button>{" "}
                    /{" "}
                    <button
                      type="button"
                      className="font-bold"
                      onClick={() => onDelete(item.hsnNo)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {isEditing && (
          <div className="edit-form">
            <h3>Edit Item</h3>
            <input
              type="text"
              name="material"
              value={currentItem.material}
              onChange={handleEditChange}
            />
            <input
              type="text"
              name="quantity"
              value={currentItem.quantity}
              onChange={handleEditChange}
            />
            {/* Add other fields as necessary */}
            <button type="button" onClick={handleEditSubmit}>
              Save
            </button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        )}

        <div className="flex justify-end">
          <p className="w-max">
            Total:{" "}
            <span className="ml-2 rounded border border-green-400 bg-green-200 px-4 py-1">
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
