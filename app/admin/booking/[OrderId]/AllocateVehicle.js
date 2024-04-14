"use client";
import SearchVehicle from "./SearchVehicle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FieldForm from "../../component/FieldForm";

import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
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
import PhotoForm from "../../vehicle/FieldForm";
import { Input } from "../../../components/ui/input";

const formSchema = z.object({
  adminId: z.string(),
  date:z.coerce.date(),
  vehicleNo: z.string(),
  vehicleType: z.string(),
  DriverDetails: z.object({
    driverName: z.string(),
    driverMobNo: z.coerce.number(),
}),
  // orderNo: z.coerce.number(),
  arrangedBy: z.string(),
  // transporterDetails: z.object({
  //   personName: z.string(),
  //   transporterMobNo: z.coerce.number(),
  // }),

  materialDetails:z.object({
    qty: z.coerce.number(),
    qtyUnit: z.string(),
    actualWgt: z.coerce.number(),
    actualWgtUnit:z.string(),

    rateAsPer: z.string(),
    rate:z.string(),
    chargedWgt:z.coerce.number(),
    chargedWgtUnit:z.string(),
    driverBhara: z.coerce.number(),
    commission: z.coerce.number(),
    netBhara: z.coerce.number(),
    
    ledgerBalance: z.string(),
    remarks:z.string(),

  }),


  payableLiability: z.string(),
  recievableLiability: z.string(),
  billTo: z.string(),
  
});

const AllocateVehicle = ({ params }) => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState(null);
  const userId = user?._id;

  function calNetBhara(DriverBhara, Commission) {
    const comValue = Number(DriverBhara) * Number(Commission);
    return Number(Number(DriverBhara) + Number(comValue));
  }

  const initialFormState = {
    adminId: "",
    vehicleNo: undefined,
    orderNo: params?.OrderId,
    arrangedBy: undefined,
    transporterDetails: {
      personName: undefined,
      transporterMobNo: undefined,
    },

    ledgerBalance: undefined,
    rateAsPer: undefined,
    paymentLiability: "",
    billTo: undefined,
    rate: undefined,
    driverBhara: undefined,
    commission: undefined,
    netBhara: undefined,
    ledgerBalanceParty: undefined,
    buildProof: undefined,
    remarks: undefined,
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  const DriverBhara = form.watch("driverBhara");
  const Commission = form.watch("commission");

  useEffect(() => {
    const value = calNetBhara(DriverBhara, Commission);

    form.setValue("netBhara", value);
  }, [Commission, DriverBhara]);

  async function myhandleSubmit(value) {
    try {
      const res = formSchema.parse(value);
      console.log("solved", res);
    } catch (error) {
      console.log("hi", error);
    }

    value.adminId = user?._id;

    setIsLoading(true);
    try {
      const response = await fetch("/api/vehicleAllocation", {
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
        displayToast("Successfully allocated vehicle", "✅");
        // const userDetail = newResult.user;
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

  useEffect(() => {
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
    fetchUnits();
  }, [userId]);

  return (
    <div className="max-w max-h mt-14 rounded-2xl  bg-white px-4 py-4  md:px-10 lg:my-4 ">
      <h2 className="mb-6 text-center text-red-600 text-xl font-semibold"> fill below detail for vehicle allocation</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(myhandleSubmit)}
          
        >
        <div className="grid w-full max-h-fit grid-cols-1 gap-6 xl:grid-cols-2 xl:space-x-6" >
          <div className="rounded-xl border px-6 py-4 shadow-md ">
            <h2 className="text-2xl font-medium text-blue-500 underline">
              Hired Vehicle Details
            </h2>

            <FieldForm
              form={form}
              name="date"
              label="Date "
              type="date"
            />
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

<div className="flex justify-center items-center ">
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
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                      
                      </FormLabel>
                    
                        <FormControl>
                          <Input
                            type="text"
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
                    <Select
                      className="flex flex-1 flex-col"
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger >
                          <SelectValue placeholder="Select  Arranged By " />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent >
                        <SelectItem value="Self">Self</SelectItem>
                        <SelectItem value="Other transporter">
                          Other transporter
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="rounded-xl border px-6 py-4 shadow-md ">
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
              <FormField
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
              />
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
                          <Input
                            type="text"
                            {...field}
                         
                          />
                        </FormControl>

                        <FormMessage />
                      </div>
                  </FormItem>
                );
              }}
            />
            <FieldForm form={form}  name="materialDetails.rate" label="Rate " type="text" />
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
            </div>
            <FieldForm
              form={form}
              name="materialDetails.driverBhara"
              label="Driver Bhara  (Rs)"
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
                    <Select
                      className="flex flex-1 flex-col"
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Commission Percentage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value=".02">2%</SelectItem>
                        <SelectItem value=".05">5%</SelectItem>
                        <SelectItem value=".08">8%</SelectItem>
                        <SelectItem value=".1">10%</SelectItem>
                        <SelectItem value=".12">12%</SelectItem>
                        <SelectItem value=".18">18%</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FieldForm
              form={form}
              name="materialDetails.netBhara"
              label="Net Bhara  (Rs) "
              type="number"
            />
            <FieldForm
              form={form}
              name="materialDetails.ledgerBalance"
              label="Ledger Balance "
              type="text"
            />

            <FieldForm
              form={form}
              name="materialDetails.remarks"
              label="Remarks "
              type="text"
            />
          </div>

          <div className="rounded-xl bg-red-300 p-4 shadow-xl  ">
            <FormField
              control={form.control}
              name="payableLiability"
              render={({ field }) => {
                return (
                  <FormItem className="flex items-center justify-center gap-4">
                    <FormLabel className="text-nowrap text-sm lg:text-base">
                      Payable Liability :
                    </FormLabel>
                    <Select
                      className="flex flex-1 flex-col"
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="border border-red-300 bg-red-200 focus-visible:ring-1">
                          <SelectValue placeholder="Select Payment Liability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border border-red-300 bg-red-200">
                        <SelectItem value="Vehicle Owner">
                          Vehicle Owner
                        </SelectItem>
                        <SelectItem value="Consignor">Consignor</SelectItem>
                        <SelectItem value="Arranged By">Arranged By</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Select
                      className="flex flex-1 flex-col"
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="border border-red-300 bg-red-200">
                          <SelectValue placeholder="Select Payment Liability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border border-red-300 bg-red-200">
                        <SelectItem value="Vehicle Owner">
                          Vehicle Owner
                        </SelectItem>
                        <SelectItem value="Consignor">Consignor</SelectItem>
                        <SelectItem value="Consignee">Consignee</SelectItem>
                        <SelectItem value="Third Party">Third Party</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="rounded-2xl border bg-blue-300 p-4 shadow-xl">
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
                          &#8377;
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

          <div className="w-full  grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-14 p-4 mt-4">
            <Button type="submit">
              {isloading ? "Loading..." : "Assign Vehicle Only"}
            </Button>
            <Button type="submit">{isloading ? "Loading..." : " Continue & Dispatch"}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AllocateVehicle;
