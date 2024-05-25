"use client";
import SearchVehicleType from "./SearchVehicleType";
import VehicleTypePop from "./VehicleTypePop";
import CartTable from "./CartTable";
import MaterialInfo from "./MaterialInfo";
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
import { useState, useEffect, useContext } from "react";
import { useToast } from "../../components/ui/use-toast";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import AdditionalChargers from "./AdditionalCharge";
import { UserContext } from "../../context/UserContextProvider";

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
  hsnNo: z.string().optional(),
  quantity: z.coerce.number().optional(),
  quantityUnit: z.string().optional(),
  actualWeight: z.coerce.number().optional(),
  actualWeightUnit: z.string().optional(),
  chargedWeight: z.coerce.number().optional(),
  chargedWeightUnit: z.string().optional(),
  rateAsPer: z.string().optional(),
  rateAsPerOption: z.string().optional(),
  rate: z.coerce.number().optional(),
  rateUnit: z.string().optional(),
  GSTPercentage: z.coerce.number().optional(),
  GSTType: z.enum(["RCM", "FCM"]).optional(),
  basicAmount: z.coerce.number().optional(),
  amount: z.coerce.number().optional(),
});

const formSchema = z.object({

  orderNumber: z.string({
    required_error: "Order number is required",
  }),
  date: z.coerce.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date format",
  }),
  vehicleRequiredDate: z.coerce.date({
    required_error: "Vehicle required date is required",
    invalid_type_error: "Invalid date format",
  }),
 
  bookingType: z.enum(["personal", "general", "company"], {
    errorMap: () => ({ message: "Select Booking Type" }),
  }),
  consignorName: z.string({
    required_error: "Consignor name is required",
  }),
  consignorMobileNumber: z.coerce.number({
    required_error: "Consignor mobile number is required",
    invalid_type_error: "Invalid number format",
  }),
  loadingPoints: z.array(z.string(), {
    required_error: "At least one loading point is required",
  }),
  consigneeName: z.string().optional({
    required_error: "Consignee name is required",
  }),
  consigneeMobileNumber: z.coerce.number({
    required_error: "Consignee mobile number is required",
    invalid_type_error: "Invalid number format",
  }),
  unloadingPoints: z.array(z.string(), {
    required_error: "At least one unloading point is required",
  }),
  way: z.enum(["one way", "two way", "return"], {
    errorMap: () => ({ message: "Select way" }),
  }),
  vehicleType: z.string({
    required_error: "Vehicle type is required",
  }),
  noOfVehicle: z.enum(["1", "2", "3", "others"], {
    errorMap: () => ({ message: "Select no of Vehicle" }),
  }),

  vehicleLength: z.coerce.number().optional(),
  vehicleLengthUnit: z.string().optional(),
  WeightCapacity: z.coerce.number().optional(),
  WeightCapacityUnit: z.string().optional(),
  customNoOfVehicle: z.number().optional(),
  partyBhara: z.coerce.number({
    required_error: "Party Bhara is required",
    invalid_type_error: "Invalid number format",
  }),
  paymentTerm: z.enum(["Advance", "Paid", "To Pay", "To be Billed"], {
    errorMap: () => ({ message: "Select payment term" }),
  }),
  remarks: z.string().optional(),
  itemsList: z.array(itemsSchema, {
    required_error: "Items list is required",
  }),
  additionalCharges: additionalChargeSchema,
  totalAdditionalChargeTax: z.coerce.number({
    required_error: "Total additional charge tax is required",
    invalid_type_error: "Invalid number format",
  }),
  totalAdditionalCharges: z.coerce.number({
    required_error: "Total additional charges are required",
    invalid_type_error: "Invalid number format",
  }),
  totalBillingAmount: z.coerce.number({
    required_error: "Total billing amount is required",
    invalid_type_error: "Invalid number format",
  }),
  adminId: z.string(),
  // isActive: z.boolean(),
});


const customErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === "string") {
      return { message: "bad type!" };
    }
  }
  if (issue.code === z.ZodIssueCode.custom) {
    return { message: `less-than-${(issue.params || {}).minimum}` };
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);

