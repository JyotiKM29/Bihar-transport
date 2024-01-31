"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import FieldForm from "./FieldForm";
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
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContextProvider";
import { useToast } from "../../components/ui/use-toast";

const chargersSchema = z.object({
  name: z.string(),
  amount: z.number(),
  rate: z.number(),
  qty: z.number(),
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
  additionalCharges: additionalChargeSchema.totalCharge,
  adminId: z.string(),
});

export default function ProfileForm() {
  const initialFormState = {
    orderNumber: generateUniqueId(),
    date: new Date().toISOString().split("T")[0],
    vehicleRequiredDate: new Date().toISOString().split("T")[0],
    consignorName: "",
    consignorMobileNumber: 0,
    loadingPoints: "",
    consigneeName: "",
    consigneeMobileNumber: 0,
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

  const [showAddChargeForm, setShowAddChargeForm] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);
  const [chargers, setChargers] = useState();

  const { user } = useContext(UserContext);
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();

  const { reset, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  function calPartyBhara(quantity, rate, additionalCharges) {
    const total = Number(quantity) * Number(rate);
    const gst = 0.18;
    const totalWithGst = total * gst;
    return totalWithGst + total + Number(additionalCharges);
  }
  function calBalanceAmount(advanceAmount, partyBhara) {
    return partyBhara - advanceAmount;
  }

  function calChargeAmount(chargeQty, chargeRate) {
    return chargeQty * chargeRate;
  }

  function calTotalChargers(chargers) {
    const total = chargers?.reduce((acc, curr) => acc + curr.amount, 0);
    //  console.log('total',total);
    return Number(total);
  }

  const chargeRate = form.watch("additionalCharges.chargers.rate", 0);
  const chargeQty = form.watch("additionalCharges.chargers.qty", 0);
  const rate = form.watch("rate", 0);
  const quantity = form.watch("quantity", 0);
  const advanceAmount = form.watch("advanceAmount", 0);
  const additionalCharges = form.watch("additionalCharges.totalCharge", 0);

  // const chargersAmount = form.watch("additionalCharges.totalCharge",0);

  const chargeAmount = calChargeAmount(chargeQty, chargeRate);

  const partyBhara = calPartyBhara(quantity, rate, additionalCharges);
  const balanceAmount = calBalanceAmount(advanceAmount, partyBhara);

  const totalCharge = calTotalChargers(chargers);

  useEffect(() => {
    form.setValue("additionalCharges.chargers.amount", chargeAmount);
    form.setValue("additionalCharges.totalCharge", totalCharge);
  }, [chargeRate, chargeQty, totalCharge]);

  useEffect(() => {
    form.setValue("partyBhara", partyBhara);
  }, [quantity, rate, additionalCharges]);

  useEffect(() => {
    form.setValue("balanceAmount", balanceAmount);
  }, [partyBhara, advanceAmount, additionalCharges]);

  function generateUniqueId() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  const handleAddCharger = () => {
    console.log("hi");
    const newCharger = {
      name: form.getValues("additionalCharges.chargers.name"),
      rate: form.getValues("additionalCharges.chargers.rate"),
      qty: form.getValues("additionalCharges.chargers.qty"),
      amount: form.getValues("additionalCharges.chargers.amount"),
    };

    const currentChargers = Array.isArray(
      form.getValues("additionalCharges.chargers"),
    )
      ? form.getValues("additionalCharges.chargers")
      : [];

    console.log("love", currentChargers);

    form.setValue("additionalCharges.chargers", [
      ...currentChargers,
      newCharger,
    ]);

    console.log("hi 4");

    // Log the updated chargers array
    console.log(
      "Updated Chargers Array:",
      form.getValues("additionalCharges.chargers"),
    );

    setChargers(form.getValues("additionalCharges.chargers"));

    setShowAddChargeForm(false);

    // Reset the form fields after adding a new charger
    form.reset({
      additionalCharges: {
        ...form.getValues("additionalCharges"),
        chargers: {
          name: "",
          rate: "",
          qty: "",
          amount: "",
        },
      },
    });
  };

  async function MyHandleSubmit(value) {
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
                render={({ field }) => (
                  <SearchInput
                    form={form}
                    field={field}
                    personName="consignorName"
                  />
                )}
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
              {/* additional Charges */}
              {showAdditional ? (
                <div>
                  <div className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name="additionalCharges.totalCharge"
                      render={({ field }) => {
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
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowAdditional(!showAdditional);
                        // form.setValue("additionalCharges.enabled", true);
                      }}
                    >
                      Close
                    </Button>
                  </div>
                  {chargers && chargers?.length > 0 && (
                    <table className="w-full border mx-2 my-4">
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

                  <div className="flex  flex-col items-center gap-3">
                    <p className="font-semibold ">
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
                      className="h-10 rounded-md border bg-slate-50 px-2"
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
                      variant="secondary"
                      // disabled={form.values?.additionalCharges.chargers.name === 'Select Charger'}
                      onClick={() => {
                        setShowAddChargeForm(!showAddChargeForm);
                      }}
                    >
                      Add charger
                    </Button>
                    </div>
                  </div>
                  {showAddChargeForm && (
                    <>
                      <div className="flex xl:flex-col  gap-3 xl:gap-0">
                        {/* <h2 className="text-nowrap">
                          
                          {additionalCharges.chargers?.name}:
                        </h2> */}
                        <FieldForm
                          form={form}
                          name="additionalCharges.chargers.rate"
                          label="Rate"
                          type="number"
                        />
                        <FieldForm
                          form={form}
                          name="additionalCharges.chargers.qty"
                          label="Qty"
                          type="number"
                        />
                        <FieldForm
                          form={form}
                          name="additionalCharges.chargers.amount"
                          label="Amount"
                          type="number"
                        />

                        <Button variant="outline" onClick={handleAddCharger}>
                          Add{" "}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div>
                  {additionalCharges.enabled === true && (
                    <FormField
                      control={form.control}
                      name="additionalCharges.totalCharge"
                      render={({ field }) => {
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
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                  )}

                  <Button
                    onClick={() => {
                      setShowAdditional(!showAdditional);
                      form.setValue("additionalCharges.enabled", true);
                    }}
                  >
                    Add Additional Charges
                  </Button>
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
