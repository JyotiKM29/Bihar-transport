"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import AdditionalChargers from './AdditionalChargers'
import FieldForm from "../../../component/FieldForm";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContextProvider";
import { useToast } from "../../../../components/ui/use-toast";

const chargesDetailsSchema = z.object({
  chargesName: z.string().optional(),
  days: z.coerce.number().optional(),
  rate: z.coerce.number().optional(),
  amount: z.coerce.number().optional(),
  remarks: z.string().optional(),
});

const eWayBillDetailsSchema = z.object({
  eWayBillNo: z.string(),
  eWayBillDate: z.coerce.date(),
  expDate: z.coerce.date(),
});

const consignorInvoiceDetailsSchema = z.object({
  isPODCompulsory: z.string(),
  consignorInvoiceDate: z.coerce.date(),
  consignorDeliveryNo: z.string(),
  consignorInvoiceNo: z.string(),
  valueOfGoods: z.coerce.number(),
  eWayBillDetails: eWayBillDetailsSchema,
});

// ------dispatch details------
const dispatchDetailsSchema = z.object({
  billtyType: z.string(),
  dispatchDate: z.coerce.date(),
  dispatchTime: z.string(),
  totalFreight: z.coerce.number(),
  consignorInvoiceDetails: consignorInvoiceDetailsSchema,
  dispatch: z.object({
    additionalRateForCompany: z.coerce.number(),
    chargesDetails: z.array(chargesDetailsSchema),
  }),
  ledgerBalanceOfParty: z.string(),
  remarks: z.string(),
});

// dispatchAdditionalDetailsSchema
const insuranceSchema = z
  .object({
    isInsured: z.enum(["Yes", "No"]),
    insuranceProvider: z.string().optional(),
    policyNo: z.string().optional(),
    policyAmount: z.coerce.number().optional(),
    claimAmount: z.coerce.number().optional(),
    brokerDetails: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.isInsured === "Yes") {
        return Boolean(data.insuranceProvider);
      }
      return true;
    },
    {
      message: "insuranceProvider is  required.",
      path: ["dispatch.dispatchAdditionalDetails.insurance.isInsured"],
    },
  );

const dispatchAdditionalDetailsSchema = z.object({
  deliveryType: z.string(),
  manualLRNo: z.string(),
  brokerCommission: z.coerce.number(),
  shippingRisk: z.string(),

  insurance: insuranceSchema,
});

// dispatchAdditionalRateSchema
const dispatchAdditionalRateSchema = z.object({
  chargesName: z.string().optional(),
  days: z.coerce.number().optional(),
  rate: z.coerce.number().optional(),
  amount: z.coerce.number().optional(),
  remarks: z.string().optional(),
});

const formSchema = z.object({
  adminId: z.string(),

  bookingId: z.string(),
  dispatch: z.object({
    isDispatched: z.coerce.boolean(),
    dispatchDetails: dispatchDetailsSchema,
    dispatchAdditionalDetails: dispatchAdditionalDetailsSchema,
    dispatchAdditionalRate: z.array(dispatchAdditionalRateSchema),
  }),
});

