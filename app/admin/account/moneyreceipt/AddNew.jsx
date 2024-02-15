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
  receivedDate: z.coerce.date(),
  receivedFrom: z.string(),

  receivedAmount: z.coerce.number(),

  tdsAmount: z.optional(z.coerce.number()),

  discountAmount: z.optional(z.coerce.number()).default(0),

  paidBy: z.string(),

  narration: z.string(),
});

const AddNew = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);

  const initialFormState = {
    receivedDate:new Date().toISOString().split("T")[0],
  receivedFrom: undefined,

  receivedAmount:undefined,

  tdsAmount:undefined ,

  discountAmount:undefined,

  paidBy:undefined ,

  narration:undefined,
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
        New Money Receipt :
        </h2>
        <FieldForm 
        form={form} 
        name="receivedDate" 
        label="Received Date"
         type="date" />

        <FieldForm 
        form={form} 
        label="Received From" 
        name="receivedFrom"
         type="text" />


        <FieldForm 
        form={form} 
        name="receivedAmount" 
        label="Received Amount"
         type="number" />

        <FieldForm 
        form={form} 
        name="tdsAmount" 
        label="TDS Amount"
         type="number" />


        <FieldForm 
        form={form} 
        name="discountAmount" 
        label="Discount Amount"
         type="text" />

        <FieldForm 
        form={form} 
        name="paidBy" 
        label="Paid By"
         type="text" />

  
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
