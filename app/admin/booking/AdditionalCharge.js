"use client";
import React, { useEffect, useState } from "react";
import FieldForm from "./FieldForm";
import { Button } from "../../components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "../../components/ui/form";

const AdditionalChargers = ({ form, nameValue }) => {
  const [charges, setCharges] = useState([]);
  const [showForm, setShowForm] = useState(false);
 

  function calTotalCharge(charges) {
    // const totalAmount = charges.reduce((acc, item) => acc + parseFloat(item.amount), 0);
    // console.log(totalAmount);

    if(charges.length > 0){
    
    console.log('additional charge' , charges[charges.length - 1]?.amount)
    form.setValue("additionalCharges.totalCharge", charges[charges.length - 1]?.amount);
    }
    const PartyBhara = form.getValues("partyBhara");

    const total = Number(PartyBhara) + Number(charges[charges.length - 1]?.amount);
   
    form.setValue("partyBhara", total)

    console.log('additional hi',form.getValues("additionalCharges.totalCharge"))
   
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
      
      <h2 className="font-semibold text-xl ">  Additional Chargers :</h2>
      {/* Close and Reset button */}
      <div className="flex items-center gap-3 max-w-md w-full">
        <Button
          type="button"
          variant="secondary"
          className='flex-1'
          onClick={(e) => {
            e.stopPropagation();

            setCharges([]);
            form.setValue(nameValue, []);
          }}
        >
          Reset Additional Charges
        </Button>
        <Button
          type="button"
          className='flex-1'
          onClick={() => setShowForm(!showForm)}
          variant="secondary"
        >
          Enter Additional Charge
        </Button>
      </div>

      {/* Table display */}
      <div>
        {charges && charges.length > 0 && (
          <table className="mx-2 my-4 w-full border">
            <thead>
              <tr className="w-full border bg-slate-50">
                <th>Charges Name</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
               
              </tr>
            </thead>
            <tbody>
              {charges.map((items, i) => (
                <tr key={i} className="w-full text-center">
                  <td>{items.name}</td>
                  <td>{items.qty}</td>
                  <td>{items.rate}</td>
                  <td>{items.amount}</td>  <td>{items.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
              type="number"
            />
            <FieldForm
              form={form}
              name={`${nameValue}[${charges.length}].amount`}
              label="Amount"
              type="number"
            />
           
            <Button
              className='flex-1 max-w-md w-full'
              type="button"
              variant="secondary"
              onClick={handleAdditionalCharge}
            >
              ADD
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdditionalChargers;
