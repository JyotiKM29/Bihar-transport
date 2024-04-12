"use client";
import CartTable from './CartTable';
import MaterialInfo from './MaterialInfo';
import { FaPlus } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import LocationAdd from "./LocationAdd";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import SearchInput from "./SearchInput";
import * as z from "zod";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "../../components/ui/use-toast";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import AdditionalChargers from './AdditionalCharge';

const chargersSchema = z.object({
  name: z.string({ message: "Field is required" }),
  amount: z.coerce.number({
        message: "Field is required",
       }),

  rate: z.coerce.number({
    message: "Field is required",
   }),

  qty: z.coerce.number({
    message: "Field is required",
   }),
});

const additionalChargeSchema = z.object({
  enabled: z.boolean(),
  totalCharge: z.number(),
  chargers: z.array(chargersSchema),
});

const itemsSchema = z.object({
  material: z.string().optional(),
  hsnNo:z.string(),
  quantity: z.coerce.number().optional(),
  quantityUnit:  z.string().optional(),
  actualWeight:  z.coerce.number().optional(),
  actualWeightUnit: z.string().optional(),
  chargedWeight: z.coerce.number().optional(),
  chargedWeightUnit:  z.string().optional(),
  rateAsPer:   z.string().optional(),
  rateAsPerOption: z.string().optional(),
  rate: z.coerce.number().optional(),
  rateUnit:  z.string().optional(),
  GSTPercentage: z.coerce.number().optional(),
  GSTType:z.enum(['RCM','FCM']),
  basicAmount:z.coerce.number(),
  amount: z.coerce.number().optional(),
})

const formSchema = z.object({
  orderNumber: z.coerce
    .number({
      message: "order ID is required",
    })
    .positive(),
  date: z.coerce.date({ message: "Date is require" }),
  vehicleRequiredDate: z.coerce.date({ message: "Date is require" }),
  bookingType: z.enum(["personal", "general", "comapany"]),
  consignorName: z.string({ message: "Field is required" }),
  consignorMobileNumber: z.coerce.number(),
  loadingPoints: z.array(z.string()),
  consigneeName: z.string({ message: "Field is required" }).optional(),
  consigneeMobileNumber: z.coerce.number(),

  unloadingPoints: z.array(z.string()),
  way: z.enum(["one way", "two way", "return"]),
  vehicleType: z.string({ message: "Field is required" }).min(3),
  noOfVehicle: z.enum(["1", "2", "3", "others"]),
  vehicleLength: z.string(),
  WeightCapacity:z.string(),
  customNoOfVehicle: z.number().optional(),
  partyBhara: z.coerce
    .number({
      message: "Field is required",
    }),
  // hideBhara: z.coerce.boolean({}),
  
  // paymentLiability: z.enum([
  //   "Consignor",
  //   "Consignee",
  //   "Third Party",
  //   "Vehicle Owner",
  // ]),
  // billTo: z.string({ message: "Field is required" }),
  paymentTerm: z.enum(["Advance", "Paid", "To Pay", "To be Billed"]),
  // advanceAmount: z.coerce.number({
  //   message: "Field is required",
  // }),
  // balanceAmount: z.coerce.number({
  //   message: "Field is required",
  // }),
  // payMode: z.string({ message: "Field is required" }).min(2),
  // transactionId: z.string().optional(),
  remarks: z.string({ message: "Field is required" }).min(2),
  itemsList:z.array(itemsSchema),
  additionalCharges: additionalChargeSchema,
  // totalMaterialCharges:z.coerce.number(),
  totalAdditionalChargeTax:z.coerce.number(),
  totalAdditionalCharges:z.coerce.number(),
  totalBillingAmount: z.coerce.number(),
  adminId: z.string(),
});