export default function ProfileForm() {
  const initialFormState = {
    orderNumber: generateUniqueId(),
    date: new Date().toISOString().split("T")[0],
    vehicleRequiredDate: new Date().toISOString().split("T")[0],
    bookingType: "",
    consignorName: undefined,
    consignorMobileNumber: 0,
    consignorID: "",
    loadingPoints: [""],
    consigneeName: undefined,
    consigneeMobileNumber: 0,
    unloadingPoints: [""],
    way: "",
    material: "",
    vehicleType: undefined,
    noOfVehicle: "",
    partyBhara: 0,
    paymentTerm: "",
    remarks: "",
    itemsList:[],
    
    additionalCharges: {
      enabled: false,
      totalCharge: 0,
      chargers: [],
    },
    totalAdditionalChargeTax: 0,
    totalAdditionalCharges: 0,
    totalBillingAmount: 0,
    adminId: "",
  };

  const route = useRouter();
  const [allocateVehicle, setAllocateVehicle] = useState(false);
  const [materialItems, setMaterialItems] = useState([]);
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const [isloadin2, setIsLoading2] = useState();
  const { user } = useContext(UserContext);

  const { reset, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });
  let CartItems = form.watch("itemsList");
  // const advanceAmount = form.watch("advanceAmount", 0);
  // const additionalCharges = form.watch("additionalCharges.totalCharge");
  const PartyBhara = form.watch("partyBhara", 0);

  //==========================================================
  useEffect(() => {
    // console.log("cart")
    setMaterialItems(CartItems);
  }, [CartItems]);

  function onDeleteItem(hsnRemove) {
    console.log("delete :", hsnRemove);
    const updatedItems = materialItems.filter(
      (item) => item.hsnNo !== hsnRemove,
    );

    form.setValue("itemsList", updatedItems);
  }


  const onEditItem = (updatedItem) => {
    const updatedItems = materialItems.map((item) =>
      item.hsnNo === updatedItem.hsnNo ? updatedItem : item,
    );
    setMaterialItems(updatedItems);
    form.setValue("itemsList", updatedItems);
  };


  function handleAddItem(newItem) {
    // setMaterialItems((prevItems) => {
    //   const items = Array.isArray(prevItems) ? prevItems : [];
    //   return [...items, newItem];
    // });

    setMaterialItems((items)=>[...items, newItem]);

    form.setValue("itemsList", materialItems);
    console.log("materialItems :", materialItems);
    console.log("ItemsList :", form.getValues("itemsList"));
  }

  //=======================================================================

  const totalAdditionalCharges = form.getValues("totalAdditionalCharges");
  const totalAdditionalChargeTax = form.watch("totalAdditionalChargeTax", 0);

  // useEffect(()=>{
  //   function calPartyBhara(PartyBhara) {

  // const total =  PartyBhara ;
  // console.log("party Bhara jyoti  :", total);

  //     form.setValue("partyBhara", total);
  //     return total;
  //   }

  //   calPartyBhara();

  // }, [PartyBhara])

  function caltotalBillingAmount(
    totalAdditionalCharges,
    PartyBhara,
    totalAdditionalChargeTax,
  ) {
    const total =
      Number(totalAdditionalCharges) +
      Number(PartyBhara) +
      Number(totalAdditionalChargeTax);

    console.log(totalAdditionalCharges, PartyBhara, totalAdditionalChargeTax);
    // console.log("Total Billing :", isNaN(total) ? 0 : total);
    form.setValue("totalBillingAmount", isNaN(total) ? 0 : total);
  }

  useEffect(() => {
    caltotalBillingAmount(
      totalAdditionalCharges,
      PartyBhara,
      totalAdditionalChargeTax,
    );
  }, [totalAdditionalCharges, PartyBhara, totalAdditionalChargeTax]);

  function generateUniqueId() {
    const value = Math.floor(100000 + Math.random() * 900000);

    return "BT" + value;
  }

  ///=======zod Error Checking====>
 
  const submitData = {
    adminId: "65abcb376d75c0783564ef39",
    orderNumber: "122431",
    date: "2024-02-01T12:00:00Z",
    bookingType: "personal",
    vehicleRequiredDate: "2024-02-10T12:00:00Z",
    consignorName: "John Doe",
    consignorMobileNumber: 1234567890,
    loadingPoints: ["Point A", "Point B"],
    consigneeName: "Jane Doe",
    consigneeMobileNumber: 9876543210,
    unloadingPoints: ["Point C", "Point D"],
    way: "one way",
    noOfVehicle: "2",
    vehicleType: "truck",
    partyBhara: 200,
    hideBhara: false,
    paymentLiability: "Consignor",
    billTo: "Consignee",
    paymentTerm: "Advance",
    advanceAmount: 3000,
    balanceAmount: 2000,
    payMode: "Online",
    transactionId: "abc123",
    remarks: "Some remarks",
    additionalCharges: {
      enabled: false,
      totalCharge: 21,
      chargers: [
        {
          name: "loading Charge",
          amount: 12,
          rate: 1,
          qty: 12,
        },
        {
          name: "loading Charge",
          amount: 1,
          rate: 1,
          qty: 1,
        },
        {
          name: "loading Charge",
          amount: 8,
          rate: 4,
          qty: 2,
        },
      ],
    },
    itemsList:[{
      GSTPercentage: "0.1",
      GSTType: "RCM",
      actualWeight: "12",
      actualWeightUnit: "Bag",
      amount: "2335",
      basicAmount: 0,
      chargedWeight: undefined,
      chargedWeightUnit: undefined,
      hsnNo: "67yu5i689opo",
      material: "cotton",
      quantity: "12",
      quantityUnit: "KILO GRAMS",
      rate: undefined,
      rateAsPer: undefined,
      rateAsPerOption: undefined,
      rateUnit: undefined,
    },
    {
      GSTPercentage: "0.1",
      GSTType: "RCM",
      actualWeight: "12",
      actualWeightUnit: "Bag",
      amount: "2335",
      basicAmount: 0,
      chargedWeight: undefined,
      chargedWeightUnit: undefined,
      hsnNo: "67yu5i689opo",
      material: "cotton",
      quantity: "12",
      quantityUnit: "KILO GRAMS",
      rate: undefined,
      rateAsPer: undefined,
      rateAsPerOption: undefined,
      rateUnit: undefined,
    }
  ],
    totalAdditionalChargeTax: 0,
    totalAdditionalCharges: 200,
    totalBillingAmount: 5000,
    isUrgent: true,
  };

  const itemsListData = [{
    GSTPercentage: "0.1",
    GSTType: undefined,
    actualWeight: "12",
    actualWeightUnit: "Bag",
    amount: "2335",
    basicAmount: undefined,
    chargedWeight: undefined,
    chargedWeightUnit: undefined,
    hsnNo: "67yu5i689opo",
    material: "cotton",
    quantity: "12",
    quantityUnit: "KILO GRAMS",
    rate: undefined,
    rateAsPer: undefined,
    rateAsPerOption: undefined,
    rateUnit: undefined,
  }];

  // console.log(formSchema.safeParse(submitData));

  async function MyHandleSubmit(value) {
    console.log("hey");
   

    value.adminId = user._id;
    console.log(value);
    setIsLoading(true);
    setIsLoading2(true);
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
      console.log(response);

      const newResult = await response.json();
      console.log(newResult);
      if (response.ok) {
        if (allocateVehicle) {
          console.log("hey", newResult.Booking.orderNumber);
          setIsLoading(false);
          setIsLoading2(false);
          displayToast("Successfully Booked,Ok", "✅");
          setAllocateVehicle(false);

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
        setIsLoading2(false);
      }
    } catch (error) {
      console.error("Error:", error);
      displayToast("Error while sending data", "❌", newResult.message);
      setIsLoading(false);
      setIsLoading2(false);
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
          <div className="grid grid-cols-1 space-x-6 space-y-2 rounded-xl border px-3 py-1 shadow-md lg:grid-cols-2">
            <FormField
              control={form.control}
              name="orderNumber"
              render={({ field }) => {
                return (
                  <FormItem className="flex items-center justify-center gap-4">
                    <FormLabel className="text-nowrap px-5 text-sm lg:text-base">
                      Order ID :
                    </FormLabel>
                    <div className="flex flex-1 flex-col">
                      <FormControl>
                        <Input type="string" {...field} />
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
          </div>
          <div className="grid grid-cols-2 space-x-6 space-y-1 rounded-xl border px-3 py-1 shadow-md">
            <div className=" flex items-center gap-0">
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
              <Link
                href="/admin/account"
                className="h-10 text-nowrap rounded-lg border bg-slate-100 px-4 py-2 text-base hover:bg-slate-200"
              >
                <FiPlus className="h-full w-full" />
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
              <Link
                href="/admin/account"
                className="h-10 text-nowrap rounded-lg border bg-slate-100 px-4 py-2 text-base hover:bg-slate-200"
              >
                <FiPlus className="h-full w-full" />
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

            {/* </div> */}
          </div>

          <div className="grid grid-cols-1 space-x-6 space-y-2  rounded-xl border px-3 py-1 shadow-md">
            <CartTable
              items={materialItems}
              onDelete={onDeleteItem}
              onEdit={onEditItem}
              form={form}
            />
          </div>

          <div className="flex flex-col gap-6 lg:flex-row ">
            {/* form */}
            <div className="flex flex-col gap-3 rounded-xl border px-6   py-3 shadow-md lg:w-1/2">
              <MaterialInfo
                form={form}
                nameValue="itemsList"
                onAddItem={handleAddItem}
                setMaterialItems={setMaterialItems}
              />
              <AdditionalChargers
                form={form}
                nameValue="additionalCharges.chargers"
                items={PartyBhara}
                materialItems={materialItems}
              />
            </div>
            {/* calculation */}

            <div className="flex flex-col gap-4 lg:w-1/2 ">
              <div className="rounded-xl border  px-8 py-1 shadow-md">
                <h2 className="mt-2 text-xl  font-medium text-blue-500 underline">
                  Additional Details
                </h2>
                <div className="grid grid-cols-1 ">
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

                  <div className="flex items-center">
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name="vehicleType"
                        render={({ field }) => (
                          <SearchVehicleType
                            // nameValue="vehicleType"
                            // items="items"
                            form={form}
                            field={field}
                            label="Vehicle Type"
                          />
                        )}
                      />
                    </div>
                    <VehicleTypePop />
                  </div>

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

                  {/* <FormField
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
               */}

                  <div className="hidden">
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
                      name="vehicleLengthUnit"
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
                      name="WeightCapacityUnit"
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
              </div>
              <div className="rounded-xl border  px-8 py-1 shadow-md">
                <h2 className="mt-2 text-xl  font-medium text-red-500 underline">
                  Billing Details
                </h2>
                <div className="grid grid-cols-1  gap-x-6 ">
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
                                <option value="To be Billed">
                                  To be Billed
                                </option>
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
                              <div className="mb-2 flex h-12 items-center justify-center gap-1 rounded bg-yellow-100 pl-2">
                                &#8377;
                                <Input
                                  type="number"
                                  {...field}
                                  className="border-none bg-yellow-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                                  readOnly
                                />
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
                              <div className="mb-2 flex h-12 items-center justify-center gap-1 rounded bg-yellow-100 pl-2">
                                &#8377;
                                <Input
                                  type="number"
                                  className="border-none bg-yellow-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                                  {...field}
                                />
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
                              <div className="mb-2 flex h-12 items-center justify-center gap-1 rounded bg-yellow-100 pl-2">
                                &#8377;
                                <Input
                                  type="number"
                                  className="border-none bg-yellow-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                                  {...field}
                                />
                              </div>
                            </FormControl>

                            <FormMessage />
                          </div>
                        </FormItem>
                      );
                    }}
                  />
                  <div className="  mb-3  rounded bg-amber-200 px-3 py-1">
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
                                <div className="mb-2 flex h-12 items-center justify-center gap-1 rounded bg-yellow-100 pl-2">
                                  &#8377;
                                  <Input
                                    type="number"
                                    {...field}
                                    className="border-none bg-yellow-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                                    readOnly
                                  />
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

          <div className="my-8 flex flex-1 flex-col items-center justify-center gap-2 lg:flex-row lg:gap-6">
            <Button
              type="submit"
              className=" h-16 w-full self-center  border-2 border-blue-600 bg-blue-100 text-lg text-blue-600 hover:text-white/90 xl:w-1/3"
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
