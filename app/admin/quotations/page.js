"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FieldForm from "../component/FieldForm";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import SearchExpenseCategory from './SearchExpenseCategory'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContextProvider";
import { useToast } from "../../components/ui/use-toast";


const formSchema = z.object({
    name:z.string(),
    adminId:z.string(),
})

const ManageExpense = () => {
    const { toast } = useToast();
    const [isloading, setIsLoading] = useState();
    const { user } = useContext(UserContext);

    const initialFormState = {
        name:undefined,
        adminId:'',
    }

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
          const response = await fetch("/api/accounting/createExpanseCategory", {
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
    <div className="max-w max-h mt-14 rounded-2xl  bg-white px-4 py-4 shadow-md md:px-10 lg:my-4 lg:p-8 lg:px-20">
      <h2 className="mb-4  text-xl font-semibold">Add New Expense Type :</h2>


      <Form {...form}>
      <form onSubmit={form.handleSubmit(myhandleSubmit)}>

      <FieldForm 
        form={form} 
        name="name" 
        label="Expense Type Name
"
         type="text" />

      <div className="flex items-center justify-center my-8">
          <Button type="submit" className="w-full lg:w-1/3 ">
            {isloading ? "Loading..." : " Submit"}
          </Button>
        </div>
      </form>
    </Form>

    </div>
  )
}

export default ManageExpense
