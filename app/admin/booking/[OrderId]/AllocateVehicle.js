"use client";
import SearchVehicle from "./SearchVehicle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FieldForm from "../../component/FieldForm";
import UnitAdd from "../UnitAdd";


import { Button } from "../../../components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";

import { Input } from "../../../components/ui/input";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  adminId: z.string(),
  date: z.coerce.date(),
  vehicleNo: z.string(),
  vehicleType: z.string(),
  DriverDetails: z.object({
    driverName: z.string(),
    driverMobNo: z.coerce.number(),
  }),
  orderNo: z.string(),
  arrangedBy: z.string(),

  arrangedByName: z.string().optional(),
  arrangedByPhoneNo: z.coerce.number().optional(),

  materialDetails: z.object({
    qty: z.coerce.number(),
    qtyUnit: z.string(),
    actualWgt: z.coerce.number(),
    actualWgtUnit: z.string(),

    rateAsPer: z.string(),
    rate: z.string(),
    chargedWgt: z.coerce.number(),
    chargedWgtUnit: z.string(),

    availableWgt:z.coerce.number(),
    driverBhara: z.coerce.number(),
    commission: z.coerce.number(),
    netBhara: z.coerce.number(),

    ledgerBalance: z.coerce.number(),
    remarks: z.string(),
  }),

  payableLiability: z.string(),
  recievableLiability: z.string(),
  billTo: z.string(),
});