const DispatchVehicle = ({ params }) => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);


  const initialFormState = {
    adminId:'',
    
    // vehicleNo: undefined,
    bookingId: params?.vehicleno,
    dispatch: {
      isDispatched: true,
      dispatchDetails: {
        billtyType: undefined,
        dispatchDate: new Date().toISOString().split("T")[0],
        dispatchTime: undefined,
        totalFreight: undefined,
        consignorInvoiceDetails: {
          isPODCompulsory: undefined,
          consignorInvoiceDate: new Date().toISOString().split("T")[0],
          consignorDeliveryNo: undefined,
          consignorInvoiceNo: undefined,
          valueOfGoods: undefined,
          eWayBillDetails: {
            eWayBillNo: undefined,
            eWayBillDate: new Date().toISOString().split("T")[0],
            expDate: new Date().toISOString().split("T")[0],
          },
        },
        dispatch: {
          additionalRateForCompany: undefined,
          chargesDetails: [
            {
              chargesName: undefined,
              days: undefined,
              rate: undefined,
              amount: undefined,
              remarks: undefined,
            },
          ],
        },
        ledgerBalanceOfParty: undefined,
        remarks: undefined,
      },

      dispatchAdditionalDetails: {
        deliveryType: undefined,
        manualLRNo: undefined,
        brokerCommission: undefined,
        shippingRisk: undefined,

        insurance: {
          isInsured: undefined,
          insuranceProvider: undefined,
          policyNo: undefined,
          policyAmount: undefined,
          claimAmount: undefined,
          brokerDetails: undefined,
        },
      },

      dispatchAdditionalRate: [
        {
          chargesName: undefined,
          days: undefined,
          rate: undefined,
          amount: undefined,
          remarks: undefined,
        },
      ],
    },
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  const insurance = form.watch(
    "dispatch.dispatchAdditionalDetails.insurance.isInsured",
  );

  
    async function myhandleSubmit(value) {
   

      try {
        const res = formSchema.parse(value);
        console.log("solved", res);
      } catch (error) {
        console.log("hi", error);
      }

      // form.setValue('adminId', user?._id,)
      value.adminId=user?._id;
  
      setIsLoading(true);
  try {

    const response = await fetch("/api/dispatchbooking", {
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
      displayToast("Successfully dispatched", "✅");
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
   

<div className="max-w   w-full mt-14 rounded-2xl  bg-white px-4 py-4 shadow-md md:px-10 lg:my-4 lg:p-8 lg:px-20">
      <h2 className="mb-6 text-3xl font-semibold"> Dispatch Booking Form</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(myhandleSubmit)}
         
        >
         <div  className="flex flex-col xl:flex-row gap-8">
        <div className="flex w-full max-w-xl flex-col gap-0">

       
  <FieldForm
                  form={form}
                  name="dispatch.dispatchDetails.billtyType"
                  label="Billty Type"
                  type="text"
                />
                <FieldForm
                  form={form}
                  name="dispatch.dispatchDetails.dispatchDate"
                  label="Dispatch Date"
                  type="date"
                />
                <FieldForm
                  form={form}
                  name="dispatch.dispatchDetails.dispatchTime"
                  label="Dispatch Time"
                  type="text"
                />
                <FieldForm
                  form={form}
                  name="dispatch.dispatchDetails.totalFreight"
                  label="Total Freight"
                  type="number"
                />

<h2 className="mt-6 text-center text-2xl font-semibold">
                  Consignor Invoice Details
                </h2>
                <FieldForm
                  form={form}
                  name="dispatch.dispatchDetails.consignorInvoiceDetails.isPODCompulsory"
                  label="POD Compulsory (Yes/No)"
                  type="text"
                />
                <FieldForm
                  form={form}
                  name="dispatch.dispatchDetails.consignorInvoiceDetails.consignorInvoiceDate"
                  label="Consignor - Invoice Date"
                  type="date"
                />
                <FieldForm
                  form={form}
                  name="dispatch.dispatchDetails.consignorInvoiceDetails.consignorDeliveryNo"
                  label="Consignor - Delivery No"
                  type="text"
                />
                <FieldForm
                  form={form}
                  name="dispatch.dispatchDetails.consignorInvoiceDetails.consignorInvoiceNo"
                  label="Consignor - Invoice No"
                  type="text"
                />
                <FieldForm
                  form={form}
                  name="dispatch.dispatchDetails.consignorInvoiceDetails.valueOfGoods"
                  label="Value of Goods (Rs.)"
                  type="number"
                />

<h2 className="mt-6 text-center text-2xl font-semibold">
                    e-way Bill Details
                  </h2>
                  <FieldForm
                    form={form}
                    name="dispatch.dispatchDetails.consignorInvoiceDetails.eWayBillDetails.eWayBillNo"
                    label="E-Way Bill No"
                    type="text"
                  />
                  <FieldForm
                    form={form}
                    name="dispatch.dispatchDetails.consignorInvoiceDetails.eWayBillDetails.eWayBillDate"
                    label="E-Way Bill Date"
                    type="date"
                  />
                  <FieldForm
                    form={form}
                    name="dispatch.dispatchDetails.consignorInvoiceDetails.eWayBillDetails.expDate"
                    label="Exp-Date "
                    type="date"
                  />
 </div>

 <div className="flex w-full max-w-xl flex-col gap-0">
 

<h2 className="mt-6 text-center text-2xl font-semibold">
                  Additional Rate for Company
                </h2>
                <FieldForm
                  form={form}
                  name="dispatch.dispatchDetails.dispatch.additionalRateForCompany"
                  label="Additional Rate for Company"
                  type="number"
                />

<AdditionalChargers form={form} nameValue="dispatch.dispatchDetails.dispatch.chargesDetails" />

<div className="mt-8">
                <FieldForm
                  form={form}
                  name="dispatch.dispatchDetails.ledgerBalanceOfParty"
                  label="LedgerBalance of Party"
                  type="text"
                />
                <FieldForm
                  form={form}
                  name="dispatch.dispatchDetails.remarks"
                  label="Remarks"
                  type="text"
                />
              </div>

              <h2 className="mt-6 text-center text-2xl font-semibold">
              Additional Details
            </h2>
            <FieldForm
              form={form}
              name="dispatch.dispatchAdditionalDetails.deliveryType"
              label="Delivery Type"
              type="text"
            />
            <FieldForm
              form={form}
              name="dispatch.dispatchAdditionalDetails.manualLRNo"
              label="Manual LRNo "
              type="text"
            />
            <FieldForm
              form={form}
              name="dispatch.dispatchAdditionalDetails.brokerCommission"
              label="Broker Commission"
              type="number"
            />
            <FieldForm
              form={form}
              name="dispatch.dispatchAdditionalDetails.shippingRisk"
              label="Shipping Risk"
              type="text"
            />

            <FormField
              control={form.control}
              name="dispatch.dispatchAdditionalDetails.insurance.isInsured"
              render={({ field }) => {
                return (
                  <FormItem className="flex items-center justify-center gap-4">
                    <FormLabel className="text-nowrap text-sm lg:text-base">
                      Insurance :
                    </FormLabel>
                    <Select
                      className="flex flex-1 flex-col"
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {form.getValues(
              "dispatch.dispatchAdditionalDetails.insurance.isInsured",
            ) === "Yes" ? (
              <>
                {/* insurance */}
                <h2 className="mt-6 text-center text-xl font-semibold">
                  Insurance Details
                </h2>

                <FieldForm
                  form={form}
                  name="dispatch.dispatchAdditionalDetails.insurance.insuranceProvider"
                  label="Insurance Provider "
                  type="text"
                />
                <FieldForm
                  form={form}
                  name="dispatch.dispatchAdditionalDetails.insurance.policyNo"
                  label="Policy No"
                  type="text"
                />
                <FieldForm
                  form={form}
                  name="dispatch.dispatchAdditionalDetails.insurance.policyAmount"
                  label="Policy Amount"
                  type="number"
                />
                <FieldForm
                  form={form}
                  name="dispatch.dispatchAdditionalDetails.insurance.claimAmount"
                  label="Claim Amount"
                  type="number"
                />
                <FieldForm
                  form={form}
                  name="dispatch.dispatchAdditionalDetails.insurance.brokerDetails"
                  label="Broker Details"
                  type="text"
                />
              </>
            ) : (
              <>{/* Nothing */}</>
            )}

            <h2 className="mt-6 text-center text-2xl font-semibold">
                  Additional Chargers for Vehicle hired 
                </h2>
                <AdditionalChargers form={form} nameValue="dispatch.dispatchAdditionalRate" />

 </div>

 </div>

<div className="w-full flex justify-center items-center">
<Button type="submit" className='mt-8 w-full lg:w-1/3 '>{isloading ? "Loading..." : " Submit"}</Button>
</div>
 
        </form>
       
      </Form>
    </div>
    
  );
};

export default DispatchVehicle;
