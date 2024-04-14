'use client'


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"

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
  productName: z.string(),
  hsnNo: z.string(),
  packageGroup: z.enum(["Personal", "General", "Other"]),
  packageType: z.enum([
    "Box",
    "Bag",
    "Basta",
    "Bundle",
    "Cartoon",
    "Carate",
    "Drums",
    "Loose",
    "Packet",
    "Roll",
    "TIN",
    "TON",
  ]),
  weightType: z.enum([
    "BAGS",
    "TEN NUMBERS/UNITS",
    "METERS",
    "KILO METERS",
    "HUNDRED NUMBERS/UNITS",
    "HUNDRED KILOMETERS",
    "DOZENS",
    "CENTI METERS",
    "BOXES",
    "BUNDLES",
    "TONNES",
    "KILO GRAMS",
    "QUINTALS",
    "GRAMS",
    "LITRES",
  ]),
  tax: z.coerce.number(),
  conversionFactor: z.string(),
});


const ProductList = () => {
    const initialFormState = {
        productName: "",
        hsnNo: "",
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
      <Button variant="outline">Add</Button>
    </DialogTrigger>
    <DialogContent >
    <div className="h-full w-full rounded-3xl bg-white px-6 py-4 shadow-sm">
      <h2 className="font-semiBold mt-12 text-3xl lg:mt-4 text-green-800 lg:font-medium">
        Add a New Product:
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(MyHandleSubmit)}
          className="flex flex-col "
        >
        <div className="flex flex-col  gap-1 px-4 ">

       
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap  text-sm lg:text-base">
                    Product Name :
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
            name="hsnNo"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap  text-sm lg:text-base">
                    HSN no :
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
            name="packageGroup"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap text-sm lg:text-base">
                    Package Group :
                  </FormLabel>
                  <div className="flex flex-1 flex-col">
                    <FormControl>
                      <select {...field}>
                        <option value="">Select Package Group</option>
                        <option value="Personal">Personal</option>
                        <option value="General">General </option>
                        <option value="Other ">Other </option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="packageType"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap text-sm lg:text-base">
                    Package Type :
                  </FormLabel>
                  <div className="flex flex-1 flex-col">
                    <FormControl>
                      <select {...field}>
                        <option value="">Select Package Type</option>
                        <option value="Box">Box</option>
                        <option value="Bag">Bag</option>
                        <option value="Basta">Basta</option>
                        <option value="Bundle">Bundle</option>
                        <option value="Cartoon">Cartoon</option>
                        <option value="Carate">Carate</option>
                        <option value="Drums">Drums</option>
                        <option value="Loose">Loose</option>
                        <option value="Packet">Packet</option>
                        <option value="Roll">Roll</option>
                        <option value="TIN">TIN</option>
                        <option value="TON">TON</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="weightType"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap text-sm lg:text-base">
                    Weight Type :
                  </FormLabel>
                  <div className="flex flex-1 flex-col">
                    <FormControl>
                      <select {...field}>
                        <option value="">Select Weight Type</option>

                        <option value="BAGS">BAGS</option>
                        <option value="TEN NUMBERS/UNITS">
                          TEN NUMBERS/UNITS
                        </option>
                        <option value="METERS">METERS</option>
                        <option value="KILO METERS">KILO METERS</option>
                        <option value="HUNDRED NUMBERS/UNITS">
                          HUNDRED NUMBERS/UNITS
                        </option>
                        <option value="HUNDRED KILOMETERS">
                          HUNDRED KILOMETERS
                        </option>
                        <option value="DOZENS">DOZENS</option>
                        <option value="CENTI METERS">CENTI METERS</option>
                        <option value="BOXES">BOXES</option>
                        <option value="BUNDLES">BUNDLES</option>
                        <option value="TONNES">TONNES</option>
                        <option value="KILO GRAMS">KILO GRAMS</option>
                        <option value="QUINTALS">QUINTALS</option>
                        <option value="GRAMS">GRAMS</option>
                        <option value="LITRES">LITRES</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="tax"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap  text-sm lg:text-base">
                    Tax :
                  </FormLabel>
                  <div className="flex flex-1 flex-col">
                    <FormControl>
                      <select {...field}>
                        <option value="">Select Tax</option>
                        <option value=".05">5% GST</option>
                        <option value=".10">10% GST </option>
                        <option value="0">Tax Free </option>
                        <option value="0 ">TCS</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="conversionFactor"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap  text-sm lg:text-base">
                    Conversion Factor:
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
           <div className="flex justify-start ml-4 ">

          
          <Button type="submit" className='text-lg mt-10 px-20 py-6 bg-green-700 hover:bg-green-800'>{loading ? "Adding..." : "Add Product"}</Button>
          </div>
        </form>
      </Form>
    </div>
    </DialogContent>
  </Dialog>
  )
}

export default ProductList