import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "@/app/components/ui/input";

const CartTable = ({ items, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  const handleEditClick = (item, index) => {
    setIsEditing(true);
    setCurrentItem(item);
    setCurrentIndex(index);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleEditSubmit = () => {
    onEdit(currentIndex, currentItem);
    setIsEditing(false);
    setCurrentItem(null);
    setCurrentIndex(null);
  };
    
    
    useEffect(() => {
      const disableScrollOnNumberInput = (e) => {
        if (e.target.type === "number") {
          e.preventDefault();
        }
      };

      const handleWheelEvent = (e) => {
        if (document.activeElement.type === "number") {
          document.activeElement.blur();
        }
      };

      window.addEventListener("wheel", disableScrollOnNumberInput, {
        passive: false,
      });
      window.addEventListener("wheel", handleWheelEvent);

      return () => {
        window.removeEventListener("wheel", disableScrollOnNumberInput);
        window.removeEventListener("wheel", handleWheelEvent);
      };
    }, []);

  return (
    <div className="w-full overflow-x-scroll px-4 py-2">
      <h2 className="flex gap-2 text-xl font-semibold">
        <ShoppingCart strokeWidth={2.5} /> Total Item in Cart{" "}
        <p>({items?.length})</p>
      </h2>

      <div className="w-full">
        <table className="mx-2 my-4 w-full border">
          <thead>
            <tr className="font-semiBold w-full border bg-slate-50">
              <th className="text-nowrap pr-3 font-medium">Charge Name</th>
              
              <th className="text-nowrap pr-3 font-medium">Rate</th>
              <th className="text-nowrap pr-3 font-medium">Qty</th>
              <th className="text-nowrap pr-3 font-medium">Amount</th>
              <th className="text-nowrap pr-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item, i) => (
              <tr key={i} className="w-full text-center">
                <td>{item.chargeName}</td>
                <td>{item.rate}</td>
                <td>{item.qty}</td>
              
          
                <td>{item.qty}</td>
                <td>
                  <button
                    type="button"
                    className="font-bold"
                    onClick={() => handleEditClick(item, i)}
                  >
                    Edit
                  </button>{" "}
                  /{" "}
                  <button
                    type="button"
                    className="font-bold"
                    onClick={() => onDelete(i)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isEditing && (
          <div className="edit-form  rounded-xl p-6 shadow-lg bg-cyan-100 mb-8">
            <h3 className="mb-4 text-lg font-semibold text-center underline mt-6">Edit Product</h3>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="flex gap-4 items-center">
                <label className="font-medium text-nowrap">Charge Name :</label>
                <Input
                  type="text"
                  name="chargeName"
                  value={currentItem.chargeName}
                  onChange={handleEditChange}
                  
                />
              </div>
              <div className="flex gap-4 items-center">
                <label className="font-medium text-nowrap">Rate :</label>
                <Input
                  type="text"
                  name="rate"
                  value={currentItem.rate}
                  onChange={handleEditChange}
                  
                />
              </div>
              <div className="flex gap-4 items-center">
                <label className="font-medium text-nowrap">Quantity :</label>
                <Input
                  type="text"
                  name="qty"
                  value={currentItem.qty}
                  onChange={handleEditChange}
                  
                />
              </div>
              <div className="flex gap-4 items-center">
                <label className="font-medium text-nowrap">Amount :</label>
                <Input
                  type="text"
                  name="amount"
                  value={currentItem.amount}
                  onChange={handleEditChange}
                  
                />
              </div>
             
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleEditSubmit}
                className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded bg-yellow-500 px-4 py-2 font-semibold text-white hover:bg-yellow-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTable;