const AllocateVehicle = ({ params  }) => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [allocate , setAllocate] = useState(false);
  const route = useRouter();
  const [data, setData] = useState(null);
  const userId = user?._id;
  const orderId = params.OrderId;
  

 

  const initialFormState = {
    adminId: "",
    
    orderNo:params.OrderId,
    date: new Date().toISOString()?.split("T")[0],
    vehicleNo: undefined,
    vehicleType: undefined,
    DriverDetails: {
      driverName: undefined,
      driverMobNo: undefined,
    },

    arrangedBy: undefined,

    arrangedByName: undefined,
    arrangedByPhoneNo: undefined,

    // transporterDetails: z.object({
    //   personName: z.string(),
    //   transporterMobNo: z.coerce.number(),
    // }),

    materialDetails: {
      qty: undefined,
      qtyUnit: undefined,
      actualWgt: undefined,
      actualWgtUnit: undefined,

      availableWgt:undefined,

      rateAsPer: undefined,
      rate: undefined,
      chargedWgt: undefined,
      chargedWgtUnit: undefined,
      driverBhara: 0,
      commission: 0,
      netBhara: 0,

      ledgerBalance: 0,
      remarks: undefined,
    },

    payableLiability: undefined,
    recievableLiability: undefined,
    billTo: undefined,
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });
  
  const bookingID = form.getValues("bookingID");
  const DriverBhara = form.watch("materialDetails.driverBhara" , 0);
  const vehicleNo = form.watch("vehicleNo");
  let availableWgt = form.getValues("materialDetails.availableWgt");

  useEffect(()=>{
    availableWgt = form.getValues("materialDetails.availableWgt");
  }, [vehicleNo])

  function calNetBhara(driverBhara) {
    const commission = driverBhara * 0.05;
    form.setValue("materialDetails.commission", commission.toFixed(2));
    
    const netBhara =  driverBhara - commission;
    form.setValue("materialDetails.netBhara", netBhara.toFixed(2));
  }

  useEffect(() => {
    calNetBhara(DriverBhara);

    
  }, [DriverBhara]);

  async function myhandleSubmit(value) {
    try {
      const res = formSchema.parse(value);
      console.log("solved", res);
    } catch (error) {
      console.log("hi", error);
    }

    value.adminId = user?._id;

    console.log("hey bro: ", value);

    setIsLoading(true);
    try {
      const response = await fetch("/api/vehicleAllocation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
      

      const newResult = await response.json();

      if (response.ok) {
        setIsLoading(false);
        displayToast("Successfully allocated vehicle", "✅");
    

        if(allocate){
          console.log(allocate ,orderId  )
          route.push(`/admin/booking/${orderId}/print/${orderId}`);
        }
        form.reset(initialFormState);
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

    

  const displayToast = (title, action, description = undefined) => {
    toast({
      title,
      action,
      description,
    });
  };

   const fetchUnits = async () => {
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
    };

  useEffect(() => {
    fetchUnits();
  }, [userId]);

  const handleUnitAdded = () => {
    fetchUnits(); // Fetch units data after a new unit is added
  };



  return (
    <div className="max-w  mt-14 overflow-hidden rounded-2xl  bg-white px-4 py-4  md:px-10 lg:my-4 ">
      <h2 className="mb-6 text-center text-xl font-semibold text-red-600">
        {" "}
        fill below detail for vehicle allocation
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(myhandleSubmit)}>
          <div className="grid w-full  grid-cols-1  gap-6 xl:grid-cols-2  xl:space-x-6">
            <div className=" row-span-3 rounded-xl border px-6 py-4 shadow-md ">
              <h2 className="text-2xl font-medium text-blue-500 underline">
                Hired Vehicle Details
              </h2>
        

              <FieldForm form={form} name="orderNo" label="Order No" type="string" />
              <FieldForm form={form} name="date" label="Date " type="date" />
              <FormField
                control={form.control}
                name="vehicleNo"
                render={({ field }) => (
                  <SearchVehicle
                    nameValue="vehicleNo"
                    form={form}
                    field={field}
                    label="Vehicle No"
                  />
                )}
              />

              <FieldForm
                form={form}
                name="vehicleType"
                label="Vehicle Type "
                type="text"
              />

              <div className="flex items-center justify-center ">
                <div>
                  <FieldForm
                    form={form}
                    name="DriverDetails.driverName"
                    label="Driver Details "
                    type="text"
                  />
                </div>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="DriverDetails.driverMobNo"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex items-center justify-center gap-4">
                          <FormLabel className="text-nowrap text-sm lg:text-base"></FormLabel>

                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              placeholder="Driver Mobile No"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="arrangedBy"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Arranged By :
                      </FormLabel>

                      <FormControl>
                        <select {...field}>
                        <option value=''>Select Arranged By </option>
                          <option value="Self">Self</option>
                          <option value="Other transporter">
                            Other transporter
                          </option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {form.watch("arrangedBy") === "Other transporter" && (
                <>
                  <FieldForm
                    form={form}
                    name="arrangedByName"
                    label="Name "
                    type="text"
                  />
                  <FieldForm
                    form={form}
                    name="arrangedByPhoneNo"
                    label="Mobile No"
                    type="number"
                  />
                </>
              )}
            </div>

            <div className=" row-span-3 rounded-xl border px-6 py-4 shadow-md ">
              <h2 className="text-2xl font-medium text-blue-500 underline">
                Material & Freight Payable Details
              </h2>
              <div className="flex w-full items-center gap-0">
                <FormField
                  control={form.control}
                  name="materialDetails.qty"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center gap-4">
                        <FormLabel className="text-nowrap text-sm lg:text-base">
                          Qty :
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
                {/* <FormField
                  control={form.control}
                  name="materialDetails.qtyUnit"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-1 items-center justify-center ">
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                            <select
                              {...field}
                              className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                            >
                              <option value=""> Select Qty</option>
                              {Array.isArray(data) &&
                                data.map((unit) => (
                                  <option key={unit.name} value={unit.name}>
                                    {unit.name}
                                  </option>
                                ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                /> */}

<FormField
  control={form.control}
  name="materialDetails.qtyUnit"
  render={({ field }) => {
    return (
      <FormItem className="flex flex-1 items-center justify-center">
        <div className="flex flex-1 flex-col">
          <FormControl>
            <select
              {...field}
              className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
            >
              {/* Default option similar to the first component */}
              {/* <option key={qtyUnit}>
                {qtyUnit ? qtyUnit : "Select Quantity Unit"} */}
              {/* </option> */}

<option> Select QTY unit</option>

              {Array.isArray(data) &&
                data.map((unit) => (
                  <option key={unit.name} value={unit.name}>
                    {unit.name}
                  </option>
                ))}
            </select>
          </FormControl>
          <FormMessage />
        </div>
      </FormItem>
    );
  }}
/>

  <UnitAdd onUnitAdded={handleUnitAdded} />



              </div>

              <div className="flex w-full items-center gap-0">
                <FormField
                  control={form.control}
                  name="materialDetails.actualWgt"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center gap-4">
                        <FormLabel className="text-nowrap text-sm lg:text-base">
                          Actual Weight :
                        </FormLabel>
                        <div className="flex flex-1 flex-col relative">
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              className="rounded-bl rounded-br-[0px] rounded-tl rounded-tr-[0px]"
                            />
                            
                          </FormControl>
                          <p className="text-[12px] bg-orange-100 absolute bottom-1 w-full">Must less than {availableWgt}</p>
                          <FormMessage />
                         
                        </div>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="materialDetails.actualWgtUnit"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-1 items-center justify-center ">
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                            <select
                              {...field}
                              className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                            >
                              <option value=""> Select Unit of Weight </option>
                              <option value="kg">Kg</option>
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
  name="materialDetails.rateAsPer"
  render={({ field }) => {
    return (
      <FormItem className="flex items-center justify-center gap-4">
        <FormLabel className="text-nowrap text-sm lg:text-base">
          Rate as Per :
        </FormLabel>
        <div className="flex flex-1 flex-col">
          <FormControl>
            <select {...field}>
              <option value="" disabled>Select Rate As Per</option>
              <option value="actualWeight">Actual Weight</option>
              <option value="quantity">Quantity</option>
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
                name="materialDetails.rate"
                label="Rate "
                type="text"
              />
              <div className="flex w-full items-center gap-0">
                <FormField
                  control={form.control}
                  name="materialDetails.chargedWgt"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center gap-4">
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
                  name="materialDetails.chargedWgtUnit"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-1 items-center justify-center ">
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                            <select
                              {...field}
                              className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                            >
                              <option value=""> Select Unit of Weight </option>
                             <option value='kg'>Kg</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />
              </div>
              <FieldForm
                form={form}
                name="materialDetails.driverBhara"
                label="Driver Bhara ( &#8377;)"
                type="number"
              />

              <FormField
                control={form.control}
                name="materialDetails.commission"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Commission :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <div className="mb-2 flex h-12 items-center justify-center gap-1 rounded bg-yellow-100 pl-2">
                            <p className="text-xl font-medium">&#8377;</p>
                            <Input
                              type="text"
                              {...field}
                              className="border-none bg-yellow-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                              readOnly
                            />
                          </div>
                        </FormControl>
                        <p className="text-[12px] -mt-2">commision value is 5% of Driver Bhara</p>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="materialDetails.netBhara"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Net Bhara :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <div className="mb-2 flex h-12 items-center justify-center gap-1 rounded bg-yellow-100 pl-2">
                            <p className="text-xl font-medium">&#8377;</p>
                            <Input
                              type="text"
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
                name="materialDetails.ledgerBalance"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Ledger Balance :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <div className="mb-2 flex h-12 items-center justify-center gap-1 rounded bg-yellow-100 pl-2">
                            <p className="text-xl font-medium">&#8377;</p>
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

              <FieldForm
                form={form}
                name="materialDetails.remarks"
                label="Remarks "
                type="text"
              />
            </div>

            <div className=" row-span-1 rounded-xl bg-red-300 p-4 shadow-xl  ">
              <FormField
                control={form.control}
                name="payableLiability"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Payable Liability :
                      </FormLabel>

                      <FormControl>
                        <select
                          {...field}
                          className="border border-red-300 bg-red-200 focus-visible:ring-1"
                        >
                          <option value="">
                            Select Value Payable Liability{" "}
                          </option>
                          <option value="Vehicle Owner">Vehicle Owner</option>
                          <option value="Consignor">Consignor</option>
                          <option value="Arranged By">Arranged By</option>
                        </select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="recievableLiability"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Recievable Liability :
                      </FormLabel>

                      <FormControl>
                        <select
                          {...field}
                          className="border border-red-300 bg-red-200 focus-visible:ring-1"
                        >
                          <option value="">
                            Select Value of Recievable Liability{" "}
                          </option>
                          <option value="Vehicle Owner">Vehicle Owner</option>
                          <option value="Consignor">Consignor</option>
                          <option value="Consignee">Consignee</option>
                          <option value="Third Party">Third Party</option>
                        </select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="  rounded-2xl border bg-blue-300 p-4 shadow-xl">
              <FormField
                control={form.control}
                name="billTo"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Bill To
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <div className="mb-2 flex h-12 items-center justify-center gap-1 rounded bg-blue-100 pl-2">
                            <p className="text-xl font-medium">&#8377;</p>
                            <Input
                              type="text"
                              {...field}
                              className="border-none bg-blue-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                            />
                          </div>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>

          <div className="mt-4  grid w-full grid-cols-1 gap-4 p-4 xl:grid-cols-2 xl:gap-14">
            <Button type="submit"   onClick={(e) => {
                setAllocate(true);

              }}>
              {isloading ? "Loading..." : "Assign Vehicle Only"}
            </Button>
            <Button type="submit">
              {isloading ? "Loading..." : " Continue & Dispatch"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AllocateVehicle;
