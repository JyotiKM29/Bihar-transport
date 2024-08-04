"use client";
import React, { useEffect, useState, useContext } from "react";
import { ShoppingCart } from "lucide-react";
import { UserContext } from "../../context/UserContextProvider";


const CartTable = ({ form, items, onDelete, onEdit }) => {
  const [cartItems, setCartItems] = useState(items);
  const [noOfItems, setNoOfItems] = useState(0);
  const [totalCost, setTotalCost] = useState(0.0);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [rateAsPerData, setRateAsPerData] = useState([]);
  const [ok, setOk] = useState(true);
    const { user } = useContext(UserContext);

 
  const userId = user?._id;

  useEffect(() => {
   
    setCartItems(items);
    const length = Array.isArray(cartItems) && cartItems.length ? cartItems.length : 0;
    setNoOfItems(length);

    const calculatedTotalCost = Array.isArray(items)
      ? items.reduce((accumulator, currentValue) => {
          return parseFloat(accumulator) + parseFloat(currentValue.amount);
        }, 0)
      : 0;

    setTotalCost(calculatedTotalCost);

    form.setValue("partyBhara", calculatedTotalCost);
    // console.log("partyBhara Jyoti KM", form.getValues("partyBhara"));
  }, [items, cartItems]);

  useEffect(()=>{
    // console.log("it's started...");
   fetchRateAsPer();
},[]);


  const fetchRateAsPer = async () => {
     // Fetch units data from API
    //  console.log("it's workiing now...")
     try {
       const response = await fetch(`/api/setting/rateAsPer/get/${userId}`, {
         method: "GET",
       });

       if (!response.ok) {
         throw new Error(`HTTP error! Status: ${response.status}`);
       }

       const data = await response.json();
      //  console.log("rate as per data:", data.data);
       setRateAsPerData(data.data);
     } catch (error) {
       console.error("Error:", error);
     }
   };


  const handleEditClick = (item) => {
    setIsEditing(true);
    setCurrentItem(item);
  };

  const handleFixedAmountChange = (e) => {
  const { value } = e.target;
  setOk(~ok);

  setCurrentItem((prevItem) => ({
    ...prevItem,
    basicAmount: value,
  }));
};




// useEffect(() => {
//   // Call your function here
//   handleEditChange(); // Assuming handleEditChange is defined within the same component
// }, [ok]); // This effect will be triggered whenever currentItem changes



  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prevItem) => {
      const updatedItem = {
        ...prevItem,
        [name]: value,
      };

      if (["rate", "actualWeight", "GSTPercentage", "chargedWeight", "rateAsPer", "amount", "testAmount"].includes(name)) {
        const rateAsPer = updatedItem.rateAsPer;
        const rate = parseFloat(updatedItem.rate) || 0;
        const actualWeight = parseFloat(updatedItem.actualWeight) || 0;
        const GSTPercentage = parseFloat(updatedItem.GSTPercentage) || 0;
        const chargedWeight = parseFloat(updatedItem.chargedWeight) || 0;
        const testAmount = parseFloat(updatedItem.testAmount) || 0;
        


        // console.log("test AMount : ", testAmount)
        // console.log("actual weight ", actualWeight);
        // console.log("chargedWeight : ", chargedWeight);
        // console.log("rate: ", rate);
        // console.log("rate as per : ", rateAsPer);
        // console.log("updated item : ", updatedItem);
        // console.log("ok, checking multiplier: ", updatedItem.rateAsPer);

        let basicAmount;

        if( rateAsPer === "fixed"){

         
          basicAmount = testAmount;


        }

        if(rateAsPer === "actualWeight"){

          basicAmount = (actualWeight*rate)

        }

        if(rateAsPer === "chargedWeight"){

           basicAmount = (chargedWeight*rate)
        }

        

        // const basicAmount = (`updatedItem.${rateAsPer}` * rate);
        let amount = basicAmount + basicAmount * (GSTPercentage);
        // const total = rate * actualWeight + (rate * actualWeight * GSTPercentage);
        // amount = total;
        const total = amount;

        // console.log("Total ", total);
        // console.log("basic amount : ", basicAmount);

        return {
          ...updatedItem,
          basicAmount: basicAmount.toFixed(2),
          amount: amount.toFixed(2),
          total: total.toFixed(2),
        };
      }

      return updatedItem;
    });

  }
  const handleEditSubmit = () => {
    onEdit(currentItem);
    setIsEditing(false);
    setCurrentItem(null);
  };

  return (
    <div className="w-full overflow-x-scroll px-4 py-2">
      <h2 className="flex gap-2 text-xl font-semibold">
        <ShoppingCart strokeWidth={2.5} /> Total Item in Cart <p>({noOfItems})</p>
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
                    {item.rate}
                  </td>
                  <td>
                    {item.rateAsPer}({item.rateUnit})
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
            <h3 className="mb-4 text-lg font-semibold">Edit Materials</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* <div>
                <label>Material</label>
                <input
                  type="text"
                  name="material"
                  value={currentItem.material}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
              </div> */}
              <div>
                <label>Quantity</label>
                <input
                  type="text"
                  name="quantity"
                  value={currentItem.quantity}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label>Actual Weight</label>
                <input
                  type="text"
                  name="actualWeight"
                  value={currentItem.actualWeight}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label>Charged Weight</label>
                <input
                  type="text"
                  name="chargedWeight"
                  value={currentItem.chargedWeight}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
              </div>

<div>
  <label>Rate As Per</label>
  <select
    name="rateAsPer"
    value={currentItem.rateAsPer}
    onChange={handleEditChange}
    className="w-full p-2 border rounded"
  >
    <option value="">
                {rateAsPerData && rateAsPerData.length > 0
                  ? "Select Rate As Per"
                  : "Loading..."}
              </option>
              {Array.isArray(rateAsPerData) &&
                rateAsPerData.map((rate) => (
                  <option key={rate.value} value={rate.value}>
                    {rate.name}
                  </option>
                ))}
            </select>
</div>

{/* <FormField
  control={form.control}
  name={`${nameValue}[${items.length}].rateAsPer`}
  render={({ field }) => {
    return (
      <FormItem className="flex flex-1 items-center justify-center gap-4">

<FormLabel className="text-nowrap text-sm lg:text-base">
                        Rate as Per :
                      </FormLabel>

        <div className="flex flex-1 flex-col">
          <FormControl>
            <select
              {...field}
              className="rounded-bl rounded-br-[0px] rounded-tl rounded-tr-[0px]"
            >
              <option value="">
                {rateAsPerData && rateAsPerData.length > 0
                  ? "Select Actual Weight Unit"
                  : "Loading..."}
              </option>
              {Array.isArray(rateAsPerData) &&
                rateAsPerData.map((rate) => (
                  <option key={rate.value} value={rate.value}>
                    {rate.name}
                  </option>
                ))}
            </select>
          </FormControl>
          <FormMessage />
        </div>
      </FormItem>
    );
  }}
/> */}






{currentItem.rateAsPer === "fixed" && (
  <div>
    <label>Amount</label>
    <input
      type="number"
      name="testAmount"
      
      onChange={handleEditChange}
      className="w-full p-2 border rounded"
    />
  </div>
)}




              <div>
                <label>Rate</label>
                <input
                  type="text"
                  name="rate"
                  value={currentItem.rate}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label>GSTPercentage</label>
                <select
                  name="GSTPercentage"
                  value={currentItem.GSTPercentage}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
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
                  value={currentItem.total}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleEditSubmit}
                className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 font-semibold text-white bg-yellow-500 rounded hover:bg-yellow-700"
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
