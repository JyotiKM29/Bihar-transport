'use client'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import React, { useContext, useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { UserContext } from "../../context/UserContextProvider";
import { useToast } from "../../components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import * as z from "zod";

const formSchema = z.object({
  bookingId: z.string(),
  adminId: z.string(),
  reason: z.string(),
})


const CancellationPop = ({bookingId}) => {

  const initialFormState = {
    adminId:"",
    reason: "",
    bookingId: bookingId,
  }
 
 
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useContext(UserContext);

  const userId = user?._id;

  const { reset, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  async function MyHandleSubmit(value) {
    console.log("hey");
    value.adminId = userId;
    // console.log("Jyoti", value.adminId)
    console.log(value);
    setLoading(true);

    try {
      setLoading(true);

      const response = await fetch("/api/cancelBooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      const result = await response.json();

      if (response.ok) {
        displayToast("Product Added Successfully", "✅" );
      } else {
        console.error("Error:", result.message);
        displayToast("Failed to add product", "❌", result.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
      displayToast("Server Error", "❌", error.message);
    } finally {
      setLoading(false);
    }
  }




  return (
    <Dialog >
    <DialogTrigger asChild>
      <span > Cancel Booking</span>
    </DialogTrigger>
    <DialogContent className='w-[80vw]' >
    <div className="h-full w-full rounded-3xl  bg-white ">
      <h2 className="font-semiBold text-center mt-12 text-3xl lg:mt-4 text-blue-800 lg:font-medium">
      Why do you want to cancel the booking ?
      </h2>
    
      
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(MyHandleSubmit)}
          className="flex flex-col "
        >
        <div className="grid    px-4 ">

       
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap  text-sm lg:text-base">
                   Reason:
                  </FormLabel>
                  <div className="flex flex-1 flex-col">
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              );
            }}
          />
           
         </div> 

         <Button type="submit" className='text-lg w-full mt-10 px-20 py-6 bg-orange-700 hover:bg-orange-800'>
          {loading ? "Adding..." : "Add Vehicle Type"}</Button>

         
       
          
        </form>
      </Form>
   
    </div>
    </DialogContent>
  </Dialog>
  )
}

export default CancellationPop