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
import { Input } from "../../components/ui/input";

const MaterialInfo = ({ form, nameValue }) => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);

  function calPartyBhara() {
    const totalAmount = items.reduce((acc, item) => acc + parseFloat(item.amount), 0);
    console.log(totalAmount);
    form.setValue("partyBhara", totalAmount);
    return totalAmount;
  }
  
  
  
  function calAmount(rate, quantity, taxPercentage = 0) {
    const amount = parseFloat(rate) * parseFloat(quantity);
    const total = parseFloat(amount) * Number(taxPercentage);
    return parseFloat(amount + total);
  }

  const quantity = form.watch(`${nameValue}[${items.length}].quantity`);
  const rate = form.watch(`${nameValue}[${items.length}].rate`);
  const taxPercentage = form.watch(`${nameValue}[${items.length}].taxPercentage`);

  useEffect(() => {
    if (!isNaN(parseFloat(rate)) && !isNaN(parseFloat(quantity))) {
      let result = calAmount(rate, quantity, taxPercentage);
      form.setValue(`${nameValue}[${items.length}].amount`, result);
    }
   calPartyBhara() ;

  }, [rate, quantity, items.length, nameValue, taxPercentage]);
 

  function handleAdditionalItem() {
    const newItem = {
      material: form.getValues(`${nameValue}[${items.length}].material`),
      quantity: form.getValues(`${nameValue}[${items.length}].quantity`),
      quantityUnit: form.getValues(`${nameValue}[${items.length}].quantityUnit`),
      actualWeight: form.getValues(`${nameValue}[${items.length}].actualWeight`),
      actualWeightUnit: form.getValues(`${nameValue}[${items.length}].actualWeightUnit`),
      chargedWeight: form.getValues(`${nameValue}[${items.length}].chargedWeight`),
      chargedWeightUnit: form.getValues(`${nameValue}[${items.length}].chargedWeightUnit`),
      rateAsPer: form.getValues(`${nameValue}[${items.length}].rateAsPer`),
      rateAsPerOption: form.getValues(`${nameValue}[${items.length}].rateAsPerOption`),
      rate: form.getValues(`${nameValue}[${items.length}].rate`),
      rateUnit: form.getValues(`${nameValue}[${items.length}].rateUnit`),
      taxPercentage: form.getValues(`${nameValue}[${items.length}].taxPercentage`),
      amount: form.getValues(`${nameValue}[${items.length}].amount`),
    };

    console.log(newItem);

    setItems([...items, newItem]);
    form.setValue(nameValue ,[...items, newItem] )
    setShowForm(false);
  }

  return (
    <div>
      
      <h2 className="font-semibold text-xl "> Add Materials :</h2>
      {/* Close and Reset button */}
      <div className="flex items-center gap-3 max-w-md w-full">
        <Button
          type="button"
          variant="secondary"
          className='flex-1'
          onClick={() => {
            setItems([]);
            form.setValue(nameValue, []);
          }}
        >
          Delete All
        </Button>
        <Button
          type="button"
          className='flex-1'
          onClick={() => setShowForm(!showForm)}
          variant="secondary"
        >
         Add Item 
        </Button>
      </div>

      {/* Table display */}
      <div>
        {items && items.length > 0 && (
          <table className="mx-2 my-4 w-full border">
            <thead>
              <tr className="w-full border bg-slate-50">
                <th>Material Name</th>
                <th>Qty</th>
                <th>Actual Wt</th>
                {/* <th>chargedWeight</th> */}
                {/* <th>rateAsPer</th> */}
                {/* <th>rate</th> */}
                <th>Tax</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((items, i) => (
                <tr key={i} className="w-full text-center">
                  <td>{items.material}</td>
                  <td>{items.quantity} {items.quantityUnit}</td>
                  <td>{items.actualWeight}{items.actualWeightUnit} </td>
                  {/* <td>{items.chargedWeight}{items.chargedWeightUnit}</td> */}
                  {/* <td>{items.rateAsPer}({items.rateAsPerOption})</td> */}
                  {/* <td>{items.rate}({items.rateUnit})</td> */}
                  <td>{items.taxPercentage}</td>
                  <td>{items.amount}</td>
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
            <FieldForm
              form={form}
              name={`${nameValue}[${items.length}].material`}
              label="Material Name"
              type="text"
            />
               <div className="flex w-full items-center gap-0">
                <FormField
                  control={form.control}
                  name={`${nameValue}[${items.length}].quantity`}
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center gap-4">
                        <FormLabel className="text-nowrap text-sm lg:text-base">
                          Quantity :
                        </FormLabel>
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              className="rounded-bl rounded-br-[0px] rounded-tl rounded-tr-[0px]"
                            />
                          </FormControl>

                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name={`${nameValue}[${items.length}].quantityUnit`}
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center ">
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                            <select
                              {...field}
                              className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                            >
                              <option value=""> Quantity Unity</option>
                              <option value="Kg">Kg (Kilo gram)</option>
                              <option value="g">g (gram) </option>
                              <option value="Km">Km (Kilo meter)</option>
                              <option value="Km2">Km&sup2;</option>
                              <option value="m">m </option>
                              <option value="m2">m&sup2;</option>
                              <option value="tons">tons</option>
                              <option value="pounds">pounds</option>
                              <option value="L">L (liters)</option>
                              <option value="m3">m³</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />
              </div>
               <div className="flex w-full items-center gap-0">
                <FormField
                  control={form.control}
                  name={`${nameValue}[${items.length}].actualWeight`}
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center gap-4">
                        <FormLabel className="text-nowrap text-sm lg:text-base">
                          Actual Weight :
                        </FormLabel>
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              className="rounded-bl rounded-br-[0px] rounded-tl rounded-tr-[0px]"
                            />
                          </FormControl>

                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name={`${nameValue}[${items.length}].actualWeightUnit`}
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center ">
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                            <select
                              {...field}
                              className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                            >
                              <option value=""> Select Actual Weight Unit</option>
                              <option value="Kg">Kg (Kilo gram)</option>
                              <option value="g">g (gram) </option>
                              <option value="Ton">Ton</option>
                              <option value="Quintals">Quintals</option>
                              <option value="Dozen">Dozen </option>
                              <option value="Box">Box</option>
                              <option value="Bundles">Bundles</option>
                              <option value="pounds">pounds</option>
                             
                            </select>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />
              </div>
               <div className="flex w-full items-center gap-0">
                <FormField
                  control={form.control}
                  name={`${nameValue}[${items.length}].chargedWeight`}
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center gap-4">
                        <FormLabel className="text-nowrap text-sm lg:text-base">
                          Charged Weight :
                        </FormLabel>
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              className="rounded-bl rounded-br-[0px] rounded-tl rounded-tr-[0px]"
                            />
                          </FormControl>

                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name={`${nameValue}[${items.length}].chargedWeightUnit`}
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center ">
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                            <select
                              {...field}
                              className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                            >
                             <option value=""> Select Charged Weight Unit</option>
                              <option value="Kg">Kg (Kilo gram)</option>
                              <option value="g">g (gram) </option>
                              <option value="Ton">Ton</option>
                              <option value="Quintals">Quintals</option>
                              <option value="Dozen">Dozen </option>
                              <option value="Box">Box</option>
                              <option value="Bundles">Bundles</option>
                              <option value="pounds">pounds</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />
              </div>
               <div className="flex w-full items-center gap-0">
                <FormField
                  control={form.control}
                  name={`${nameValue}[${items.length}].rateAsPer`}
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center gap-4">
                        <FormLabel className="text-nowrap text-sm lg:text-base">
                         Rate as Per :
                        </FormLabel>
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                          <select
                              {...field}
                              className="rounded-bl rounded-br-[0px] rounded-tl rounded-tr-[0px]"
                            >
                              <option value=""> Select Rate as Rate</option>
                              <option value="Weight">Weight</option>
                              <option value="Quantity">Quantity</option>
                              <option value="Distance">Distance</option>
                             
                            </select>
                          </FormControl>

                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name={`${nameValue}[${items.length}].rateAsPerOption`}
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center ">
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                            <select
                              {...field}
                              className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                            >
                              <option value=""> Select Rate as Rate By</option>
                              <option value="Fixed">Fixed</option>
                              <option value="Trip">Trip</option>
                             
                            </select>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />
              </div>
               <div className="flex w-full items-center gap-0">
                <FormField
                  control={form.control}
                  name={`${nameValue}[${items.length}].rate`}
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center gap-4">
                        <FormLabel className="text-nowrap text-sm lg:text-base">
                          Rate :
                        </FormLabel>
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              className="rounded-bl rounded-br-[0px] rounded-tl rounded-tr-[0px]"
                            />
                          </FormControl>

                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name={`${nameValue}[${items.length}].rateUnit`}
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center ">
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                          <select
                              {...field}
                              className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                            >
                             <option value=""> Select Rate Unit</option>
                              <option value="Kg">Kg (Kilo gram)</option>
                              <option value="g">g (gram) </option>
                              <option value="Ton">Ton</option>
                              <option value="Quintals">Quintals</option>
                              <option value="Dozen">Dozen </option>
                              <option value="Box">Box</option>
                              <option value="Bundles">Bundles</option>
                              <option value="pounds">pounds</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />
              </div>
          
              <FormField
                control={form.control}
               
                name={`${nameValue}[${items.length}].taxPercentage`}
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Tax Percentage:
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <select {...field}>
                            <option value="">Select Tax Percentage</option>
                            <option value="0.0">0%</option>
                            <option value="0.02">2%</option>
                            <option value="0.05 ">5%</option>
                            <option value="0.08 ">8%</option>
                            <option value="0.12 ">12%</option>
                            <option value="0.18">18%</option>
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
              name={`${nameValue}[${items.length}].amount`}
              label="Amount"
              type="text"
            />
            <Button
              className='flex-1 max-w-md w-full'
              type="button"
              variant="secondary"
              onClick={handleAdditionalItem}
            >
             ADD
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default MaterialInfo;
