"use client";
import { GrClose } from "react-icons/gr";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";

import * as z from "zod";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContextProvider";
import { useToast } from "../../components/ui/use-toast";



const formSchema = z.object({
  orderNumber: z.coerce
    .number({
      message: "order ID is required",
    })
    .positive(),
  date: z.coerce.date({ message: "Date is require" }),
  vehicleRequiredDate: z.coerce.date({ message: "Date is require" }),
  consignorName: z.string({ message: "Field is required" }).min(3),
  consignorMobileNumber: z
    .string()
    .min(10, {
      message: "Phone must of 10 digits",
    })
    .max(10, {
      message: "Phone can't be more than 10 digits",
    }),
  loadingPoints: z.array(z.string()),
  consigneeName: z.string({ message: "Field is required" }).optional(),
  consigneeMobileNumber: z
    .string()
    .min(10, {
      message: "Phone must of 10 digits",
    })
    .max(10, {
      message: "Phone can't be more than 10 digits",
    }),
  unloadingPoints: z.array(z.string()),
  way: z.string().optional(),
  material: z.string({ message: "Field is required" }).min(3),
  quantity: z.coerce
    .number({
      message: "Quantity is required",
    })
    .positive(),
  quantityUnit: z.string({ message: "Field is required" }).min(2),
  vehicleType: z.string({ message: "Field is required" }).min(3),
  actualWeight: z.coerce
    .number({
      message: "Field is required",
    })
    .positive()
    .optional(),
  chargedWeight: z.coerce
    .number({
      message: "Field is required",
    })
    .positive(),
  rateAsPer: z.string({ message: "Field is required" }).min(2),
  rate: z.coerce
    .number({
      message: "Field is required",
    })
    .positive(),
  rateUnit: z.string({ message: "Field is required" }).min(2),
  partyBhara: z.coerce
    .number({
      message: "Field is required",
    })
    .positive(),
  hideBhara: z.coerce.boolean({}),
  // paymentTerm:z.string().optional(),
  paymentLiability: z.enum(["Consignor","Consignee", "Third Party", "Vehicle Owner"]),
  billTo: z.string({ message: "Field is required" }).min(2),
  paymentTerm: z.enum(["Advance", "Paid", "To Pay", "To be Billed"]),
  advanceAmount: z.coerce.number({
    message: "order ID is required",
  }),
  balanceAmount: z.coerce.number({
    message: "order ID is required",
  }),
  payMode: z.string({ message: "Field is required" }).min(2),
  transactionId: z.string({ message: "Field is required" }).min(3),
  remarks: z.string({ message: "Field is required" }).min(2),
  additionalCharges: z.string({ message: "Field is required" }).min(2),
  adminId:z.string(),
});

