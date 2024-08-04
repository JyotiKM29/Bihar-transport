"use client";
import React, { useEffect, useState, useContext } from "react";
import { ShoppingCart } from "lucide-react";
import { UserContext } from "../../context/UserContextProvider";
import { useToast } from "../../components/ui/use-toast";

const CartTable = ({ form, items, onDelete, onEdit, nameValue }) => {
  const [cartItems, setCartItems] = useState(items);
  const [noOfItems, setNoOfItems] = useState(0);
  const [totalCost, setTotalCost] = useState(0.0);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [rateAsPerData, setRateAsPerData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(UserContext);
  const { toast } = useToast();

  const userId = user?._id;

  useEffect(() => {
    setCartItems(items);
    setNoOfItems(items.length || 0);

    const calculatedTotalCost = items.reduce((accumulator, currentValue) => {
      return parseFloat(accumulator) + parseFloat(currentValue.amount);
    }, 0);

    setTotalCost(calculatedTotalCost);
    form.setValue("partyBhara", calculatedTotalCost);
  }, [items, cartItems]);

  useEffect(() => {
    fetchRateAsPer();
  }, []);

  const fetchRateAsPer = async () => {
    try {
      const response = await fetch(`/api/setting/rateAsPer/get/${userId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setRateAsPerData(data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditClick = (index) => {
    setIsEditing(true);
    setCurrentIndex(index);
    setCurrentItem(cartItems[index]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prevItem) => {
      const updatedItem = {
        ...prevItem,
        [name]: value,
      };

      if (
        [
          "rate",
          "actualWeight",
          "GSTPercentage",
          "chargedWeight",
          "rateAsPer",
          "amount",
          "testAmount",
        ].includes(name)
      ) {
        const rateAsPer = updatedItem.rateAsPer;
        const rate = parseFloat(updatedItem.rate) || 0;
        const actualWeight = parseFloat(updatedItem.actualWeight) || 0;
        const GSTPercentage = parseFloat(updatedItem.GSTPercentage) || 0;
        const chargedWeight = parseFloat(updatedItem.chargedWeight) || 0;
        const testAmount = parseFloat(updatedItem.testAmount) || 0;

        let basicAmount;

        if (rateAsPer === "fixed") {
          basicAmount = testAmount;
        }

        if (rateAsPer === "actualWeight") {
          basicAmount = actualWeight * rate;
        }

        if (rateAsPer === "chargedWeight") {
          basicAmount = chargedWeight * rate;
        }

        let amount = basicAmount + basicAmount * GSTPercentage;
        const total = amount;

        return {
          ...updatedItem,
          basicAmount: basicAmount.toFixed(2),
          amount: amount.toFixed(2),
          total: total.toFixed(2),
        };
      }

      return updatedItem;
    });
  };

  const handleEditSubmit = () => {
    if (currentIndex !== null) {
      onEdit(currentIndex, currentItem);
      setIsEditing(false);
      setCurrentItem(null);
      setCurrentIndex(null);
      setSearchTerm("");
    }
  };

  const fetchData = async (value) => {
    try {
      const res = await fetch(`/api/getProduct/${user._id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();

      if (result && Array.isArray(result.data)) {
        const results = result.data.filter((item) => {
          return (
            value &&
            item.name &&
            item.name.toLowerCase().includes(value.toLowerCase())
          );
        });

        setSearchResults(results.slice(0, 5));
      }
    } catch (error) {
      console.log("Fetch failed", error);
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    fetchData(value);
  };

  const handleSearchResultClick = (result) => {
    setCurrentItem((prevItem) => ({
      ...prevItem,
      material: result.name,
      hsnNo: result.hsnNo,
      quantityUnit:result.qtyUnit? result.qtyUnit : result.weightType,
      actualWeightUnit:result.weightType? result.weightType : result.qtyUnit,
      chargedWeightUnit: result.weightType? result.weightType : resultqtyUnit, 
    }));
    setSearchResults([]);
    setSearchTerm(result.name);
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
              <th className="text-nowrap pr-3 font-medium">Rate As Per</th>
              <th className="text-nowrap pr-3 font-medium">Basic Amount</th>
              <th className="text-nowrap pr-3 font-medium">GSTPercentage</th>
              <th className="text-nowrap pr-3 font-medium">Amount</th>
              <th className="text-nowrap pr-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, i) => (
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
                <td>{item.rate}</td>
                <td>
                  {item.rateAsPer}({item.rateUnit})
                </td>
                <td>{item.basicAmount}</td>
                <td>
                  {item.GSTPercentage
                    ? `${item.GSTPercentage * 100} % ${item.GSTType}`
                    : "0%"}
                </td>
                <td>{item.amount}</td>
                <td>
                  <button
                    type="button"
                    className="font-bold"
                    onClick={() => handleEditClick(i)}
                  >
                    Edit
                  </button>{" "}
                  /
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
            <h3 className="mb-4 text-lg font-semibold">Edit Materials</h3>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label>Material Name</label>
                <input
                  type="text"
                  name="material"
                  value={isEditing ? searchTerm : currentItem?.material || ""}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setIsEditing(true)}
                  // onBlur={() => setIsEditing(false)}
                  className="w-full rounded border p-2"
                />
                {searchResults.length > 0 && (
                  <div className="search-results mt-1 rounded border shadow-lg">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        onClick={() => handleSearchResultClick(result)}
                        className="cursor-pointer p-2 hover:bg-gray-200"
                      >
                        {result.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label>HSN</label>
                <input
                  type="text"
                  name="hsnNo"
                  value={currentItem?.hsnNo || ""}
                  readOnly
                  className="w-full rounded border bg-gray-100 p-2"
                />
              </div>

              <div>
                <label>Quantity</label>
                <input
                  type="text"
                  name="quantity"
                  value={currentItem?.quantity || ""}
                  onChange={handleEditChange}
                  className="w-full rounded border p-2"
                />
              </div>

              <div>
                <label>Actual Weight</label>
                <input
                  type="text"
                  name="actualWeight"
                  value={currentItem?.actualWeight || ""}
                  onChange={handleEditChange}
                  className="w-full rounded border p-2"
                />
              </div>

              <div>
                <label>Charged Weight</label>
                <input
                  type="text"
                  name="chargedWeight"
                  value={currentItem?.chargedWeight || ""}
                  onChange={handleEditChange}
                  className="w-full rounded border p-2"
                />
              </div>

              <div>
                <label>Rate As Per</label>
                <select
                  name="rateAsPer"
                  value={currentItem?.rateAsPer || ""}
                  onChange={handleEditChange}
                  className="w-full rounded border p-2"
                >
                  <option value="">
                    {rateAsPerData.length > 0
                      ? "Select Rate As Per"
                      : "Loading..."}
                  </option>
                  {rateAsPerData.map((rate) => (
                    <option key={rate.value} value={rate.value}>
                      {rate.name}
                    </option>
                  ))}
                </select>
              </div>

              {currentItem?.rateAsPer === "fixed" && (
                <div>
                  <label>Amount</label>
                  <input
                    type="number"
                    name="testAmount"
                    value={currentItem?.testAmount || ""}
                    onChange={handleEditChange}
                    className="w-full rounded border p-2"
                  />
                </div>
              )}

              <div>
                <label>Rate</label>
                <input
                  type="text"
                  name="rate"
                  value={currentItem?.rate || ""}
                  onChange={handleEditChange}
                  className="w-full rounded border p-2"
                />
              </div>

              <div>
                <label>GSTPercentage</label>
                <select
                  name="GSTPercentage"
                  value={currentItem?.GSTPercentage || "0.0"}
                  onChange={handleEditChange}
                  className="w-full rounded border p-2"
                >
                  <option value="0.0">0%</option>
                  <option value="0.02">2%</option>
                  <option value="0.05">5%</option>
                  <option value="0.08">8%</option>
                  <option value="0.12">12%</option>
                  <option value="0.18">18%</option>
                </select>
              </div>

              <div className="col-span-2">
                <label>Total</label>
                <input
                  type="text"
                  name="total"
                  value={currentItem?.total || ""}
                  readOnly
                  className="w-full rounded border bg-gray-100 p-2"
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
