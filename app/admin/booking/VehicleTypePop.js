'use client'


import {
  Dialog,
  DialogContent,

  DialogTrigger,
} from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"


import React, { useContext, useState } from "react";

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
    vehicleType: z.string(),
    noOfVehicle: z.coerce.number(),
    customNoOfVehicle: z.number().optional(),
    vehicleLength:  z.string(),
    vehicleCapacity: z.string(),
})

const VehicleTypePop = () => {
    const initialFormState = {
        vehicleType: undefined,
        noOfVehicle: undefined,
        customNoOfVehicle: undefined,
        vehicleLength:  undefined,
        vehicleCapacity: undefined,
      };
    

      const [loading, setLoading] = useState(false);
      const { toast } = useToast();
      const { user } = useContext(UserContext);
    
      const userId = user?._id;
      // user id
    
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
        console.log(value);
    
        setLoading(true);
    
        try {
          setLoading(true);
    
          const response = await fetch("/api/addproduct", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(value),
          });
    
          const result = await response.json();
    
          if (response.ok) {
            displayToast("Product Added Successfully", "✅");
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
     <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline"> + </Button>
    </DialogTrigger>
    <DialogContent >
    <div className="h-full w-full rounded-3xl bg-white px-6 py-4 ">
      <h2 className="font-semiBold text-center mt-12 text-3xl lg:mt-4 text-orange-800 lg:font-medium">
        Add a New Vehicle Type:
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(MyHandleSubmit)}
          className="flex flex-col "
        >
        <div className="flex flex-col  gap-1 px-4 ">

       
          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap  text-sm lg:text-base">
                    Vehicle Type:
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


 <FormField
            control={form.control}
            name="noOfVehicle"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap text-sm lg:text-base">
                    No of Vehicle :
                  </FormLabel>
                  <div className="flex flex-1 flex-col">
                    <FormControl>
                      <select {...field}>
                        <option value="">Select No of Vehicle</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="others">Others</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              );
            }}
          />

          {form.watch("noOfVehicle") === "others" && (
            <FormField
              control={form.control}
              name="customNoOfVehicle"
              render={({ field }) => {
                return (
                  <FormItem className="flex items-center justify-center gap-4">
                    <FormLabel className="text-nowrap text-sm lg:text-base">
                      Specify No of Vehicle :
                    </FormLabel>
                    <div className="flex flex-1 flex-col">
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                );
              }}
            />
          )}


          <FormField
                control={form.control}
                name="vehicleLength"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        {" "}
                        Vehicle Length:
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


<FormField
                control={form.control}
                name="vehicleCapacity"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        {" "}
                        Vehicle Weight Capacity:
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
           <div className="flex justify-start ml-4 w-full">

          
          <Button type="submit" className='text-lg w-full mt-10 px-20 py-6 bg-orange-700 hover:bg-orange-800'>
          {loading ? "Adding..." : "Add Vehicle Type"}</Button>
          </div>
        </form>
      </Form>
    </div>
    </DialogContent>
  </Dialog>
  )
}

export default VehicleTypePop