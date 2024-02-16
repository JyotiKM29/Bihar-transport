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
  fromDate: z.coerce.date(),
  toDate:z.coerce.date(),

  search: z.string(),

  
});

const AddNew = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);

  const initialFormState = {
    fromDate:new Date().toISOString().split("T")[0],
    toDate:new Date().toISOString().split("T")[0],
    search:undefined,
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
         New Invoice Creation :
        </h2>

        <div className="flex items-center justify-between my-8">
        <FieldForm 
        form={form} 
        name="fromDate" 
        label="From Date"
         type="date" />
        <FieldForm 
        form={form} 
        name="toDate" 
        label="To Date"
         type="date" />

        <FieldForm 
        form={form} 
        label="Search" 
        name="search"
         type="text" />




          <Button type="submit" className="w-full lg:w-1/3 ">
            {isloading ? "Loading..." : " Search"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddNew;
