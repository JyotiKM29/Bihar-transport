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
  adminId: z.string(),
  date: z.coerce.date(),
  expenseCategory: z.string(),

  serviceAccount: z.string(),
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
    adminId: "",
    date:new Date().toISOString().split("T")[0],
    expenseCategory: undefined,

    serviceAccount:undefined,

    serviceCharge:undefined ,

    paidAmount:undefined,

  paidBy:undefined ,

  remarks:undefined,
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  async function myhandleSubmit(value) {
    console.log(formSchema.safeParse(value));

    try {
      const res = formSchema.parse(value);
      console.log("solved", res);
    } catch (error) {
      console.log("hi", error);
    }
    value.adminId = user?._id;
    try {
      const response = await fetch("/api/accounting/createExpanse", {
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
        displayToast("Successfully added new expanse", "✅");
        // const userDetail = newResult.user;
        form.reset(initialFormState);
      } else {
        console.error("Error:", newResult.message);
        displayToast("Error", "❌ ", newResult.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      displayToast("Error", "❌ ", newResult.message);
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
        name="serviceAccount" 
        label="Expense Account"
         type="text" />

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
