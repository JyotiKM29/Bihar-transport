"use client";
import React, { useContext, useEffect, useState } from "react";
import FieldForm from "../component/FieldForm";
import { Button } from "../../components/ui/button";
import SearchItem from './SearchItem';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { UserContext } from "../../context/UserContextProvider";
import Link from "next/link";

const MaterialInfo = ({ form, nameValue }) => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading , setLoading] = useState(true);

  const { user } = useContext(UserContext);

  const [data, setData] = useState(null);
  const userId = user?._id;

  function calPartyBhara() {
    const totalAmount = items.reduce((acc, item) => acc + parseFloat(item.amount), 0);
    console.log(totalAmount);
    form.setValue("partyBhara", totalAmount);
    return totalAmount;
  }
  
  
  
  function calAmount(rate, quantity, GSTPercentage = 0) {
    
    const amount = parseFloat(rate) * parseFloat(quantity);
    form.setValue(`${nameValue}[${items.length}].basicAmount`,amount);
    const total = parseFloat(amount) * Number(GSTPercentage);
    return parseFloat(amount + total);
  }

  const quantity = form.watch(`${nameValue}[${items.length}].quantity`);
  const rate = form.watch(`${nameValue}[${items.length}].rate`);
  const GSTPercentage = form.watch(`${nameValue}[${items.length}].GSTPercentage`);

  useEffect(() => {
    if (!isNaN(parseFloat(rate)) && !isNaN(parseFloat(quantity))) {
      let result = calAmount(rate, quantity, GSTPercentage);

      form.setValue(`${nameValue}[${items.length}].amount`, result);
    }
   calPartyBhara() ;

  }, [rate, quantity, items.length, nameValue, GSTPercentage]);


  useEffect(()=>{
   const fetchUnits = async() =>{
    try {
      if (userId) {
        const response = await fetch(`/api/getunits/${userId}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        setLoading(false);
      
        setData(data.data);
        console.log(data);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
   }
   fetchUnits();
  },[userId])
 

  function handleAdditionalItem() {
    const newItem = {
      material: form.getValues(`${nameValue}[${items.length}].material`),
      hsnNo: form.getValues(`${nameValue}[${items.length}].hsnNo`),
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
      GSTPercentage: form.getValues(`${nameValue}[${items.length}].GSTPercentage`),
      GSTType: form.getValues(`${nameValue}[${items.length}].GSTType`),
      amount: form.getValues(`${nameValue}[${items.length}].amount`),
      basicAmount: form.getValues(`${nameValue}[${items.length}].basicAmount`),
      
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
      <div className="flex items-center gap-3  w-full my-2">
        <Button
          type="button"
          variant="secondary"
          className='flex-1 text-red-400 bg-red-100 border-2 border-red-200 hover:bg-red-200 hover:text-red-500 '
          onClick={() => {
            setItems([]);
            form.setValue(nameValue, []);
            setShowForm(false);
          }}
        >
          Delete all Material
        </Button>
        <Button
          type="button"
          className='flex-1  text-green-500 bg-green-100 border-2 border-green-200 hover:bg-green-200 hover:text-green-700 '
          onClick={() => setShowForm(!showForm)}
          variant="secondary"
        >
         {showForm ? "Close" : "Add Item "}
        </Button>
      </div>

     

      {/* Form */}
      <div>
        {showForm && (
          <>
          <p>Fill in the details below:</p>
          <div className="flex items-center">
          <div className="flex-1">
       
             <FormField
                control={form.control}
                name={`${nameValue}[${items.length}].material`}
                
                render={({ field }) => (
                  <SearchItem
                 
                  nameValue={nameValue}
                  items={items}
                    form={form}
                    field={field}
                    label="Material Name"
                  />
                )}
              /> 
          </div>
         
            <Link href='/admin/booking/addproduct' className="flex justify-center items-center border bg-gray-100 text-xl h-10 rounded w-10">+</Link>
          </div>
           
            {/* <FieldForm
              form={form}
              name={`${nameValue}[${items.length}].hsnNo`}
              label="HSN No"
              type="text"
            /> */}
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
                      <FormItem className="flex-1 flex items-center justify-center ">
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                            <select
                              {...field}
                              className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                            >
                            <option value=""> Quantity Unity</option>
                         {Array.isArray(data) && data.map((unit) => (
  <option key={unit.name} value={unit.name}>
    {unit.name}
  </option>
))}
                              {/* <option value=""> Quantity Unity</option>
                              <option value="Kg">Kg (Kilo gram)</option>
                              <option value="g">g (gram) </option>
                              <option value="Km">Km (Kilo meter)</option>
                              <option value="Km2">Km&sup2;</option>
                              <option value="m">m </option>
                              <option value="m2">m&sup2;</option>
                              <option value="tons">tons</option>
                              <option value="pounds">pounds</option>
                              <option value="L">L (liters)</option>
                              <option value="m3">m³</option> */}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />
                 <Link href='/admin/settings/newunit' className="flex justify-center items-center border bg-gray-100 text-xl h-10 rounded w-10">+</Link>
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
                      <FormItem className="flex-1 flex items-center justify-center ">
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
                      <FormItem className="flex-1 flex items-center justify-center gap-4">
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
                      <FormItem className="flex-1 flex items-center justify-center gap-4">
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
                      <FormItem className=" flex-1 flex items-center justify-center gap-4">
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
               
                name={`${nameValue}[${items.length}].GSTPercentage`}
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        GST Percentage:
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
              <FormField
                control={form.control}
               
                name={`${nameValue}[${items.length}].GSTType`}
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        GST Type:
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <select {...field}>
                            <option value="">Select GST Type</option>
                            <option value="RCM">RCM</option>
                            <option value="FCM">FCM</option>
                            
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
                className=' w-full  text-blue-500 bg-blue-100 border-2 border-blue-200 hover:bg-blue-200 hover:text-blue-700 '
              type="button"
              variant="secondary"
              onClick={handleAdditionalItem}
            >
             Add Material
            </Button>
          
          </>
        )}
      </div>
    </div>
  );
};

export default MaterialInfo;