export default function ProfileForm() {
  const initialFormState = {
    orderNumber: generateUniqueId(),
    date: new Date().toISOString().split("T")[0],
    vehicleRequiredDate: new Date().toISOString().split("T")[0],
    bookingType: "",
    consignorName: "",
    consignorMobileNumber: 0,
    loadingPoints: [""],
    consigneeName: "",
    consigneeMobileNumber: 0,
    unloadingPoints: [""],
    way: "",
    material: "",
    vehicleType: "",
    noOfVehicle:1,
    partyBhara: 0,
    // hideBhara: false,
    // paymentLiability: "",
    // billTo: "",
    paymentTerm: "",
    // advanceAmount: 0,
    // balanceAmount: 0,
    // payMode: "",
    // transactionId: "",
    remarks: "",
    itemsList:{
      material: undefined,
      quantity: undefined,
      quantityUnit:  undefined,
      actualWeight: undefined,
      actualWeightUnit: undefined,
      chargedWeight:undefined,
      chargedWeightUnit:  undefined,
      rateAsPer:  undefined,
      rateAsPerOption: undefined,
      rate: undefined,
      rateUnit: undefined,
      GSTPercentage: 0,
      GSTType:'',
      amount:undefined,
    },
    additionalCharges: {
      enabled: false,
      totalCharge: 0,
      chargers: [],
    },
    totalAdditionalChargeTax:0,
    totalAdditionalCharges:0,
    totalBillingAmount: 0,
    adminId: "",
  };


  const route = useRouter();
  const[allocateVehicle, setAllocateVehicle] = useState(false);
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();

  const { reset, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });
  const CartItems = form.getValues("itemsList");
  const advanceAmount = form.watch("advanceAmount", 0);
  const additionalCharges = form.watch("additionalCharges.totalCharge");
  const PartyBhara = form.watch('partyBhara',0);
  

  const totalAdditionalCharges = form.getValues('totalAdditionalCharges')
    const totalAdditionalChargeTax = form.getValues('totalAdditionalChargeTax')


  function calPartyBhara(PartyBhara) {
    
    const total = Number(PartyBhara) ;

   
    form.setValue("partyBhara", total )
 return  total;
    
  }
  
  function calBalanceAmount(advanceAmount = 0, partyBhara = 0) {
    return partyBhara - advanceAmount;
  }

  function caltotalBillingAmount(totalAdditionalCharges,PartyBhara,totalAdditionalChargeTax ){
      const total = Number(totalAdditionalCharges) + Number(PartyBhara) + Number(totalAdditionalChargeTax);
      form.setValue('totalBillingAmount',total )
  }
  
  useEffect(() => {
    console.log('hello ')
    calPartyBhara(PartyBhara, additionalCharges);
    
  }, [additionalCharges, ]);
  
  useEffect(() => {
    const balanceAmount = calBalanceAmount( PartyBhara);
    form.setValue("balanceAmount",balanceAmount);
  }, [PartyBhara, totalAdditionalCharges , totalAdditionalChargeTax]);
  