export default function ProfileForm() {
  const {user} = useContext(UserContext);
  const [fromLocations, setFromLocations] = useState([]);
  const [toLocations, setToLocations] = useState([]);
  const { toast } = useToast();
  const [isloading , setIsLoading] = useState()

  function addFromLocation(value) {
    form.setValue('adminId',user._id);
    setFromLocations((prev) => {
      const newLocations = [...prev, value];
      form.setValue("loadingPoints", newLocations);
      console.log(newLocations)
      return newLocations;
    });
  }

  function deleteFromLocation(index) {
    setFromLocations((prevLocations) => {
      const newLocations = prevLocations.filter((_, i) => i !== index);
      form.setValue("loadingPoints", newLocations);
      return newLocations;
    });
  }
  function addToLocation(value) {
    setToLocations((prev) => {
      const newLocations = [...prev, value];
      form.setValue("unloadingPoints", newLocations);
      console.log(newLocations)
      return newLocations;
    });
  }

  function deleteToLocation(index) {
    setToLocations((prevLocations) => {
      const newLocations = prevLocations.filter((_, i) => i !== index);
      form.setValue("unloadingPoints", newLocations);
      return newLocations;
    });
  }
  const initialFormState = {
    orderNumber: 0,
    date: "",
    vehicleRequiredDate: "",
    consignorName: "",
    consignorMobileNumber: "",
    loadingPoints: "",
    consigneeName: "",
    consigneeMobileNumber: "",
    unloadingPoints: "",
    way: "",
    material: "",
    quantity: "",
    quantityUnit: "",
    vehicleType: "",
    actualWeight: "",
    chargedWeight: "",
    rateAsPer: "",
    rate: "",
    rateUnit: "",
    partyBhara: "",
    hideBhara: "",
    paymentLiability: "",
    billTo: "",
    paymentTerm: "",
    advanceAmount: 0,
    balanceAmount: 0,
    payMode: "",
    transactionId: "",
    remarks: "",
    additionalCharges: "",
    adminId: '',
  };

  const { reset, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  async function MyHandleSubmit(value) {
    setIsLoading(true);
    try {
     
    const response = await fetch('/api/createbooking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(value),  
    });
  // console.log(response);

  const newResult = await response.json();

  if(response.ok){
    setIsLoading(false);
    displayToast("Successfully Booked, Click view Booking button to view the booking", "✅");
    const userDetail = newResult.user;
    reset(initialFormState);
  }

  else{
    console.error("Error:", newResult.message);
    displayToast("Error", "❌", newResult.message);
    setIsLoading(false);
  }
    } catch (error) {
      console.error("Error:", newResult.message);
    displayToast("Error", "❌", newResult.message);
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
          className="flex flex-col "
        >
          <div className="grid-col-1 grid grid-rows-3 py-2  lg:py-4 xl:grid-cols-3 xl:grid-rows-1 xl:space-x-16 ">
            <div className="md:column-span-1 row-span-1 min-w-full -space-y-3 lg:space-y-2 ">
              <FormField
                control={form.control}
                name="orderNumber"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Order ID :{" "}
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
              <FormField
                control={form.control}
                name="consignorName"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Consignor Name :
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
                name="consignorMobileNumber"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-base ">
                        Consignor Mobile No :
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
                name="loadingPoints"
                render={({ field }) => {
                  return (
                    <FormItem className="min-w flex items-center justify-center gap-4 ">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Loading Points :
                      </FormLabel>
                      <div className="flex w-full  flex-col">
                        <div
                          className=" 
                         
                              flex
                            items-center gap-1   overflow-x-scroll rounded-md border  border-input px-3 py-0 text-sm  ring-offset-background active:outline-none  active:ring-2 
                            active:ring-offset-1


                         "
                        >
                          {fromLocations.map((location, i) => (
                            <span
                              key={i}
                              className="flex h-8 items-center gap-1 rounded-lg  bg-blue-50 px-3 "
                              style={{
                                maxWidth: "100px",
                              }}
                            >
                              <pre>{location}</pre>

                              <button
                                className="min-w bg-grey-100 h-full  rounded-full"
                                onClick={() => deleteFromLocation(i)}
                              >
                                <GrClose />
                              </button>
                            </span>
                          ))}
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              className="
                           h-8 border-none outline-none
                           ring-offset-white 
                           focus-visible:ring-0
                          "
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();

                                  const inputValue = e.target.value.trim();

                                  if (inputValue !== "") {
                                    addFromLocation(inputValue);
                                  
                                  
                                   
                                  }
                                  e.target.value = "";
                                }
                              }}
                            />
                          </FormControl>
                        </div>

                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
               <FormField
                control={form.control}
                name="consigneeName"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                      consignee Name :
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
                name="consigneeMobileNumber"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Consignee Mobile Number :
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
                name="unloadingPoints"
                render={({ field }) => {
                  return (
                    <FormItem className="min-w flex items-center justify-center gap-4 ">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Unloading Points :
                      </FormLabel>
                      <div className="flex w-full  flex-col">
                        <div
                          className=" 
                         
                              flex
                            items-center gap-1   overflow-x-scroll rounded-md border  border-input px-3 py-0 text-sm  ring-offset-background active:outline-none  active:ring-2 
                            active:ring-offset-1


                         "
                        >
                          {toLocations.map((location, i) => (
                            <span
                              key={i}
                              className="flex h-8 items-center gap-1 rounded-lg  bg-blue-50 px-3 "
                              style={{
                                maxWidth: "100px",
                              }}
                            >
                              <pre>{location}</pre>

                              <button
                                className="min-w bg-grey-100 h-full  rounded-full"
                                onClick={() => deleteToLocation()}
                              >
                                <GrClose />
                              </button>
                            </span>
                          ))}
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              className="
                           h-8 border-none outline-none
                           ring-offset-white 
                           focus-visible:ring-0
                          "
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();

                                  const inputValue = e.target.value.trim();

                                  if (inputValue !== "") {
                                    addToLocation(inputValue);
                                  
                                  
                                   
                                  }
                                  e.target.value = "";
                                }
                              }}
                            />
                          </FormControl>
                        </div>

                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="way"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Way :
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
            <div className="md:column-span-1 row-span-1 -space-y-3 lg:space-y-2">
              <FormField
                control={form.control}
                name="material"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Material :
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
                name="quantity"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Quantity :
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
                name="quantityUnit"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        QuantityUnit :
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
                name="actualWeight"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Actual Weight :
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
                name="chargedWeight"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Charged Weight :
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
                name="rateAsPer"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Rate As Per :
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
                name="rate"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Rate :
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
                name="rateUnit"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        {" "}
                        Rate Unit :
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
                name="partyBhara"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Party Bhara :
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
            <div className="md:column-span-1 row-span-1 -space-y-3 lg:space-y-2">
              <FormField
                control={form.control}
                name="hideBhara"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
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
              />

              <FormField
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
              />

              <FormField
                control={form.control}
                name="paymentTerm"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Payment Term :
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
                name="advanceAmount"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Advance Amount :
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
                        Balance Amount :
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
              />
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        {" "}
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
                name="additionalCharges"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        {" "}
                        Additional Charges:
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
          <Button
            type="submit"
            className="mt-8 h-16 w-full self-center bg-black text-lg xl:w-1/3"
          >
           {isloading ? "Loading...": "Submit"}
           
          </Button>
        </form>
      </Form>
    </div>
  );


}