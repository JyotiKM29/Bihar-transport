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
import { useContext, useState, useEffect } from "react";
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
  way: z.enum(["one way", "two way", "return"]),
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
  paymentLiability: z.enum([
    "Consignor",
    "Consignee",
    "Third Party",
    "Vehicle Owner",
  ]),
  billTo: z.string({ message: "Field is required" }),
  paymentTerm: z.enum(["Advance", "Paid", "To Pay", "To be Billed"]),
  advanceAmount: z.coerce.number({
    message: "Field is required",
  }),
  balanceAmount: z.coerce.number({
    message: "Field is required",
  }),
  payMode: z.string({ message: "Field is required" }).min(2),
  transactionId: z.string({ message: "Field is required" }).min(3),
  remarks: z.string({ message: "Field is required" }).min(2),
  additionalCharges: z.coerce.number({
    message: "Field is required",
  }),
  adminId: z.string(),
});

export default function ProfileForm() {
  const initialFormState = {
    orderNumber: generateUniqueId(),
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
    partyBhara: 0,
    hideBhara: "",
    paymentLiability: "",
    billTo: "",
    paymentTerm: "",
    advanceAmount: 0,
    balanceAmount: 0,
    payMode: "",
    transactionId: "",
    remarks: "",
    additionalCharges: 0,
    adminId: "",
  };

  const [searchTerm, setSearchTerm] = useState();
  const [searchResult, setSearchResult] = useState();
  const { user } = useContext(UserContext);
  const [fromLocations, setFromLocations] = useState([]);
  const [toLocations, setToLocations] = useState([]);
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();

  const { reset, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  async function fetchData(value) {
    try {
      const res = await fetch(`/api/getbooking/${user._id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      console.log(result);
  
      if (result && Array.isArray(result.data)) {
        const results = result.data.filter((booking) => {
          // Make sure to use the correct property names based on your data structure
          const consigneeName = booking.consigneeName;
          
          return (
            value &&
            consigneeName &&
            consigneeName.toLowerCase().includes(value.toLowerCase())
          );
        });
        setSearchResult(results);
        console.log(searchResult);
      } else {
        console.log('Result is not an array or is undefined');
      }
    } catch (error) {
      console.log('Fetch failed', error);
    }
  };
  
  

  function handleChange(value) {
    setSearchTerm(value);
    fetchData(value);
  }

  function calPartyBhara(quantity, rate, additionalCharges) {
    const total = Number(quantity) * Number(rate);
    const gst = 0.18;
    const totalWithGst = total * gst;
    return totalWithGst + total + Number(additionalCharges);
  }

  function calBalanceAmount(advanceAmount, partyBhara) {
    return partyBhara - advanceAmount;
  }

  const rate = form.watch("rate", 0);
  const quantity = form.watch("quantity", 0);
  const advanceAmount = form.watch("advanceAmount", 0);
  const additionalCharges = form.watch("additionalCharges", 0);

  const partyBhara = calPartyBhara(quantity, rate, additionalCharges);
  const balanceAmount = calBalanceAmount(advanceAmount, partyBhara);

  useEffect(() => {
    form.setValue("partyBhara", partyBhara);
  }, [quantity, rate, additionalCharges]);

  useEffect(() => {
    form.setValue("balanceAmount", balanceAmount);
  }, [partyBhara, advanceAmount, additionalCharges]);

  function addFromLocation(value) {
    form.setValue("adminId", user._id);
    setFromLocations((prev) => {
      const newLocations = [...prev, value];
      form.setValue("loadingPoints", newLocations);
      console.log(newLocations);
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
      console.log(newLocations);
      return newLocations;
    });
  }
  function generateUniqueId() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  function deleteToLocation(index) {
    setToLocations((prevLocations) => {
      const newLocations = prevLocations.filter((_, i) => i !== index);
      form.setValue("unloadingPoints", newLocations);
      return newLocations;
    });
  }

  async function MyHandleSubmit(value) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/createbooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
      // console.log(response);

      const newResult = await response.json();

      if (response.ok) {
        setIsLoading(false);
        displayToast(
          "Successfully Booked, Click view Booking button to view the booking",
          "✅",
        );
        const userDetail = newResult.user;
        reset(initialFormState);
      } else {
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
                    <FormItem className=" flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        consignee Name :
                      </FormLabel>
                      <div className="relative flex flex-1 flex-col">
                        <FormControl>
                          {/* <Input type="text" {...field} /> */}
                          <Input
                            placeholder="Type to search..."
                            value={searchTerm}
                            onChange={(e) => handleChange(e.target.value)}
                            
                          />
                        </FormControl>

                        <FormMessage />
                        <div
                          className="min-h  absolute
                       top-12 overflow-y-scroll bg-slate-100 w-full rounded-sm"
                        >
                          {searchResult &&
                            Array.isArray(searchResult) &&
                            searchResult.length > 0 &&
                            searchResult.map((result, id) => (
                              <div key={id} className="hover:bg-slate-200 py-2 px-3 w-full" 
                              
                              >{result.consigneeName}</div>
                            ))}
                        </div>
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
                          <select
                            {...field}
                            className="h-10 rounded-md border bg-slate-50"
                          >
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
                        Quantity Unit :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <select
                            {...field}
                            className="h-10 rounded-md border bg-slate-50"
                          >
                            <option value="">Select Quantity Unity</option>
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
                          <select
                            {...field}
                            className="h-10 rounded-md border bg-slate-50"
                          >
                            <option value="">Select Rate as Per</option>
                            <option value="Weight">Weight </option>
                            <option value="Length">Length </option>
                            <option value="Third Volume">Volume</option>
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
                          <select
                            {...field}
                            className="h-10 rounded-md border bg-slate-50"
                          >
                            <option value="">Select Rate Unit</option>
                            <option value="Weight">Weight </option>
                            <option value="Length">Length </option>
                            <option value="Third Volume">Volume</option>
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
                name="partyBhara"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Party Bhara :
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
                          <select
                            {...field}
                            className="h-10 rounded-md border bg-slate-50"
                          >
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
                      <div className="flex flex-1 flex-col ">
                        <FormControl>
                          <select
                            {...field}
                            className="h-10 rounded-md border bg-slate-50"
                          >
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
                          <Input type="number" {...field} />
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
            {isloading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
