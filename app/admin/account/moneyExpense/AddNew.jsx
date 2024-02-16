"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FieldForm from "../../component/FieldForm";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";

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
  date: z.coerce.date(),
  expenseCategory: z.string(),

  expenseAccount: z.string(),
  serviceCharge: z.coerce.number(),
  paidAmount: z.coerce.number(),



  
  paidBy: z.string(),

  remarks: z.string(),
});

const AddNew = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);

  const initialFormState = {
    date:new Date().toISOString().split("T")[0],
    expenseCategory: undefined,

    expenseAccount:undefined,

    serviceCharge:undefined ,

    paidAmount:undefined,

  paidBy:undefined ,

  remarks:undefined,
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  function myhandleSubmit(value) {
    console.log(formSchema.safeParse(value));

    try {
      const res = formSchema.parse(value);
      console.log("solved", res);
    } catch (error) {
      console.log("hi", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(myhandleSubmit)}>
        <h2 className="text-center  text-xl font-semibold">
         New Expense Creation :
        </h2>
        <FieldForm 
        form={form} 
        name="date" 
        label="Date"
         type="date" />

        <FieldForm 
        form={form} 
        label="Expense Category" 
        name="expenseCategory"
         type="text" />


        <FieldForm 
        form={form} 
        name="expenseAccount" 
        label="Expense Account"
         type="number" />

        <FieldForm 
        form={form} 
        name="serviceCharge" 
        label="Service Charge "
         type="number" />


        <FieldForm 
        form={form} 
        name="paidAmount" 
        label="Paid Amount"
         type="text" />

        <FieldForm 
        form={form} 
        name="paidBy" 
        label="Paid By"
         type="text" />

        <FieldForm 
        form={form} 
        name="remarks" 
        label="Remarks"
         type="text" />

  


        <div className="flex items-center justify-center my-8">
          <Button type="submit" className="w-full lg:w-1/3 ">
            {isloading ? "Loading..." : " Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddNew;
