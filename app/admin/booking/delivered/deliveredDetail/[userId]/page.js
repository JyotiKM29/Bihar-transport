"use client";
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
  } from "../../../../../components/ui/form";
  import * as z from "zod";
  import { useState, useEffect, useContext } from "react";
  import { useToast } from "../../../../../components/ui/use-toast";
import { Button } from '@/app/components/ui/button';
import FieldForm from '@/app/admin/component/FieldForm';

  const chargeScheme = z.object({
    chargeName:z.string(),
    days:z.string(),
    rate:z.coerce.number(),
    amount:z.coerce.number(),
    remarks:z.string(),
  })

  const companyChargeSchema = z.object({
    chargeList: z.array(chargeScheme),
    totalFreight: z.coerce.number(),
    ledgerBalance: z.coerce.number(),
  })

  const vehicleChargeSchema = z.object({
    chargeList: z.array(chargeScheme),
    totalFreight: z.coerce.number(),
    ledgerBalance: z.coerce.number(),
  })


  const formSchema = z.object({
    CN : z.string(),
    // consignor: z.string(),
    // consignee: z.string(),
    // paymentLiability: z.string(),
    // totalBillingAmmount:z.coerce.number(),
    // AmountReceived:z.coerce.number(),

    // //Additional Chargers
    // chargesCompany: companyChargeSchema,
    // chargesVehicle: vehicleChargeSchema,


    // //delivery Details
    // reportingDate:z.coerce.date(),
    // uploadingDate:z.coerce.date(),
    // materialReceivedBy: z.string(),
    // phoneNo: z.coerce.number(),
    // stamp: z.enum(["yes","no"]),
    // sign: z.enum(["yes","no"]),

    // //payment details
    // LRDuesAmt: z.coerce.number(),
    // paymentModes: z.string(),
    // amountReceived: z.coerce.number(),
    // fine: z.coerce.number(),
    // finalDue:  z.coerce.number(),
    // remarks:  z.string(),


    // //Consignment Information
    // date:z.coerce.date(),
    // deliveryNo:z.string(),
    // fromLocation:z.string(),
    // toLocation:z.string(),
    // qty:  z.coerce.number(),
    // weight:  z.coerce.number(),
    // breakage:  z.coerce.number(),
    // excess:  z.coerce.number(),
    // shortage:  z.coerce.number(),
    // remarks: z.string(),
    // POD: z.string(),
    // Action: z.string(),




  })

const DeliveryForm = () => {
    const initialFormState = {
        CN: undefined,
     }

     const { toast } = useToast();
     const [isloading, setIsLoading] = useState();

     const { reset, ...form } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialFormState,
      });

      async function MyHandleSubmit(value) {
        console.log("hey");
        console.log(value);
      }

  return (
    <div className="max-w max-h  bg-white px-0 ">
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(MyHandleSubmit)}
        className="flex flex-col gap-5"
      >
         <FieldForm form={form} name="CN" label="Order No" type="string" />
              <div className="my-8 flex flex-1 flex-col items-center justify-center gap-2 lg:flex-row lg:gap-6">
            <Button
              type="submit"
              className=" h-16 w-full self-center  border-2 border-blue-600 bg-blue-100 text-lg text-blue-600 hover:text-white/90 xl:w-1/3"
            >
              {isloading ? "Loading..." : " Deliver Material"}
            </Button>
           
          </div>
        </form>
      </Form>
    </div>
  )
}

export default DeliveryForm