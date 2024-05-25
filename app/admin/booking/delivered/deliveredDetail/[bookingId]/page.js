"use client";
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "../../../../../components/ui/form";
  import * as z from "zod";
  import { useState, useEffect, useContext } from "react";
  import { useToast } from "../../../../../components/ui/use-toast";
import { Button } from '@/app/components/ui/button';
import FieldForm from '@/app/admin/component/FieldForm';
import { UserContext } from '@/app/context/UserContextProvider';
import { set } from 'mongoose';

  const chargeScheme = z.object({
    chargeName:z.string(),
    days:z.string(),
    rate:z.coerce.number(),
    amount:z.coerce.number(),
    remarks:z.string(),
  })

  const companyChargeSchema = z.object({
    chargeList: z.array(chargeScheme),
    totalFreight: z.coerce.number(),
    ledgerBalance: z.coerce.number(),
  })

  const vehicleChargeSchema = z.object({
    chargeList: z.array(chargeScheme),
    totalFreight: z.coerce.number(),
    ledgerBalance: z.coerce.number(),
  })


  const formSchema = z.object({
    CN : z.string(),
    // consignor: z.string(),
    // consignee: z.string(),
    // paymentLiability: z.string(),
    // totalBillingAmmount:z.coerce.number(),
    // AmountReceived:z.coerce.number(),

    // //Additional Chargers
    // chargesCompany: companyChargeSchema,
    // chargesVehicle: vehicleChargeSchema,


    // //delivery Details
    // reportingDate:z.coerce.date(),
    // uploadingDate:z.coerce.date(),
    // materialReceivedBy: z.string(),
    // phoneNo: z.coerce.number(),
    // stamp: z.enum(["yes","no"]),
    // sign: z.enum(["yes","no"]),

    // //payment details
    // LRDuesAmt: z.coerce.number(),
    // paymentModes: z.string(),
    // amountReceived: z.coerce.number(),
    // fine: z.coerce.number(),
    // finalDue:  z.coerce.number(),
    // remarks:  z.string(),


    // //Consignment Information
    // date:z.coerce.date(),
    // deliveryNo:z.string(),
    // fromLocation:z.string(),
    // toLocation:z.string(),
    // qty:  z.coerce.number(),
    // weight:  z.coerce.number(),
    // breakage:  z.coerce.number(),
    // excess:  z.coerce.number(),
    // shortage:  z.coerce.number(),
    // remarks: z.string(),
    // POD: z.string(),
    // Action: z.string(),




  })

