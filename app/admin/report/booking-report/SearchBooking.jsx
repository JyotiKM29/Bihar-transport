"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FieldForm from "../../component/FieldForm";
import { Button } from "../../../components/ui/button";
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
    fromDate:z.coerce.date(),
    toDate:z.coerce.date(),
 
  });

const SearchBooking = () => {
    const { toast } = useToast();
    const [isloading, setIsLoading] = useState();
    const { user } = useContext(UserContext);
  
    const initialFormState = {
  
      adminId: '',
       fromDate:new Date().toISOString().split("T")[0],
       toDate:new Date().toISOString().split("T")[0],
     
     
  
      
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
          const response = await fetch("/api/report/booking", {
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
            displayToast("Successfully", "✅");
           
            form.reset(initialFormState);
          } else {
            console.error("Error:", newResult.message);
            displayToast("Error", "❌", newResult.message);
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error:", error);
          displayToast("Error ", "❌", newResult.message);
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
      <FieldForm 
        form={form} 
        name="fromDate" 
        label="fromDate"
         type="date" />
      <FieldForm 
        form={form} 
        name="toDate" 
        label="toDate"
         type="date" />

      <Button type="submit" className="w-full lg:w-1/3 ">
            {isloading ? "Loading..." : " Submit"}
          </Button>
      </form>
    </Form>
  )
}

export default SearchBooking

