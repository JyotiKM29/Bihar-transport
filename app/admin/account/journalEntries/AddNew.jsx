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
import { Input } from "../../../components/ui/input";

const formSchema = z.object({
 adminId:z.string(),
 date:z.coerce.date(),
 from:z.string(),
 to:z.string(),
 debit:z.coerce.number(),
 credit:z.coerce.number(),
 narration:z.string(),

});

const AddNew = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);

  const initialFormState = {
  
    adminId:'',
 date:new Date().toISOString().split("T")[0],
 from:undefined,
 to:undefined,
 debit:undefined,
 credit:undefined,
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
        New Journal Entry :
        </h2>
        <FieldForm 
        form={form} 
        name="date" 
        label="Date"
         type="date" />




<div className=" flex flex-col md:flex-row w-full gap-4">
<div className="flex-1">
<FieldForm 
        form={form} 
        name="from" 
        label="From Account"
         type="text" />
</div>

<div className="flex-1">
<FieldForm 
        form={form} 
        name="debit" 
        label="Debit"
         type="number" />
</div>

       

</div>


<div className=" flex flex-col md:flex-row w-full gap-4">
<div className="flex-1">
<FieldForm 
        form={form} 
        name="to" 
        label="To Account"
         type="text" />
</div>

<div className="flex-1">
<FieldForm 
        form={form} 
        name="credit" 
        label="Credit"
         type="number" />
</div>

       

</div>

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
