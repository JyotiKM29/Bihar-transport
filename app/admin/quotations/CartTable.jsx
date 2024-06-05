import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "../../components/ui/button";

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
              <th className="text-nowrap pr-3 font-medium">Product Name</th>
              <th className="text-nowrap pr-3 font-medium">Item Size</th>
              <th className="text-nowrap pr-3 font-medium">Item Weight</th>
              <th className="text-nowrap pr-3 font-medium">ETA</th>
              <th className="text-nowrap pr-3 font-medium">Rate</th>
              <th className="text-nowrap pr-3 font-medium">Rate As Per</th>
              <th className="text-nowrap pr-3 font-medium">Advance</th>
              <th className="text-nowrap pr-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item, i) => (
              <tr key={i} className="w-full text-center">
                <td>{item.productName}</td>
                <td>{item.itemSize}</td>
                <td>{item.itemWeight}</td>
                <td>{item.ETA}</td>
                <td>{item.rate}</td>
                <td>{item.rateAsPer}</td>
                <td>{item.Advance}</td>
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
          <div className="edit-form">
            <h3 className="mb-4 text-lg font-semibold">Edit Product</h3>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label>Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={currentItem.productName}
                  onChange={handleEditChange}
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label>Item Size</label>
                <input
                  type="text"
                  name="itemSize"
                  value={currentItem.itemSize}
                  onChange={handleEditChange}
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label>Item Weight</label>
                <input
                  type="text"
                  name="itemWeight"
                  value={currentItem.itemWeight}
                  onChange={handleEditChange}
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label>ETA</label>
                <input
                  type="text"
                  name="ETA"
                  value={currentItem.ETA}
                  onChange={handleEditChange}
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label>Rate</label>
                <input
                  type="number"
                  name="rate"
                  value={currentItem.rate}
                  onChange={handleEditChange}
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label>Rate As Per</label>
                <input
                  type="text"
                  name="rateAsPer"
                  value={currentItem.rateAsPer}
                  onChange={handleEditChange}
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label>Advance</label>
                <input
                  type="number"
                  name="Advance"
                  value={currentItem.Advance}
                  onChange={handleEditChange}
                  className="w-full rounded border p-2"
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
