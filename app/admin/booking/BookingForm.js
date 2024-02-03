"use client";
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
import { useState, useEffect } from "react";
import { useToast } from "../../components/ui/use-toast";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

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
  material: z.string({ message: "Field is required" }).min(3),
  quantity: z.coerce
    .number({
      message: "Quantity is required",
    })
    .positive(),
  quantityUnit: z.string({ message: "Field is required" }),
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
  taxPercentage: z.coerce.number({
    message: "Field is required",
  }),
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
  additionalCharges: additionalChargeSchema,
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
    quantity: 0,
    quantityUnit: "",
    vehicleType: "",
    actualWeight: 0,
    chargedWeight: 0,
    rateAsPer: "",
    rate: 0,
    rateUnit: "",
    taxPercentage: 0,
    partyBhara: 0,
    hideBhara: false,
    paymentLiability: "",
    billTo: "",
    paymentTerm: "",
    advanceAmount: 0,
    balanceAmount: 0,
    payMode: "",
    transactionId: "",
    remarks: "",
    additionalCharges: {
      enabled: false,
      totalCharge: 0,
      chargers: [],
    },
    adminId: "",
  };

  const [showAddChargeForm, setShowAddChargeForm] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [chargers, setChargers] = useState([]);

  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();

  const { reset, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  function calPartyBhara(quantity, rate, additionalCharges, tax) {
    const total = Number(quantity) * Number(rate);
    // const gst = tax ;
    const totalWithGst = total * Number(tax);
    return totalWithGst + total + Number(additionalCharges);
  }
  function calBalanceAmount(advanceAmount, partyBhara) {
    return partyBhara - advanceAmount;
  }

  function calChargeAmount(chargeQty, chargeRate) {
    const qty = Number(chargeQty) || 0;
    const rate = Number(chargeRate) || 0;
    return qty * rate;
  }

  function calTotalChargers(chargers) {
    const total = Array.isArray(chargers)
      ? chargers?.reduce((acc, curr) => acc + curr.amount, 0)
      : 0;

    return Number(total);
  }

  const chargeRate = form.watch("additionalCharges.chargers.rate", 0);
  const chargeQty = form.watch("additionalCharges.chargers.qty", 0);
  const rate = form.watch("rate", 0);
  const tax = form.watch("taxPercentage", 0);
  const quantity = form.watch("quantity", 0);
  const advanceAmount = form.watch("advanceAmount", 0);
  const additionalCharges = form.watch("additionalCharges.totalCharge", 0);

  const chargeAmount = calChargeAmount(chargeQty, chargeRate);

  const partyBhara = calPartyBhara(quantity, rate, additionalCharges, tax);
  const balanceAmount = calBalanceAmount(advanceAmount, partyBhara);

  const totalCharge = calTotalChargers(chargers);


  useEffect(() => {
    form.setValue("additionalCharges.chargers.amount", chargeAmount);
    form.setValue("additionalCharges.totalCharge", totalCharge);
  }, [chargeRate, chargeQty, chargers, totalCharge]);

  useEffect(() => {
    form.setValue("partyBhara", partyBhara);
  }, [quantity, rate, additionalCharges, tax]);

  useEffect(() => {
    form.setValue("balanceAmount", balanceAmount);
  }, [partyBhara, advanceAmount, additionalCharges]);

  function generateUniqueId() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  const handleAddCharger = (e) => {
    e.stopPropagation();

    const newCharger = {
      name: form.getValues("additionalCharges.chargers.name"),
      rate: form.getValues("additionalCharges.chargers.rate"),
      qty: form.getValues("additionalCharges.chargers.qty"),
      amount: form.getValues("additionalCharges.chargers.amount"),
    };

    if (
      !newCharger.rate ||
      !newCharger.qty ||
      newCharger.name === "Select Charges"
    ) {
      displayToast(
        "Error",
        "❌",
        "fill in all fields before adding a charger.",
      );

      return;
    }

 

    setChargers([...form.getValues("additionalCharges.chargers"), newCharger]);
    form.setValue("additionalCharges.chargers" , [...form.getValues("additionalCharges.chargers"), newCharger]);

    console.log("Updated Chargers Array:", form.getValues("additionalCharges"));

    console.log("love");
    form.setValue("additionalCharges.enabled", true);
    setShowButton(true);

    console.log(
      "Total Charges :",
      form.getValues("additionalCharges.totalCharge"),
    );

    setShowAddChargeForm(false);

   
  };

  

  async function MyHandleSubmit(value) {
    form.setValue("additionalCharges.chargers", chargers);

    console.log("hey");
    console.log(value);

    setIsLoading(true);
    try {
      const response = await fetch("/api/createbooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      const newResult = await response.json();

      if (response.ok) {
        setIsLoading(false);
        displayToast(
          "Successfully Booked, Click view Booking button to view the booking",
          "✅",
        );
       
        await reset(initialFormState);
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

<div className="flex items-center gap-0">
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
                name="consigneeName"
                render={({ field }) => (
                  <SearchInput
                    form={form}
                    field={field}
                    personName="consigneeName"
                  />
                )}
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
            <div className="md:column-span-1 row-span-1 -space-y-3 lg:space-y-2">
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
                          <select {...field}>
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

              <div className="flex w-full items-center gap-0">
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
                  name="quantityUnit"
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
              <div className="flex items-center gap-0">
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
                  name="rateUnit"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center ">
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                            <select
                              {...field}
                              className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
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
              </div>

              {/* Tax Options */}

              <FormField
                control={form.control}
                name="taxPercentage"
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
                          <Input type="number" {...field} readOnly />
                        </FormControl>
                        <p className="-mt-2 text-[12px] text-slate-700">
                          Party bhara is Total Amount + 18% gst
                        </p>
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
              {/* additional Charges */}

              {showAdditional ? (
                <div>
                  <div className="flex flex-col items-center ">
                    <FormField
                      control={form.control}
                      name="additionalCharges.totalCharge"
                      render={({ field }) => {
                        const totalCharge = isNaN(field.value)
                          ? 0
                          : field.value;
                        return (
                          <FormItem className="flex items-center justify-center gap-4">
                            <FormLabel className="text-nowrap text-sm lg:text-base">
                              Additional Charges:
                            </FormLabel>
                            <div className="flex flex-1 flex-col">
                              <FormControl>
                                <Input
                                  type="number"
                                  value={field.value}
                                  {...field}
                                  readOnly
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          form.setValue("additionalCharges.chargers", []);
                          setChargers([]);
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAdditional(!showAdditional);
                          // form.setValue("additionalCharges.enabled", true);
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                  {chargers && chargers?.length > 0 && (
                    <table className="mx-2 my-4 w-full border">
                      <thead>
                        <tr className="w-full border bg-slate-50">
                          <th>Name</th>
                          <th>Qty</th>
                          <th>Rate</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chargers.map((items, i) => (
                          <tr key={i} className="w-full text-center ">
                            <td>{items.name}</td>
                            <td>{items.qty}</td>
                            <td>{items.rate}</td>
                            <td>{items.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  <div className="flex flex-col items-center gap-3">
                    <p className="mt-2 font-semibold">
                      Please , Select Additional Charge
                    </p>
                    <div className="flex items-center gap-6">
                      <select
                        onChange={(e) =>
                          form.setValue(
                            "additionalCharges.chargers.name",
                            e.target.value,
                          )
                        }
                      >
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
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAddChargeForm(!showAddChargeForm);
                        }}
                      >
                        Add charger
                      </Button>
                    </div>
                  </div>
                  {showAddChargeForm && (
                    <div className="flex flex-col  ">
                    <FormField
                control={form.control}
                name="additionalCharges.chargers.rate"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                      Rate :
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
                name="additionalCharges.chargers.qty"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                      Quantity :
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
                name="additionalCharges.chargers.amount"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                      Amount :
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
                    
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => handleAddCharger(e)}
                      >
                        Add additional Charge
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {showButton ? (
                    <div>
                      <FormField
                        control={form.control}
                        name="additionalCharges.totalCharge"
                        render={({ field }) => {
                          const totalCharge = isNaN(field.value)
                            ? 0
                            : field.value;
                          return (
                            <FormItem className="flex items-center justify-center gap-4">
                              <FormLabel className="text-nowrap text-sm lg:text-base">
                                Additional Charges:
                              </FormLabel>
                              <div className="flex flex-1 flex-col">
                                <FormControl>
                                  <Input
                                    type="number"
                                    value={field.value}
                                    {...field}
                                    readOnly
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          );
                        }}
                      />
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAdditional(!showAdditional);
                          form.setValue("additionalCharges.enabled", true);
                        }}
                        variant="outline"
                        className="w-full bg-slate-100"
                      >
                        update
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.nativeEvent.stopImmediatePropagation();
                        setShowAdditional(!showAdditional);
                        setShowButton(true);
                        form.setValue("additionalCharges.enabled", true);
                      }}
                      variant="outline"
                      className="w-full bg-slate-100"
                    >
                      Add Additional Charges
                    </Button>
                  )}
                </div>
              )}
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

//  const validationResult = chargersSchema.safeParse(newCharger);
