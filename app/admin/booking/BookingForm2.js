"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import FieldForm from "./FieldForm";

import * as z from "zod";
import { Button } from "../../components/ui/button";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContextProvider";
import { useToast } from "../../components/ui/use-toast";
import { Input } from "../../components/ui/input";
import { GrClose } from "react-icons/gr";

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
    date: '',
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

  const { user } = useContext(UserContext);
  const [fromLocations, setFromLocations] = useState([]);
  const [toLocations, setToLocations] = useState([]);
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
          className="grid grid-cols-1  lg:grid-cols-2 2xl:grid-cols-3  gap-x-10 xl:px-4"
        >

          <FieldForm
            form={form}
            name="orderNumber"
            type="number"
            label="Order Number"
          />
          <FieldForm form={form} name="date" type="date" label="Date" />

          <FieldForm
            form={form}
            name="vehicleRequiredDate"
            type="date"
            label="Vehicle Req Date"
          />
           <FieldForm 
           form={form} 
           name="consignorName"
            type="text"
             label="Consignor Name "
              />

           
           <FieldForm 
           form={form} 
           name="consignorMobileNumber"
            type="number"
             label=" Consignor Mobile No "
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
 <FieldForm 
           form={form} 
           name="consigneeName"
            type="text"
             label="consignee Name "
              />

           
           <FieldForm 
           form={form} 
           name="consigneeMobileNumber"
            type="number"
             label=" consignee Mobile No "
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
 <FieldForm
        form={form}
        name="way"
        label="Way"
        type="select"
        options={[
          { label: "Select Way", value: "" },
          { label: "One Way", value: "one way" },
          { label: "Two Way", value: "two way" },
          { label: "Return", value: "return" },
        ]}
      />



        {/* Material */}
        <FieldForm
        form={form}
        name="material"
        label="Material"
        type="text"
      />

      {/* Quantity */}
      <FieldForm
        form={form}
        name="quantity"
        label="Quantity"
        type="text"
      />

      {/* Quantity Unit */}
      <FieldForm
        form={form}
        name="quantityUnit"
        label="Quantity Unit"
        type="select"
        options={[
          { label: "Select Quantity Unity", value: "" },
          { label: "Kg (Kilo gram)", value: "Kg" },
          { label: "g (gram)", value: "g" },
          { label: "Km (Kilo meter)", value: "Km" },
          { label: "Km²", value: "Km2" },
          { label: "m", value: "m" },
          { label: "m²;", value: "m2" },
          { label: "tons", value: "tons" },
          { label: "pounds", value: "pounds" },
          { label: "L (liters)", value: "L" },
          { label: "m³", value: "m3" },
        ]}
      />

      {/* Vehicle Type */}
      <FieldForm
        form={form}
        name="vehicleType"
        label="Vehicle Type"
        type="text"
      />

      {/* Actual Weight */}
      <FieldForm
        form={form}
        name="actualWeight"
        label="Actual Weight"
        type="text"
      />

      {/* Charged Weight */}
      <FieldForm
        form={form}
        name="chargedWeight"
        label="Charged Weight"
        type="text"
      />

      {/* Rate As Per */}
      <FieldForm
        form={form}
        name="rateAsPer"
        label="Rate As Per"
        type="select"
        options={[
          { label: "Select Rate as Per", value: "" },
          { label: "Weight", value: "Weight" },
          { label: "Length", value: "Length" },
          { label: "Volume", value: "Volume" },
          { label: "Quantity", value: "Quantity" },
          { label: "Time", value: "Time" },
          { label: "Area", value: "Area" },
        ]}
      />

      {/* Rate */}
      <FieldForm
        form={form}
        name="rate"
        label="Rate"
        type="text"
      />

      {/* Rate Unit */}
      <FieldForm
        form={form}
        name="rateUnit"
        label="Rate Unit"
        type="select"
        options={[
          { label: "Select Rate Unit", value: "" },
          { label: "Weight", value: "Weight" },
          { label: "Length", value: "Length" },
          
          { label: "Volume", value: "Volume" },
          
        ]}
      />

      {/* Party Bhara */}
      <FieldForm
        form={form}
        name="partyBhara"
        label="Party Bhara"
        type="number"
      />

      {/* Hide Bhara */}
      <FieldForm
        form={form}
        name="hideBhara"
        label="Hide Bhara"
        type="text"
      />

      {/* Payment Liability */}
      <FieldForm
        form={form}
        name="paymentLiability"
        label="Payment Liability"
        type="select"
        options={[
          { label: "Select Payment Liability", value: "" },
          { label: "Consignor", value: "Consignor" },
          { label: "Consignee", value: "Consignee" },
         
          { label: "Third Party", value: "Third Party" },
          { label: "Vehicle Owner", value: "Vehicle Owner" },
         
        ]}
      />

      {/* Bill To */}
      <FieldForm
        form={form}
        name="billTo"
        label="Bill To"
        type="text"
      />

      {/* Payment Term */}
      <FieldForm
        form={form}
        name="paymentTerm"
        label="Payment Term"
        type="select"
        options={[
          { label: "Select a payment term", value: "" },
          { label: "Advance", value: "Advance" },
          { label: "Paid", value: "Paid" },
          { label: "To Pay", value: "To Pay" },
          { label: "To be Billed", value: "To be Billed" },
         
        ]}
      />

      {/* Advance Amount */}
      <FieldForm
        form={form}
        name="advanceAmount"
        label="Advance Amount"
        type="number"
      />

      {/* Balance Amount */}
      <FieldForm
        form={form}
        name="balanceAmount"
        label="Balance Amount"
        type="number"
      />

      {/* Pay Mode */}
      <FieldForm
        form={form}
        name="payMode"
        label="Pay Mode"
        type="text"
      />

      {/* Transaction Id */}
      <FieldForm
        form={form}
        name="transactionId"
        label="Transaction Id"
        type="text"
      />

      {/* Remarks */}
      <FieldForm
        form={form}
        name="remarks"
        label="Remarks"
        type="text"
      />

      {/* Additional Charges */}
      <FieldForm
        form={form}
        name="additionalCharges"
        label="Additional Charges"
        type="number"
      />

      

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
