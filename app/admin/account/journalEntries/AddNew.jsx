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
  entryDate: z.coerce.date(),
  fromAccount: z.string(),
  fromAmount:z.coerce.number(),

  toAccount: z.string(),
  toAmount:z.coerce.number(),


  narration: z.string(),
});

const AddNew = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);

  const initialFormState = {
    entryDate:new Date().toISOString().split("T")[0],
    fromAccount: undefined,
    fromAmount: undefined,
    toAccount:undefined,
    toAmount: undefined,
    narration:undefined ,

   
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
        New Journal Entry :
        </h2>
        <FieldForm 
        form={form} 
        name="entryDate" 
        label="Entry Date"
         type="date" />

<FieldForm 
        form={form} 
        name="fromAccount" 
        label="From Account"
         type="text" />


        <FieldForm 
        form={form} 
        name="fromAmount" 
        label="From Amount"
         type="number" />

        <FieldForm 
        form={form} 
        name="toAccount" 
        label="To Account "
         type="text" />


        <FieldForm 
        form={form} 
        name="toAmount" 
        label="To Amount"
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
