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
import UnitAdd from "./UnitAdd";




const formSchema = z.object({
  name :z.string(),
  length:z.coerce.number(),
  lengthUnit:z.string(),
  width:z.coerce.number(),
  widthUnit:z.string(),
  height:z.coerce.number(),
  heightUnit:z.string(),
  weight:z.coerce.number(),
  weightUnit:z.string(),
  capacity:z.string(),
  adminId:z.string(),
})

const VehicleTypePop = () => {
    const initialFormState = {
      name: undefined,
      length: undefined,
      lengthUnit: undefined,
      width: undefined,
      widthUnit: undefined,
      height: undefined,
      heightUnit: undefined,
      weight: undefined,
      weightUnit: undefined,
      capacity: undefined,
      adminId: "",
      }; 
    

      const [loading, setLoading] = useState(false);
      const { toast } = useToast();
      const { user } = useContext(UserContext);
      const [unitsData, setUnitsData] = useState([]);
      const userId = user?._id;

      
    useEffect(() => {
        fetchUnits(); 
    }, []);

  const handleUnitAdded = () => {
    fetchUnits(); // Fetch units data after a new unit is added
  };

    const fetchUnits = async () => {
        // Fetch units data from API
        try {
            const response = await fetch(`/api/getunits/${userId}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setUnitsData(data.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };
      
      
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
        console.log(value);
        setLoading(true);
    
        try {
          setLoading(true);
    
          const response = await fetch("/api/type/create", {
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
      <Button variant="outline"> + </Button>
    </DialogTrigger>
    <DialogContent className='w-[80vw]' >
    <div className="h-full w-full rounded-3xl  bg-white ">
      <h2 className="font-semiBold text-center mt-12 text-3xl lg:mt-4 text-orange-800 lg:font-medium">
        Add a New Vehicle Type:
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(MyHandleSubmit)}
          className="flex flex-col "
        >
        <div className="grid    px-4 ">

       
          <FormField
            control={form.control}
            name="name"
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
                name="capacity"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                      Capacity :
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

<div className="flex w-full items-center gap-0">
 <FormField
            control={form.control}
            name="length"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap text-sm lg:text-base">
                    Length:
                  </FormLabel>
                  <div className="flex flex-1 flex-col">
                    <FormControl>
                    <Input type="number" {...field}  className="rounded-bl rounded-br-[0px] rounded-tl rounded-tr-[0px]"/>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              );
            }}
          />

       


          <FormField
                control={form.control}
                name="lengthUnit"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                    
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                        <select
                            {...field}
                            className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                          >
                            <option value=""> Select Quantity Unit</option>
                            {Array.isArray(unitsData) &&
                              unitsData.map((unit) => (
                                <option key={unit.name} value={unit.name}>
                                  {unit.name}
                                </option>
                              ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}

              />
                  <UnitAdd onUnitAdded={handleUnitAdded} />
              </div>
 <div className="flex w-full items-center gap-0">

<FormField
                control={form.control}
                name="width"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        {" "}
                        Width :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input type="number" {...field} className="rounded-bl rounded-br-[0px] rounded-tl rounded-tr-[0px]" />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />

<FormField
                control={form.control}
                name="widthUnit"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                 
                      <div className="flex flex-1 flex-col">
                      <select
                            {...field}
                            className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                          >
                            <option value=""> Select Quantity Unit</option>
                            {Array.isArray(unitsData) &&
                              unitsData.map((unit) => (
                                <option key={unit.name} value={unit.name}>
                                  {unit.name}
                                </option>
                              ))}
                          </select>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />

               <UnitAdd onUnitAdded={handleUnitAdded} />
              </div>
               <div className="flex w-full items-center gap-0">

<FormField
                control={form.control}
                name="height"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        {" "}
                        Height :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input type="number" {...field} className="rounded-bl rounded-br-[0px] rounded-tl rounded-tr-[0px]" />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />

<FormField
                control={form.control}
                name="heightUnit"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                     
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                        <select
                            {...field}
                            className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                          >
                            <option value=""> Select Quantity Unit</option>
                            {Array.isArray(unitsData) &&
                              unitsData.map((unit) => (
                                <option key={unit.name} value={unit.name}>
                                  {unit.name}
                                </option>
                              ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />

               <UnitAdd onUnitAdded={handleUnitAdded} />
                </div>
 <div className="flex w-full items-center gap-0">
<FormField
                control={form.control}
                name="weight"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        {" "}
                        Weight :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input type="number" {...field}   className="rounded-bl rounded-br-[0px] rounded-tl rounded-tr-[0px]"/>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />

<FormField
                control={form.control}
                name="weightUnit"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                    
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                        <select
                            {...field}
                            className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                          >
                            <option value=""> Select Quantity Unit</option>
                            {Array.isArray(unitsData) &&
                              unitsData.map((unit) => (
                                <option key={unit.name} value={unit.name}>
                                  {unit.name}
                                </option>
                              ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />

               <UnitAdd onUnitAdded={handleUnitAdded} />
         
         </div> 
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