const DeliveryForm = ({params}) => {
    const initialFormState = {
        CN: undefined,
     }

     const { toast } = useToast();
     const [totalQty , setTotalQty] = useState();
     const [totalWeight , setTotalWeight] = useState();
     const [isEdit , setEdit] = useState(false);
     const [isloading, setIsLoading] = useState();
     const [loading , setLoading] = useState(false);
     const [data , setData] = useState();
     const [ledgerBalance , setLedgerBalance] = useState();
    const bookingId = params.bookingId;

    // console.log(bookingId);


     useEffect(() => {
      const fetchBooking = async () => {
      
        try {
        
            const response = await fetch(`/api/bookingdetails/${bookingId}`, {
              method: "GET",
            });
    
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
  
            setLoading(false);
          
            setData(data.booking);
            console.log("data" ,data)
          
        } catch (error) {
          setLoading(false);
          console.error("Error:", error);
        }
      };

      
    
      fetchBooking();
    }, []);

    const orderNumber = data?.orderNumber;

    useEffect(()=>{
      const fetchLedgerBalance = async() =>{
        try {
          if(orderNumber){
            const response = await fetch(`/api/accounting/getLedgerBalance/${orderNumber}`, {
              method: "GET",
            });
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            setLoading(false);
          
            setLedgerBalance(data.balance);
            // console.log("balance" ,ledgerBalance)
          }
         
  
          
        
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
          
        }
    }

    function calculate(){
      const materialData = data?.itemsList?.item;

      const totalQty = materialData?.reduce((total , item)=> {
        const quantity = parseFloat(item.quantity);
        return total + (isNaN(quantity)? 0 : quantity)
      }, 0);

      const totalWt = materialData?.reduce((total , item)=> {
        const wt = parseFloat(item.actualWeight);
        return total + (isNaN(wt)? 0 : wt)
      }, 0);
      setTotalQty(totalQty);
      setTotalWeight(totalWt);
      // console.log("quantity :",totalQty)
    }
    calculate();
    fetchLedgerBalance();
    },[orderNumber])

     const { reset, ...form } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialFormState,
      });

      async function MyHandleSubmit(value) {
        console.log("hey");
        console.log(value);
      }

    function handleTable (){
      setEdit(!isEdit)
      console.log("clicked")
    }

    function formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    }



  return (
    <div className="min-h-[90vh] w-full space-y-6">
     
      <div
        className="h-full w-full 
      space-y-2 rounded-2xl  bg-white px-4 py-4 
     shadow-sm md:px-6 xl:h-[95%]"
      >
       {/* <h1 className="hidden text-4xl font-semibold text-emerald-700 lg:block ">Delivery Details </h1> */}
        
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(MyHandleSubmit)}
        className="flex flex-col gap-5"
      >
      {/* details Show  */}
      <div className='bg-orange-100 min-h-10 text-orange-500 px-4 py-2 rounded grid grid-cols-2'>
      <div className='flex gap-8'>
      <h1 className='text-base  text-amber-600'>CN/LR No :</h1>
      <h1 className='text-base  text-amber-600 font-semibold'>CN/LR No</h1>
      </div>
      <div className='flex gap-8'>
      <h1 className='text-base  text-amber-600'>Payment Term :</h1>
      <h1 className='text-base  text-amber-600 font-semibold'>{data?.paymentTerm}</h1>
      </div>
      <div className='flex gap-8'>
      <h1 className='text-base  text-amber-600'>Consignor:</h1>
      <h1 className='text-base  text-amber-600 font-semibold'>{data?.consignorName}</h1>
      </div>
      <div className='flex gap-8'>
      <h1 className='text-base  text-amber-600'>Consignee :</h1>
      <h1 className='text-base  text-amber-600 font-semibold'>{data?.consigneeName}</h1>
      </div>
    
      <div className='flex gap-8'>
      <h1 className='text-base  text-amber-600'>Total Billing Amount :</h1>
      <h1 className='text-base  text-amber-600 font-semibold'>	&#8377; {data?.totalBillingAmount}</h1>
      </div>
      <div className='flex gap-8'>
      <h1 className='text-base  text-amber-600'>Amount Received :</h1>
      <h1 className='text-base  text-amber-600 font-semibold'>	&#8377; {data?.totalPaidAmount}</h1>
      </div>
      

      </div>

       {/* Additional rate table */}
      <div className='grid grid-cols-2 gap-8'>
      <div>
      <h2 className='bg-yellow-200 h-10 rounded text-center py-2 font-medium'>Additional Rate For Company</h2>
      <table className="mx-2 my-4 w-full border">
            <thead>
              <tr className="w-full border bg-slate-50">
                <th className="font-medium pr-3 text-nowrap border  ">Charges Name</th>
                <th className="font-medium pr-3 text-nowrap border  ">Qty</th>
                <th className="font-medium pr-3 text-nowrap border  ">Rate</th>
                <th className="font-medium pr-3 text-nowrap border  ">Amount</th>
                <th className="font-medium pr-3 text-nowrap  border ">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {data?.itemsList.item.map((items, i) => (
                <tr key={i} className="w-full text-center">
                  <td className='border'>{items.material}</td>
                  <td className='border'>{items.quantity}</td>
                  <td className='border'>{items.rate}</td>
                  <td className='border'>{items.basicAmount}</td>  
                  <td className='border'>
                  {items?.remarks}
                </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className='p-4'>Total Freight : <span className=' bg-green-100 border border-green-400 p-1 px-3 rounded '>
          {data?.itemsList.totalAmount}</span></h2>
        <h2 className='p-4'>Ledger Bal of vehicle : <span className=' bg-green-100 border border-green-400 p-1  px-3 rounded '>{ledgerBalance} </span></h2>

      </div>
      <div>
      <h2 className='bg-yellow-200 h-10 rounded text-center py-2 font-medium'>Additional Rate For Vehicle Hired</h2>
      {/* <FieldForm form={form} name="CN" label="Order No" type="string" /> */}
      <table className="mx-2 my-4 w-full border">
            <thead>
              <tr className="w-full border bg-slate-50">
                <th className="font-medium pr-3 text-nowrap  border ">Charges Name</th>
                <th className="font-medium pr-3 text-nowrap border ">Qty</th>
                <th className="font-medium pr-3 text-nowrap  border">Rate</th>
                <th className="font-medium pr-3 text-nowrap  border">Amount</th>
                <th className="font-medium pr-3 text-nowrap  border">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {data?.additionalCharges.chargers.map((items, i) => (
                <tr key={i} className="w-full text-center">
                  <td className='border'>{items.name}</td>
                  <td className='border'>{items.qty}</td>
                  <td className='border'>{items.rate}</td>
                  <td className='border'>{items.amount}</td>  
                  <td className='border'>
                  {items?.remarks}
                </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className='p-4'>Total Freight : <span className=' bg-green-100 border border-green-400 p-1 px-3 rounded '>
        {data?.additionalCharges.totalCharge}</span></h2>
        <h2 className='p-4'>Ledger Bal of vehicle : {}</h2>
      </div>

      </div>


      {/* Delivery details */}
      <div className='grid grid-cols-2 gap-8'>
      <div>
      <h2 className='text-emerald-700 text-2xl font-bold underline text-center'>Delivery Details</h2>
      <FieldForm form={form} name="CN" label="Reporting Date" type="date" />
      <FieldForm form={form} name="CN" label="Reporting time" type="time" />

      <FieldForm form={form} name="CN" label="Uploading Date" type="date" />
      <FieldForm form={form} name="CN" label="Uploading time" type="time" />

      <FieldForm form={form} name="CN" label="Material Received By" type="text" />
      <FieldForm form={form} name="CN" label="Phone No" type="number" />

      
      <FormField
              control={form.control}
              name="bookingType"
              render={({ field }) => {
                return (
                  <FormItem className="flex items-center justify-center gap-4">
                    <FormLabel className="text-nowrap text-sm lg:text-base">
                    Stamp :
                    </FormLabel>
                    <div className="flex flex-1 flex-col">
                      <FormControl>
                        <select {...field}>
                          <option value="">Select Stamp</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
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
              name="bookingType"
              render={({ field }) => {
                return (
                  <FormItem className="flex items-center justify-center gap-4">
                    <FormLabel className="text-nowrap text-sm lg:text-base">
                    Sign :
                    </FormLabel>
                    <div className="flex flex-1 flex-col">
                      <FormControl>
                        <select {...field}>
                          <option value="">Select Sign</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                );
              }}
            />

      </div>
      <div>
      <h2 className='text-emerald-700 text-2xl font-bold underline text-center'>Payment Details</h2>
      <FieldForm form={form} name="CN" label="LR Dues Amt" type="number" />
      <FieldForm form={form} name="CN" label="Payment Modes" type="text" />
      <FieldForm form={form} name="CN" label="Amount Received" type="number" />

      <p className='text-sm bg-orange-50 p-1 text-center font-medium'>To be billing Booking LR payment can be Collected through invoice</p>
      <FieldForm form={form} name="CN" label="Fine" type="number" />
      <FieldForm form={form} name="CN" label="Final Due" type="number" />
      <FieldForm form={form} name="CN" label="Remarks" type="text" />
      </div>

      </div>


      {/* Consignment Information */}
      <div>
      <h2 className='text-emerald-700 text-2xl font-bold underline text-center'>Consignment Information</h2>
      <table className="mx-2 my-4 w-full border">
            <thead>
              <tr className="w-full border bg-slate-50">
                <th className="font-medium pr-3 text-nowrap border">Date</th>
                <th className="font-medium pr-3 text-nowrap border ">Delivery No</th>
                <th className="font-medium pr-3 text-nowrap border">From Location</th>
                <th className="font-medium pr-3 text-nowrap border">To Location</th>
                <th className="font-medium pr-3 text-nowrap border">qty</th>
                <th className="font-medium pr-3 text-nowrap border">Weight</th>
                <th className="font-medium pr-3 text-nowrap border">Breakage</th>
                <th className="font-medium pr-3 text-nowrap border">Excess</th>
                <th className="font-medium pr-3 text-nowrap border">Shortage</th>
                <th className="font-medium pr-3 text-nowrap border">remarks</th>
                <th className="font-medium pr-3 text-nowrap border">POD</th>
                <th className="font-medium pr-3 text-nowrap border">Action</th>
              </tr>
            </thead>
            <tbody>
            
                <tr  className="w-full text-center">
                   <td className='border'>{formatDate(data?.date)}</td>
                   <td className='border'>
                    {data?.orderNumber}
                   </td>
                   <td className='border'>{data?.loadingPoints}</td>
                   <td className='border'>{data?.unloadingPoints}</td>
                   <td className='border'>{totalQty}</td>
                   <td className='border'>{totalWeight}</td>

                  <td className='border' onDoubleClick={handleTable}>{isEdit ?   <FieldForm form={form} name="CN" label="" type="text" /> :  ""}</td>
                  <td className='border' onDoubleClick={handleTable}>{isEdit ?   <FieldForm form={form} name="CN" label="" type="text" /> :  ""}</td>
                  <td className='border' onDoubleClick={handleTable}>{isEdit ?   <FieldForm form={form} name="CN" label="" type="text" /> :  ""}</td>
                  <td className='border' onDoubleClick={handleTable}>{isEdit ?   <FieldForm form={form} name="CN" label="" type="text" /> :  ""}</td>
                  <td className='border' onDoubleClick={handleTable}>{isEdit ?   <FieldForm form={form} name="CN" label="" type="text" /> :  ""}</td>
                    
                   <td>Unload</td>
            
                </tr>
            
            </tbody>
          </table>
        
      </div>
        
          
            <Button
              type="submit"
              className=" h-16 w-1/2 self-center   bg-emerald-600 text-lg text-white hover:text-white/90 xl:w-1/3 hover:bg-emerald-700"
            >
              {isloading ? "Loading..." : " Deliver Material"}
            </Button>
           
          
        </form>
      </Form>
      </div>
    </div>
  )
}

export default DeliveryForm