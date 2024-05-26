"use client";
import React from "react";
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
import { Button } from "@/app/components/ui/button";

import { UserContext } from "@/app/context/UserContextProvider";
import { set } from "mongoose";
import { Divide } from "lucide-react";
import FieldForm from "@/app/admin/component/FieldForm";
import  FieldFormFile from "@/app/admin/vehicle/FieldForm";

const deliveryDetailsSchema = z.object({
  reporting_date: z.coerce.date(),
  unloading_date: z.coerce.date(),
  material_received_by: z.string(),
  phone_number: z.string().optional(),
  stamp: z.coerce.boolean(),
  sign:z.coerce.boolean(),
});

const paymentDetailsSchema = z.object({
  lr_dues_amount: z.coerce.number(),
  payment_modes: z.string(),
  amount_received: z.coerce.number(),
  fine: z.coerce.number(),
  final_due: z.coerce.number(),
  remarks: z.string(),
});

const consignmentInfoSchema = z.object({
  delivery_date:  z.coerce.date().optional(),
  delivery_number: z.string().optional(),
  from_location:z.string().optional(),
  to_location:z.string().optional(),
  quantity: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  breakage: z.coerce.number(),
  excess: z.coerce.number(),
  shortage: z.coerce.number(),
  remarks: z.string(),
  pod: z.array(z.string().url()),
  action: z.string().optional(),
});

const formSchema = z.object({
  adminId: z.string(),
  bookingId: z.string(),
  deliveryDetails: deliveryDetailsSchema,
  paymentDetails: paymentDetailsSchema,
  consignmentInfo: z.array(consignmentInfoSchema),
});