useEffect(()=>{
  caltotalBillingAmount(totalAdditionalCharges,PartyBhara,totalAdditionalChargeTax );
},[totalAdditionalCharges,PartyBhara,totalAdditionalChargeTax])


  function generateUniqueId() {
    return Math.floor(100000 + Math.random() * 900000);
  }

 

  async function MyHandleSubmit(value) {
    

    console.log("hey");
    console.log(value);

    setIsLoading(true);
    try {
      if (allocateVehicle) {
        value.status = "Confirmed";
        console.log(value);
      }
      const response = await fetch("/api/createbooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
    

      const newResult = await response.json();

      if (response.ok) {
        if(allocateVehicle){
          console.log("hey", newResult.Booking.orderNumber)
          setIsLoading(false);
         displayToast(
          "Successfully Booked,Ok",
          "✅",
        );
        setAllocateVehicle(false)
        
           route.push(`/admin/booking/${newResult.Booking.orderNumber}`);
        }
        setIsLoading(false);
        displayToast(
          "Successfully Booked, Click view Booking button to view the booking",
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

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  return (
    <div className="max-w max-h  bg-white px-0 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(MyHandleSubmit)}
          className="flex flex-col gap-5"
        >
       <div className='rounded-xl shadow-md grid grid-cols-1 lg:grid-cols-2 space-x-6 space-y-2 border py-1 px-3'  >
       <FormField
                control={form.control}
                name="orderNumber"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="px-5 text-nowrap text-sm lg:text-base">
                        Order ID :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Date :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="vehicleRequiredDate"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Vehicle Req Date :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />

              {/* Booking Type  */}

              <FormField
                control={form.control}
                name="bookingType"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Booking Type :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <select {...field}>
                            <option value="">Select Booking Type</option>
                            <option value="personal">Personal Booking </option>
                            <option value="general">General Booking</option>
                            <option value="comapany ">Comapany Booking</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />


<div className="px-5 flex items-center gap-0">
<FormField
         control={form.control}
         name="consignorName"
         
         render={({ field }) => (
           <SearchInput
          
             form={form}
             field={field}
             personName="consignorName"
           />
         )}
       />
       <Link href='/admin/booking/new-regesitration' className="border h-10 text-base text-nowrap px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200">
       <FiPlus  className="h-full w-full"/>

       </Link>
</div>
<div className="flex items-center gap-0">
<FormField
         control={form.control}
         name="consigneeName"
         render={({ field }) => (
           <SearchInput
             form={form}
             field={field}
             personName="consigneeName"
           />
           
         )}
       />
        <Link href='/admin/booking/new-regesitration' className="border h-10 text-base text-nowrap px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200">
       <FiPlus  className="h-full w-full"/>

       </Link>
       </div>

       <FormField
         control={form.control}
         name="consignorMobileNumber"
         render={({ field }) => {
           return (
             <FormItem className="flex items-center justify-center gap-4">
               <FormLabel className="text-nowrap text-base ">
                 Consignor Mobile No :
               </FormLabel>
               <div className="flex flex-1 flex-col">
                 <FormControl>
                   <Input type="text" value={field.value} {...field} />
                 </FormControl>
                 <FormMessage />
               </div>
             </FormItem>
           );
         }}
       />
        <FormField
         control={form.control}
         name="consigneeMobileNumber"
         render={({ field }) => {
           return (
             <FormItem className="flex items-center justify-center gap-4">
               <FormLabel className="text-nowrap text-sm lg:text-base">
                 Consignee Mobile Number :
               </FormLabel>
               <div className="flex flex-1 flex-col">
                 <FormControl>
                   <Input type="text" value={field.value} {...field} />
                 </FormControl>
                 <FormMessage />
               </div>
             </FormItem>
           );
         }}
       />
       <FormField
         control={form.control}
         name="loadingPoints"
         render={({ field }) => {
           return (
             <LocationAdd
               field={field}
               form={form}
               nameValue={"loadingPoints"}
               label="Loading Points"
             />
           );
         }}
       />

      

      
       <FormField
         control={form.control}
         name="unloadingPoints"
         render={({ field }) => {
           return (
             <LocationAdd
               field={field}
               form={form}
               nameValue={"unloadingPoints"}
               label="Unloading Points"
             />
           );
         }}
       />




       </div>
       

           
       <div className='rounded-xl shadow-md grid grid-cols-1  space-x-6 space-y-2 border py-1 px-3'  >
       <CartTable items={CartItems}/>
      
</div>     

       <div className='flex flex-col lg:flex-row gap-6 '>
    
       {/* form */}
<div className='lg:w-1/2 flex gap-3 flex-col rounded-xl shadow-md   border py-3 px-6'>
<MaterialInfo form={form} nameValue='itemsList' />
<AdditionalChargers form ={form} nameValue="additionalCharges.chargers" items={additionalCharges.chargers} />
</div>
{/* calculation */}

<div className='lg:w-1/2 flex flex-col gap-4 '  >
<div className='rounded-xl shadow-md  border py-1 px-8'  >
       <h2 className='text-xl text-blue-500  font-medium underline mt-2'>Additional Details</h2>
       <div className='grid grid-cols-1 '>

      
       <FormField
                control={form.control}
                name="way"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className=" text-nowrap text-sm lg:text-base">
                        Trip :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <select {...field}>
                            <option value="">Select Way</option>
                            <option value="one way">one way</option>
                            <option value="two way">two way</option>
                            <option value="return">return</option>
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
                name="vehicleType"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        {" "}
                        Vehicle Type:
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />


 <FormField
            control={form.control}
            name="noOfVehicle"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap text-sm lg:text-base">
                    No of Vehicle :
                  </FormLabel>
                  <div className="flex flex-1 flex-col">
                    <FormControl>
                      <select {...field}>
                        <option value="">Select No of Vehicle</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="others">Others</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              );
            }}
          />

          {form.watch("noOfVehicle") === "others" && (
            <FormField
              control={form.control}
              name="customNoOfVehicle"
              render={({ field }) => {
                return (
                  <FormItem className="flex items-center justify-center gap-4">
                    <FormLabel className="text-nowrap text-sm lg:text-base">
                      Specify No of Vehicle :
                    </FormLabel>
                    <div className="flex flex-1 flex-col">
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                );
              }}
            />
          )}


          <FormField
                control={form.control}
                name="vehicleLength"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        {" "}
                        Vehicle Length:
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />


<FormField
                control={form.control}
                name="WeightCapacity"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        {" "}
                        Vehicle Weight Capacity:
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />

          </div>
</div>
<div className='rounded-xl shadow-md  border py-1 px-8'>
       <h2 className='text-xl text-red-500  font-medium underline mt-2'>Billing Details</h2>
       <div className='grid grid-cols-1  gap-x-6 '>

        {/*  Payment Term  */}
        <FormField
                control={form.control}
                name="paymentTerm"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Payment Term :
                      </FormLabel>
                      <div className="flex flex-1 flex-col ">
                        <FormControl>
                          <select {...field}>
                            <option value="">Select a payment term</option>
                            <option value="Advance">Advance</option>
                            <option value="Paid">Paid</option>
                            <option value="To Pay">To Pay</option>
                            <option value="To be Billed">To be Billed</option>
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
                name="remarks"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                       
                        Remarks:
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />



<FormField
                control={form.control}
                name="totalAdditionalCharges"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className=" text-nowrap text-sm lg:text-base">
                       Total Additional Charges :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                        <div className='flex gap-1 justify-center items-center bg-yellow-100 pl-2 rounded h-12 mb-2'>
                        &#8377;
                          <Input type="number" {...field} className='border-none bg-yellow-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 '  readOnly/>
                          </div>
                        </FormControl>
                    
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
<FormField
                control={form.control}
                name="totalAdditionalChargeTax"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className=" text-nowrap text-sm lg:text-base">
                       Additional Charge Tax :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                        <div className='flex gap-1 justify-center items-center bg-yellow-100 pl-2 rounded h-12 mb-2'>
                        &#8377;
                          <Input type="number" className='border-none bg-yellow-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ' {...field}  />
                          </div>
                        </FormControl>
                       
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
<FormField
                control={form.control}
                name="partyBhara"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className=" text-nowrap text-sm lg:text-base">
                        Party Bhara with Taxes :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                        <div className='flex gap-1 justify-center items-center bg-yellow-100 pl-2 rounded h-12 mb-2'>
                        &#8377;
                          <Input type="number" {...field} className='border-none bg-yellow-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ' readOnly />
                          </div>
                        </FormControl>
                     
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
<div className='  bg-amber-200  px-3 py-1 rounded mb-3'>


<FormField
                control={form.control}
                name="totalBillingAmount"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className=" text-nowrap text-sm lg:text-base">
                       Total billing Amount :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                        <div className='flex gap-1 justify-center items-center bg-yellow-100 pl-2 rounded h-12 mb-2'>
                        &#8377;
                        
                          <Input type="number" {...field}  className='border-none bg-yellow-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ' readOnly/>
                          </div> 
                        </FormControl>
                       
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
 </div>            
                 {/* <FormField
                control={form.control}
                name="hideBhara"
                render={({ field }) => {
                  return (
                    <FormItem className=" flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Hide Bhara :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              /> */}

              {/* <FormField
                control={form.control}
                name="paymentLiability"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Payment Liability :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <select {...field}>
                            <option value="">Select Payment Liability</option>
                            <option value="Consignor">Consignor</option>
                            <option value="Consignee">Consignee</option>
                            <option value="Third Party">Third Party</option>
                            <option value="Vehicle Owner">Vehicle Owner</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              /> */}
              {/* <FormField
                control={form.control}
                name="billTo"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        {" "}
                        Bill To:
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              /> */}
             
              {/* <FormField
                control={form.control}
                name="advanceAmount"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Advance Amount  (Rs):
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="balanceAmount"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Balance Amount  (Rs):
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input type="number" {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="payMode"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        {" "}
                        Pay Mode:
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="transactionId"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        {" "}
                        Transaction Id:
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              /> */}

              </div>
             
</div>
</div>
       </div>

       <div className="my-8 flex flex-col lg:flex-row gap-2 flex-1 justify-center lg:gap-6 items-center">
         <Button
            type="submit"
            className=" h-16 w-full self-center  text-lg xl:w-1/3 border-2 border-blue-600 bg-blue-100 text-blue-600 hover:text-white/90" 
           
          >
            {isloading ? "Loading..." : "Save Booking"}
          </Button>
         <Button
              type="submit"
              onClick={(e) => {
                setAllocateVehicle(true);
              }}
            className=" h-16 w-full self-center  text-lg xl:w-1/3"
          >
         
                {isloading ? "Loading..." : "Save & Allot Vehicle"}
          
            
          </Button>
         </div>
        </form>
      </Form>
    </div>
  );
}

//  const validationResult = chargersSchema.safeParse(newCharger);
