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
  adminId:z.string(),
 transferDate: z.coerce.date(),
  from: z.string(),

  to: z.string(),

  amount: z.coerce.number(),
  

  narration: z.string(),
});

const AddNew = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);

  const initialFormState = {
    adminId:user?._id,
    transferDate:new Date().toISOString().split("T")[0],
    from: undefined,

    to:undefined,

    amount:undefined ,

  

  narration:undefined,
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
      const response = await fetch("/api/accounting/createMoneyTransfer", {
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
        displayToast("Successfully registered", "✅");
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(myhandleSubmit)}>
        <h2 className="text-center  text-xl font-semibold">
        New Money Transfer(Contra) Entry :
        </h2>
        <FieldForm 
        form={form} 
        name="transferDate" 
        label="Transfer Date"
         type="date" />

        <FieldForm 
        form={form} 
        name="from" 
        label="From Account"
         type="text" />


        <FieldForm 
        form={form} 
        name="to" 
        label="To amount"
         type="text" />

        <FieldForm 
        form={form} 
        name="amount" 
        label=" amount"
         type="number" />



  
        <FormField
                control={form.control}
                name="narration"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-base ">
                      Narration :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Textarea  {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />




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