const DeliveryForm = ({ params }) => {
  const initialFormState = {
    adminId:"",
    bookingId:"",
    deliveryDetails: {
      reporting_date: new Date().toISOString().split("T")[0],
      unloading_date: new Date().toISOString().split("T")[0],
      material_received_by: undefined,
      phone_number: undefined,
      stamp: undefined,
    },
    paymentDetails: {
      lr_dues_amount: undefined,
      payment_modes: undefined,
      amount_received: undefined,
      fine: undefined,
      final_due: undefined,
      remarks: undefined,
    },
    consignmentInfo: [],
  };

  const { toast } = useToast();
  const [totalQty, setTotalQty] = useState();
  const [totalWeight, setTotalWeight] = useState();
  const [isEdit, setEdit] = useState(false);
  const [isloading, setIsLoading] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [ledgerBalance, setLedgerBalance] = useState();
  const bookingIdParams = params.bookingId;
  const {user} = useContext(UserContext);



  // console.log(bookingId);

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/bookingdetails/${bookingIdParams}`, {
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
  function formatDateToYYYYMMDD(dateString) {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  

  useEffect(() => {
    const fetchLedgerBalance = async () => {
      try {
        if (orderNumber) {
          const response = await fetch(
            `/api/accounting/getLedgerBalance/${orderNumber}`,
            {
              method: "GET",
            },
          );
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
    };



    function calculate() {
      const materialData = data?.itemsList?.item;

      const totalQty = materialData?.reduce((total, item) => {
        const quantity = parseFloat(item.quantity);
        return total + (isNaN(quantity) ? 0 : quantity);
      }, 0);

      const totalWt = materialData?.reduce((total, item) => {
        const wt = parseFloat(item.actualWeight);
        return total + (isNaN(wt) ? 0 : wt);
      }, 0);
      setTotalQty(totalQty);
      setTotalWeight(totalWt);
      // console.log("quantity :",totalQty)
    }
    
    
     // Output: "2024-05-24"
    

    function setFormValues(){
      if(data){
        form.setValue("consignmentInfo[0].delivery_date" , formatDateToYYYYMMDD(data?.date))
        
  form.setValue("consignmentInfo[0].delivery_number" , data?.orderNumber)
  form.setValue("consignmentInfo[0].from_location" , data?.loadingPoints.join(","))
  form.setValue("consignmentInfo[0].to_location" , data?.unloadingPoints.join(","))
  form.setValue("consignmentInfo[0].quantity" ,90 )
  form.setValue("consignmentInfo[0].weight" , 9)

      console.log("value:",form.getValues("consignmentInfo[0]" ))
      }
    }
    
    calculate();
    fetchLedgerBalance();
    setFormValues();
  }, [orderNumber]);

  const { reset, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  async function MyHandleSubmit(value) {
    console.log("hey form");
    

    value.adminId = user?._id;
    value.bookingId = params.bookingId;

    console.log(value);
    
    try {
     
      const response = await fetch("/api/deliverBooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
      console.log(response);

      const newResult = await response.json();
      console.log(newResult);
      if (response.ok) {
       
        setIsLoading(false);
        displayToast(
          "Successfully Deliver Material",
          "✅",
        );

        reset(initialFormState);
      } else {
        console.error("Error:", newResult.message);
        displayToast("Error", "❌", newResult.message);
        setIsLoading(false);
      
      }
    } catch (error) {
      console.error("Error:", error);
      displayToast("Error while sending data", "❌", newResult.message);
      setIsLoading(false);
     
    }
  }

  function handleTable() {
    setEdit(!isEdit);
    console.log("clicked");
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  const submitData = {
    adminId: "6630a60370282f06184d9cd6", 
    bookingId: "6650281234b19d4ee7f2e048",
    deliveryDetails: {
      reporting_date: "2024-05-25T10:00:00.000Z",
      unloading_date: "2024-05-26T14:00:00.000Z",
      material_received_by: "John Doe",
      phone_number: "1234567890",
      stamp: true,
      sign: false,
    },
    paymentDetails: {
      lr_dues_amount: 1000,
      payment_modes: "Credit Card",
      amount_received: 900,
      fine: 50,
      final_due: 150,
      remarks: "Payment due in next cycle"
    },
    consignmentInfo: [
      {
        delivery_date: "2024-05-26T14:00:00.000Z",
        delivery_number: "DEL123456",
        from_location: "Warehouse A",
        to_location: "Warehouse B",
        quantity: 100,
        weight: 2000,
        breakage: 2,
        excess: 0,
        shortage: 0,
        remarks: "Handle with care",
        pod: ["https://meet.google.com/obo-fyri-bfu"],
        action: "Delivered"
      },
    ]
  }

  // console.log(formSchema.safeParse(submitData));
 

  return (
    <div className="min-h-[90vh] w-full space-y-6">
      <div
        className="h-full w-full 
      space-y-2 rounded-2xl  bg-white px-4 py-4 
     shadow-sm md:px-6 xl:h-[95%]"
      >
        {/* <h1 className="hidden text-4xl font-semibold text-emerald-700 lg:block ">Delivery Details </h1> */}

       {loading ? "Loading..." : <Form {...form}>
          <form
            onSubmit={form.handleSubmit(MyHandleSubmit)}
            className="flex flex-col gap-5"
          >
            {/* details Show  */}
            <div className="mt-8  grid min-h-10 grid-cols-1 rounded bg-orange-100 px-4 py-2 text-orange-500  md:mt-0 md:grid-cols-2 ">
              <div className="flex gap-8">
                <h1 className="text-base  text-amber-600">CN/LR No :</h1>
                <h1 className="text-base  font-semibold text-amber-600">
                  {data?.orderNumber}
                </h1>
              </div>
              <div className="flex gap-8">
                <h1 className="text-base  text-amber-600">Payment Term :</h1>
                <h1 className="text-base  font-semibold text-amber-600">
                  {data?.paymentTerm}
                </h1>
              </div>
              <div className="flex gap-8">
                <h1 className="text-base  text-amber-600">Consignor:</h1>
                <h1 className="text-base  font-semibold text-amber-600">
                  {data?.consignorName}
                </h1>
              </div>
              <div className="flex gap-8">
                <h1 className="text-base  text-amber-600">Consignee :</h1>
                <h1 className="text-base  font-semibold text-amber-600">
                  {data?.consigneeName}
                </h1>
              </div>

              <div className="flex gap-8">
                <h1 className="text-base  text-amber-600">
                  Total Billing Amount :
                </h1>
                <h1 className="text-base  font-semibold text-amber-600">
                  {" "}
                  &#8377; {data?.totalBillingAmount}
                </h1>
              </div>
              <div className="flex gap-8">
                <h1 className="text-base  text-amber-600">Amount Received :</h1>
                <h1 className="text-base  font-semibold text-amber-600">
                  {" "}
                  &#8377; {data?.totalPaidAmount}
                </h1>
              </div>
            </div>

            {/* Additional rate table */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h2 className="h-10 rounded bg-yellow-200 py-2 text-center font-medium">
                  Additional Rate For Company
                </h2>
                <table className="mx-2 my-4 w-full border">
                  <thead>
                    <tr className="w-full border bg-slate-50">
                      <th className="text-nowrap border p-2 pr-3 text-sm font-medium  md:text-base  ">
                        Charges Name
                      </th>
                      <th className="text-nowrap border p-2 pr-3 text-sm font-medium  md:text-base  ">
                        Qty
                      </th>
                      <th className="text-nowrap border p-2 pr-3 text-sm font-medium  md:text-base  ">
                        Rate
                      </th>
                      <th className="text-nowrap border p-2 pr-3 text-sm font-medium  md:text-base  ">
                        Amount
                      </th>
                      <th className="hidden text-nowrap border p-2 pr-3 text-sm font-medium md:block  md:text-base ">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.itemsList.item.map((items, i) => (
                      <tr key={i} className="w-full text-center">
                        <td className="border p-2">{items.material}</td>
                        <td className="border p-2">{items.quantity}</td>
                        <td className="border p-2">{items.rate}</td>
                        <td className="border p-2">{items.basicAmount}</td>
                        <td className="hidden p-2   md:block">
                          {items?.remarks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h2 className="p-4">
                  Total Freight :{" "}
                  <span className=" rounded border border-green-400 bg-green-100 p-1 px-3 ">
                    {data?.itemsList.totalAmount}
                  </span>
                </h2>
                <h2 className="p-4">
                  Ledger Bal. of Party :{" "}
                  <span className=" rounded border border-green-400 bg-green-100  p-1 px-3 ">
                    {ledgerBalance}{" "}
                  </span>
                </h2>
              </div>
              <div>
                <h2 className="h-10 rounded bg-yellow-200 py-2 text-center font-medium">
                  Additional Rate For Vehicle Hired
                </h2>

                <table className="mx-2 my-4 w-full border">
                  <thead>
                    <tr className="w-full border bg-slate-50">
                      <th className="text-nowrap border p-2 pr-3 text-sm font-medium   md:text-base ">
                        Charges Name
                      </th>
                      <th className="text-nowrap border p-2 pr-3 text-sm font-medium  md:text-base ">
                        Qty
                      </th>
                      <th className="text-nowrap border p-2 pr-3 text-sm font-medium   md:text-base">
                        Rate
                      </th>
                      <th className="text-nowrap border p-2 pr-3 text-sm font-medium   md:text-base">
                        Amount
                      </th>
                      <th className="hidden text-nowrap  border p-2 pr-3 text-sm font-medium md:block   md:text-base">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.additionalCharges.chargers.map((items, i) => (
                      <tr key={i} className="w-full text-center">
                        <td className="border p-2">{items.name}</td>
                        <td className="border p-2">{items.qty}</td>
                        <td className="border p-2">{items.rate}</td>
                        <td className="border p-2">{items.amount}</td>
                        <td className="hidden p-2  md:block">
                          {items?.remarks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h2 className="p-4">
                  Total Freight :{" "}
                  <span className=" rounded border border-green-400 bg-green-100 p-1 px-3 ">
                    {data?.additionalCharges.totalCharge}
                  </span>
                </h2>
                <h2 className="p-4">Ledger Bal. of vehicle :  <span className=" rounded border border-green-400 bg-green-100 p-1 px-3 ">
                    0.0
                  </span></h2>
              </div>
            </div>

            {/* Delivery details */}
            <div className="grid  grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-center text-xl font-bold text-emerald-700 underline md:text-2xl">
                  Delivery Details
                </h2>
                <FieldForm
                  form={form}
                  name="deliveryDetails.reporting_date"
                  label="Reporting Date"
                  type="date"
                />
                {/* <FieldForm form={form} name="CN" label="Reporting time" type="time" /> */}

                <FieldForm
                  form={form}
                  name="deliveryDetails.unloading_date"
                  label="Uploading Date"
                  type="date"
                />
                {/* <FieldForm form={form} name="CN" label="Uploading time" type="time" /> */}

                <FieldForm
                  form={form}
                  name="deliveryDetails.material_received_by"
                  label="Material Received By"
                  type="text"
                />
                <FieldForm
                  form={form}
                  name="deliveryDetails.phone_number"
                  label="Phone No"
                  type="number"
                />

                <FormField
                  control={form.control}
                  name="deliveryDetails.stamp"
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
                              <option value="1">Yes</option>
                              <option value="0">No</option>
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
                  name="deliveryDetails.sign"
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
                              <option value="1">Yes</option>
                              <option value="0">No</option>
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
                <h2 className="text-center text-xl font-bold text-emerald-700 underline md:text-2xl">
                  Payment Details
                </h2>
                <FieldForm
                  form={form}
                  name="paymentDetails.lr_dues_amount"
                  label="LR Dues Amt"
                  type="number"
                />
                <FieldForm
                  form={form}
                  name="paymentDetails.payment_modes"
                  label="Payment Modes"
                  type="text"
                />
                <FieldForm
                  form={form}
                  name="paymentDetails.amount_received"
                  label="Amount Received"
                  type="number"
                />

                <p className="bg-orange-50 p-1 text-center text-sm font-medium">
                  To be billing Booking LR payment can be Collected through
                  invoice
                </p>
                <FieldForm
                  form={form}
                  name="paymentDetails.fine"
                  label="Fine"
                  type="number"
                />
                <FieldForm
                  form={form}
                  name="paymentDetails.final_due"
                  label="Final Due"
                  type="number"
                />
                <FieldForm
                  form={form}
                  name="paymentDetails.remarks"
                  label="Remarks"
                  type="text"
                />
              </div>
            </div>

            {/* Consignment Information */}
            <div>
              <h2 className="text-center text-xl font-bold text-emerald-700 underline md:text-2xl">
                Consignment Information
              </h2>
              <div className="mt-4 shadow-lg 2xl:hidden">
                <div className="flex gap-4 border bg-gray-100 p-2 pl-4  ">
                  <h2 className="border-r-2 pr-8 font-medium md:w-48">Date</h2>
                  <p>{formatDate(data?.date)}</p>
                </div>
                <div className="flex gap-4 border p-2 pl-4   ">
                  <h2 className="border-r-2 pr-8 font-medium md:w-48">
                    Delivery No
                  </h2>
                  <p>{data?.orderNumber}</p>
                </div>
                <div className="flex gap-4 border bg-gray-100 p-2 pl-4  ">
                  <h2 className="border-r-2 pr-8 font-medium md:w-48">
                    From Location
                  </h2>
                  <p>{data?.loadingPoints}</p>
                </div>

                <div className="flex gap-4 border p-2 pl-4   ">
                  <h2 className="border-r-2 pr-8 font-medium md:w-48">
                    To Location
                  </h2>
                  <p>{data?.unloadingPoints}</p>
                </div>
                <div className="flex gap-4 border bg-gray-100 p-2 pl-4  ">
                  <h2 className="border-r-2 pr-8 font-medium md:w-48">qty</h2>
                  <p>{totalQty}</p>
                </div>
                <div className="flex gap-4 border p-2 pl-4   ">
                  <h2 className="border-r-2 pr-8 font-medium md:w-48">
                    Weight
                  </h2>
                  <p>{totalWeight}</p>
                </div>

                <div className="flex gap-4 border bg-gray-100 p-2 pl-4  ">
                  <h2 className="border-r-2 pr-8 font-medium md:w-48">
                    Breakage
                  </h2>
                  <FieldForm form={form} name="consignmentInfo[0].breakage" label="" type="number" />
                </div>
                <div className="flex gap-4 border p-2 pl-4  ">
                  <h2 className="border-r-2 pr-8 font-medium md:w-48">
                    Excess
                  </h2>
                  <FieldForm form={form} name="consignmentInfo[0].excess" label="" type="number" />
                </div>
                <div className="flex gap-4 border bg-gray-100 p-2 pl-4  ">
                  <h2 className="border-r-2 pr-8 font-medium md:w-48">
                    Shortage
                  </h2>
                  <FieldForm form={form} name="consignmentInfo[0].shortage" label="" type="number" />
                </div>
                <div className="flex gap-4 border p-2 pl-4   ">
                  <h2 className="border-r-2 pr-8 font-medium md:w-48">
                    remarks
                  </h2>
                  <FieldForm form={form} name="consignmentInfo[0].remarks" label="" type="text" />
                </div>
                <div className="flex gap-4 border bg-gray-100 p-2 pl-4  ">
                  <h2 className="border-r-2 pr-8 font-medium md:w-48">POD</h2>
                 
                  <FieldFormFile form={form} nameValue="consignmentInfo[0].pod" label="" type="file" fileNumber={1}/>
                </div>
                <div className="flex gap-4 border p-2 pl-4   ">
                  <h2 className="border-r-2 pr-8 font-medium md:w-48">
                    Action
                  </h2>
                  <p>unload</p>
                </div>
              </div>
              <table className="mx-2 my-4 hidden w-full rounded border shadow-lg 2xl:block ">
                <thead>
                  <tr className="w-full border bg-slate-50">
                    <th className="text-nowrap border p-2 pr-3 font-medium">
                      Date
                    </th>
                    <th className="text-nowrap border p-2 pr-3 font-medium ">
                      Delivery No
                    </th>
                    <th className="text-nowrap border p-2 pr-3 font-medium">
                      From Location
                    </th>
                    <th className="text-nowrap border p-2 pr-3 font-medium">
                      To Location
                    </th>
                    <th className="text-nowrap border p-2 pr-3 font-medium">
                      qty
                    </th>
                    <th className="text-nowrap border p-2 pr-3 font-medium">
                      Weight
                    </th>
                    <th className="text-nowrap border p-2 pr-3 font-medium">
                      Breakage
                    </th>
                    <th className="text-nowrap border p-2 pr-3 font-medium">
                      Excess
                    </th>
                    <th className="text-nowrap border p-2 pr-3 font-medium">
                      Shortage
                    </th>
                    <th className="text-nowrap border p-2 pr-3 font-medium">
                      remarks
                    </th>
                    <th className="text-nowrap border p-2 pr-3 font-medium">
                      POD
                    </th>
                    <th className="text-nowrap border p-2 pr-3 font-medium">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="w-full text-center">
                    <td className="border p-2">{formatDate(data?.date)}</td>
                    <td className="border p-2">{data?.orderNumber}</td>
                    <td className="border p-2">{data?.loadingPoints}</td>
                    <td className="border p-2">{data?.unloadingPoints}</td>
                    <td className="border p-2">{totalQty}</td>
                    <td className="border p-2">{totalWeight}</td>

                    <td className="border p-2" >
                     
                        <FieldForm form={form} name="consignmentInfo[0].breakage" label="" type="number" />
                      
                    </td>
                    <td className="border p-2" onDoubleClick={handleTable}>
                     
                        <FieldForm form={form} name="consignmentInfo[0].excess" label="" type="number" />
                      
                    </td>
                    <td className="border p-2" onDoubleClick={handleTable}>
                     
                        <FieldForm form={form} name="consignmentInfo[0].shortage" label="" type="number" />
                      
                    </td>
                    <td className="border p-2" onDoubleClick={handleTable}>
                     
                        <FieldForm form={form} name="consignmentInfo[0].remarks" label="" type="text" />
                      
                    </td>
                    <td className="border p-2" >
                     
                    <FieldFormFile form={form} nameValue="consignmentInfo[0].pod" label="" type="file" fileNumber={1}/>
                   </td>

                    <td>Unload</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="hidden">
            <FieldForm form={form} name="consignmentInfo[0].delivery_date" label="" type="date" />
            <FieldForm form={form} name="consignmentInfo[0].delivery_number" label="" type="text" />
            <FieldForm form={form} name="consignmentInfo[0].from_location" label="" type="text" />
            <FieldForm form={form} name="consignmentInfo[0].to_location" label="" type="text" />
            <FieldForm form={form} name="consignmentInfo[0].quantity" label="" type="number" />
            <FieldForm form={form} name="consignmentInfo[0].weight" label="" type="number" />
            </div>

            <Button
              type="submit"
              className=" h-16 w-1/2 self-center   bg-emerald-600 text-lg text-white hover:bg-emerald-700 hover:text-white/90 xl:w-1/3"
            >
              {isloading ? "Loading..." : " Deliver Material"}
            </Button>
          </form>
        </Form>}
      </div>
    </div>
  );
};

export default DeliveryForm;
