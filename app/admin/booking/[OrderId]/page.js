"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FieldForm from "../FieldForm";
import { Input } from "../../../components/ui/input";
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

const formSchema = z.object({
  adminId: z.string(),
  vehicleNo: z.string(),
  orderNo: z.coerce.number(),
  arrangedBy: z.string(),
  transporterDetails: z.object({
    personName: z.string(),
    transporterMobNo: z.coerce.number(),
  }),

  ledgerBalance: z.string(),
  rateAsPer: z.string(),
  paymentLiability: z.string(),
  billTo: z.string(),
  rate: z.string(),
  driverBhara: z.coerce.number(),
  commission: z.coerce.number(),
  netBhara: z.coerce.number(),
  ledgerBalanceParty: z.string(),
  remarks: z.string(),
});

const AllocateVehicle = ({ params }) => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);

  function calNetBhara(DriverBhara, Commission) {
    const comValue = Number(DriverBhara) * Number(Commission);
    return Number(Number(DriverBhara) + Number(comValue));
  }

 

  const initialFormState = {
    adminId: user?._id,
    vehicleNo: "",
    orderNo: params?.OrderId,
    arrangedBy: "",
    transporterDetails: {
      personName: "",
      transporterMobNo: "",
    },

    ledgerBalance: "",
    rateAsPer: "",
    paymentLiability: "",
    billTo: "",
    rate: "",
    driverBhara: "",
    commission: "",
    netBhara: "",
    ledgerBalanceParty: "",
    remarks: "",
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

    setIsLoading(true);
try {
  const response = await fetch("/api/vehicleAllocation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(value),
  });
  console.log(response);

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

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  return (
    <div className="max-w max-h mt-14 rounded-md  bg-white px-4 py-4 shadow-md md:px-10 lg:my-4 lg:p-8 lg:px-20">
      <h2 className="mb-6 text-3xl font-semibold"> Vehicle Allocation </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(myhandleSubmit)}
          className="flex w-full max-w-xl flex-col gap-0"
        >
          <FieldForm
            form={form}
            name="vehicleNo"
            label="Vehicle No"
            type="text"
          />

          <FieldForm
            form={form}
            name="arrangedBy"
            label="ArrangedBy "
            type="text"
          />

          <FieldForm
            form={form}
            name="transporterDetails.personName"
            label="Transporter Name "
            type="text"
          />

          <FieldForm
            form={form}
            name="transporterDetails.transporterMobNo"
            label="Transporter Mobile No"
            type="number"
          />

          <FieldForm
            form={form}
            name="ledgerBalance"
            label="Ledger Balance "
            type="text"
          />

          <FormField
            control={form.control}
            name="rateAsPer"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap text-sm lg:text-base">
                    Rate as Per :
                  </FormLabel>
                  <Select
                    className="flex flex-1 flex-col"
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Rate as Per" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="weight">Weight</SelectItem>
                      <SelectItem value="distance">Distance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="PaymentLiability"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap text-sm lg:text-base">
                    Payment Liability :
                  </FormLabel>
                  <Select
                    className="flex flex-1 flex-col"
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Payment Liability" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
          <FieldForm form={form} name="billTo" label="Bill To " type="text" />
          <FieldForm form={form} name="rate" label="Rate " type="text" />
          <FieldForm
            form={form}
            name="driverBhara"
            label="Driver Bhara "
            type="number"
          />

          <FormField
            control={form.control}
            name="commission"
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
            name="netBhara"
            label="Net Bhara "
            type="number"
          />
          <FieldForm
            form={form}
            name="ledgerBalanceParty"
            label="Ledger Balance Party "
            type="text"
          />
          <FieldForm form={form} name="remarks" label="Remarks " type="text" />

          <Button type="submit">{isloading ? "Loading..." : " Submit"}</Button>
        </form>
      </Form>
    </div>
  );
};

export default AllocateVehicle;
