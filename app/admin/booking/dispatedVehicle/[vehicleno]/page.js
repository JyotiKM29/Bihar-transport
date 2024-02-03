"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FieldForm from "../../FieldForm";
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
  chargesName: z.string(),
  days:z.coerce.number(),
  rate:z.coerce.number(),
  amount:z.coerce.number(),
  remarks: z.string(),
})

const eWayBillDetailsSchema = z.object({
  eWayBillNo: z.string(),
  eWayBillDate: z.coerce.date(),
  expDate: z.coerce.date(),
});

const consignorInvoiceDetailsSchema= z.object({
  isPODCompulsory: z.string(),
  consignorInvoiceDate: z.coerce.date(),
  consignorDeliveryNo: z.string(),
  consignorInvoiceNo: z.string(),
  valueOfGoods: z.coerce.number(),
  eWayBillDetails: eWayBillDetailsSchema,
});

// ------dispatch details------
const dispatchDetailsSchema= z.object({
  billtyType: z.string(),
  dispatchDate: z.coerce.date(),
  dispatchTime: z.string(),
  totalFreight: z.coerce.number(),
  consignorInvoiceDetails:consignorInvoiceDetailsSchema,
  dispatch:z.object({
    additionalRateForCompany:z.coerce.number(),
    chargesDetails:z.array(chargesDetailsSchema),
  }),
  ledgerBalanceOfParty: z.string(),
  remarks: z.string(),
});




const formSchema = z.object({
  // adminId: z.string(),
  // vehicleNo: z.string(),
  bookingId: z.string(),
  dispatch: z.object({
  isDispatched: z.coerce.boolean(),
  dispatchDetails: dispatchDetailsSchema,
  // consignorInvoiceDetails: consignorInvoiceDetailsSchema,

  
  }),
});

const DispatchVehicle = ({ params }) => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);


  const initialFormState = {
    // adminId: user?._id,
    // vehicleNo: undefined,
    bookingId: undefined,
    dispatch:{
      isDispatched :true,
      dispatchDetails:{
        billtyType: undefined,
        dispatchDate:undefined,
        dispatchTime: undefined,
        totalFreight:undefined ,
        consignorInvoiceDetails:{
          isPODCompulsory: undefined,
          consignorInvoiceDate: undefined,
          consignorDeliveryNo: undefined,
          consignorInvoiceNo: undefined,
          valueOfGoods: undefined,
          eWayBillDetails:{
            eWayBillNo: undefined,
            eWayBillDate: undefined,
            expDate: undefined,
          }
        },
        dispatch:{
          additionalRateForCompany:undefined,
          chargesDetails:[
           { chargesName: undefined,
            days:undefined,
            rate:undefined,
            amount:undefined,
            remarks: undefined,}
          ]
        },
        ledgerBalanceOfParty:undefined ,
        remarks:undefined ,
      }
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  


  // functions
  function calAmountofdispatchAdditionalCharge(){

  }

  async function myhandleSubmit(value) {
    try {
      const res = formSchema.parse(value);
      console.log("solved", res);
    } catch (error) {
      console.log("hi", error);
    }
  }

  return (
    <div className="max-w max-h mt-14 rounded-md  bg-white px-4 py-4 shadow-md md:px-10 lg:my-4 lg:p-8 lg:px-20">
      <h2 className="mb-6 text-3xl font-semibold"> Dispatch Booking Form</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(myhandleSubmit)}
          className="flex w-full max-w-xl flex-col gap-0"
        >
          
          <FieldForm
            form={form}
            name="bookingId"
            label="Booking Id"
            type="text"
          /> 

          {/* dispatchDetails */}
          <>
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

          {/* consignorInvoiceDetails */}
          <>
            <h2 className="text-2xl text-center font-semibold mt-6">Consignor Invoice Details</h2>
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

          {/* eWayBillDetails */}
          <>
          <h2 className="text-2xl text-center font-semibold mt-6">e-way Bill Details</h2>
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
           </>
          </>

          {/* dispatch Info  */}
          <>
          <h2 className="text-2xl text-center font-semibold mt-6">Additional Rate for Company</h2>
          <FieldForm
            form={form}
            name="dispatch.dispatchDetails.dispatch.additionalRateForCompany"
            label="Additional Rate for Company"
            type="number"
          />
          {/* dispatch Info =====> chargesDetails */}
          <>
          <h2 className="text-xl text-center font-semibold mt-6">Additional Chargers Details</h2>
          <FieldForm
            form={form}
            name="dispatch.dispatchDetails.dispatch.chargesDetails[0].chargesName"
            label="Charges Name"
            type="text"
          />
          <FieldForm
            form={form}
            name="dispatch.dispatchDetails.dispatch.chargesDetails[0].days"
            label="Days"
            type="number"
          />
          <FieldForm
            form={form}
            name="dispatch.dispatchDetails.dispatch.chargesDetails[0].rate"
            label="Rate"
            type="number"
          />
          <FieldForm
            form={form}
            name="dispatch.dispatchDetails.dispatch.chargesDetails[0].amount"
            label="Amount"
            type="number"
          />
          <FieldForm
            form={form}
            name="dispatch.dispatchDetails.dispatch.chargesDetails[0].remarks"
            label="Remarks"
            type="text"
          />
          </>

          </>

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

           
      
          </>
         
         

          <Button type="submit">{isloading ? "Loading..." : " Submit"}</Button>
        </form>
      </Form>
    </div>
  );
};

export default DispatchVehicle;
