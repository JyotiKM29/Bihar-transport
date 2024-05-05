"use client";
import React, { useEffect, useState } from "react";
import FieldForm from "../component/FieldForm";
import { Button } from "../../components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "../../components/ui/form";

const AdditionalChargers = ({ form, nameValue ,items }) => {
  const [charges, setCharges] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [cartItems, setCartItems] = useState(items);
  const [noOfItems , setNoOfItems] = useState(0);
  const [totalCost , setTotalCost] = useState(0.0) ;

  useEffect(() => {
    setCartItems(items); 
    let length = Array.isArray(items) && items.length ? items.length : 0;
    setNoOfItems(length)
    
  
// Calculate total cost using cartItems directly
const calculatedTotalCost = Array.isArray(charges) ? charges.reduce((accumulator, currentValue) => {
  return accumulator + currentValue.amount;
}, 0) : 0 ;

// Set the total cost
setTotalCost(calculatedTotalCost);

    },  [items, charges]); 

  const handleDelete = (idToRemove) => {
    const updatedItems = cartItems.filter((item, index) => index !== idToRemove);
    setCartItems(updatedItems);
  };

 

  function calTotalCharge(charges) {
    // const totalAmount = charges.reduce((acc, item) => acc + parseFloat(item.amount), 0);
    // console.log(totalAmount);

    if(charges.length > 0){
    
    console.log('additional charge' , charges[charges.length - 1]?.amount)
    form.setValue("additionalCharges.totalCharge", charges[charges.length - 1]?.amount);
    }
    // const PartyBhara = form.getValues("partyBhara");

    // const total = Number(PartyBhara) + Number(charges[charges.length - 1]?.amount);
    // const total = Number(PartyBhara);
    const prevtotalAdditionalCharges = form.getValues("totalAdditionalCharges") ? form.getValues("totalAdditionalCharges")  : 0 ;

    let additionalChargerTotal = charges.length === 0  ? 0 : prevtotalAdditionalCharges + charges[charges.length - 1]?.amount;
   
    form.setValue('totalAdditionalCharges',additionalChargerTotal );
   
    // form.setValue("partyBhara", total)


   
  }

  
 

  

  const rate = form.watch(`${nameValue}[${charges.length}].rate`);
  const qty = form.watch(`${nameValue}[${charges.length}].qty`);




  useEffect(() => {
    if (rate && qty) {
      const result = Number(rate) * Number(qty);
      form.setValue(`${nameValue}[${charges.length}].amount`, result);
    }
    
  }, [rate, qty, charges.length, nameValue]);

  useEffect(()=>{
    calTotalCharge(charges);
  
  },[charges,charges.length ])




  function handleAdditionalCharge() {
    const newCharge = {
        name: form.getValues(`${nameValue}[${charges.length}].name`),
        qty: form.getValues(`${nameValue}[${charges.length}].qty`),
      rate: form.getValues(`${nameValue}[${charges.length}].rate`),
      amount: form.getValues(`${nameValue}[${charges.length}].amount`),
     
    };
    
    setCharges([...charges, newCharge]);
    form.setValue("additionalCharges.chargers",[...charges, newCharge] )
    setShowForm(false);
  }

  return (
    <div>
      
      <h2 className="font-semibold text-xl ">Additional Charges :</h2>
      {/* Close and Reset button */}
      <div className="flex flex-col xl:flex-row xl:items-center gap-3 w-full my-2">
        <Button
          type="button"
          variant="secondary"
          
          className='flex-1 text-red-400 bg-red-100 border-2 border-red-200 hover:bg-red-200 hover:text-red-500 '
          onClick={(e) => {
            e.stopPropagation();
            setShowForm(false);
            setCharges([]);
            form.setValue(nameValue, []);
          }}
        >
         Delete All Additional Charge
        </Button>
        <Button
          type="button"
          className='flex-1  text-green-500 bg-green-100 border-2 border-green-200 hover:bg-green-200 hover:text-green-700 '
          onClick={() => setShowForm(!showForm)}
          variant="secondary"
        >
          {showForm ? "Close Additional form":"Enter Additional Charge"}
        </Button>
      </div>

      {/* Table display */}
      <div>
        { (
          <table className="mx-2 my-4 w-full border">
            <thead>
              <tr className="w-full border bg-slate-50">
                <th className="font-medium pr-3 text-nowrap ">Charges Name</th>
                <th className="font-medium pr-3 text-nowrap ">Qty</th>
                <th className="font-medium pr-3 text-nowrap ">Rate</th>
                <th className="font-medium pr-3 text-nowrap ">Amount</th>
                <th className="font-medium pr-3 text-nowrap ">Action</th>
              </tr>
            </thead>
            <tbody>
              {charges.map((items, i) => (
                <tr key={i} className="w-full text-center">
                  <td>{items.name}</td>
                  <td>{items.qty}</td>
                  <td>{items.rate}</td>
                  <td>{items.amount}</td>  
                  <td>
                  <button  className="font-bold " >Edit</button> / <button className="font-bold " onClick={() => handleDelete(i)}>Delete</button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className='flex justify-end'>
        <p className='w-max'>Total Additional Charge: <span className='bg-green-200 ml-2 border border-green-400 rounded px-4 py-1 '> &#8377; {totalCost.toFixed(2)}  </span></p>
        </div>

      {/* Form */}
      <div>
        {showForm && (
          <>
          <p>Fill in the details below:</p>
           
             <FormField
                control={form.control}
               
                name={`${nameValue}[${charges.length}].name`}
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Charge:
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <select {...field}>
                          <option value="Select Charges">Select Charges</option>
                        <option value="Detention Charge">
                          Detention Charge
                        </option>
                        <option value="Pickup Charge">Pickup Charge</option>
                        <option value="Packing Charge">Packing Charge</option>
                        <option value="loading Charge">loading Charge</option>
                        <option value="unloading Charge">
                          unloading Charge
                        </option>
                        <option value="Other Charge">Other Charge</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
            <FieldForm
              form={form}
              name={`${nameValue}[${charges.length}].qty`}
              label="Qty"
              type="number"
            />
            <FieldForm
              form={form}
              name={`${nameValue}[${charges.length}].rate`}
              label="Rate"
              type="text"
            />
            <FieldForm
              form={form}
              name={`${nameValue}[${charges.length}].amount`}
              label="Amount"
              type="number"
            />
           
        
            <Button
              className='flex-1 w-full  text-blue-500 bg-blue-100 border-2 border-blue-200 hover:bg-blue-200 hover:text-blue-700 '
              type="button"
              variant="secondary"
              onClick={handleAdditionalCharge}
            >
              Add Additional Charges
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdditionalChargers;
