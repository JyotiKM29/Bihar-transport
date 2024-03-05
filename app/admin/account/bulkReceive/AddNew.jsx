"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FieldForm from "../../component/FieldForm";
import { Button } from "../../../components/ui/button";
import SearchLedger from './SearchLedger';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
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
  
  ledgerId: z.string(),

  recieveAmount: z.coerce.number(),

  receivedFrom: z.string(),

  paymentMode:z.string(),

  remarks: z.string(),
});

const AddNew = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);

  const initialFormState = {
    adminId:'',
    date:new Date().toISOString().split("T")[0],
  ledgerId: undefined,

  recieveAmount:undefined,
  receivedFrom:undefined,





  paymentMode:undefined ,

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
      const response = await fetch("/api/accounting/bulkReceive", {
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
        displayToast("New Bulk Created", "✅");
        // const userDetail = newResult.user;
        form.reset(initialFormState);
      } else {
        console.error("Error:", newResult.message);
        displayToast("Error", "❌ ", newResult.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      displayToast("Error : ", "❌", newResult.message);
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
        New Bulk receive :
        </h2>

        <FormField
                control={form.control}
                name="receivedFrom"
                
                render={({ field }) => (
                  <SearchLedger
                 
                    form={form}
                    field={field}
                    label='Received From'
                  />
                )}
              /> 
        <FieldForm 
        form={form} 
        name="date" 
        label="Received Date"
         type="date" />

        {/* <FieldForm 
        form={form} 
        label="Received From" 
        name="ledgerId"
         type="text" /> */}


        <FieldForm 
        form={form} 
        name="recieveAmount" 
        label="Received Amount  (Rs)"
         type="number" />
<FormField
            control={form.control}
            name="paymentMode"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap text-sm lg:text-base">
                  Paid By :
                  </FormLabel>
                  <Select
                    className="flex flex-1 flex-col"
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Paid By" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CASH">CASH</SelectItem>
                      <SelectItem value="BANK">BANK</SelectItem>
                      <SelectItem value="SBI">STATE BANK OF INDIA (SBI) </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

  

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
