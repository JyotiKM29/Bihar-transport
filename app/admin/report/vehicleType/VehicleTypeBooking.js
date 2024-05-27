"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../../components/ui/button";
import { useContext,useEffect,useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";
import InflationChart from "./InflationChart";
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

const formSchema = z.object({
  adminId: z.string(),
  vehicleType: z.string(),
  
});

const VehicleTypeBooking = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [vehicleType, setVehicleType] = useState();

  const userID = user?._id
 
//  console.log(userID);

  const initialFormState = {
    adminId: "",
    vehicleType: undefined,
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
      const response = await fetch("/api/report/vehicleType", {
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
        console.log("detail of vehicle type!", newResult);
        setData(newResult);
        console.log('data :',data )
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


  const dataBar =[data?.commission , data?.totalRevenue , data?.totalDriverBhara ];
  const categoryBar = ["Commission" ,"Total Revenue" , "Driver Bhara"]

  
  async function fetchVehicleType() {
    console.log('userId ', userID);
  
    try {
      const response = await fetch(`/api/report/vehicleType/${userID}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log('vehicle type', result);
      // Assuming result is the array of vehicle types. Adjust as per your actual structure.
      setVehicleType(result);
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
    }
  }

  useEffect(()=>{ 
  
    fetchVehicleType();

  },[userID])


  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(myhandleSubmit)}
          className="flex max-w-full flex-col items-center justify-between  gap-4 md:flex-row "
        >
          <div className="flex-1">
          <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => {
                return (
                  <FormItem className="flex items-center justify-center gap-4">
                    <FormLabel className="text-nowrap text-sm lg:text-base">
                    Vehicle Type  :
                    </FormLabel>
                    <Select
                      className="flex flex-1 flex-col"
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Vehicle Type " />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicleType?.map((vehicleType, index) => (
                          <SelectItem key={index} value={vehicleType}>
                            {vehicleType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          
          <Button type="submit" className="w-full lg:w-1/5 shadow-md bg-violet-500 hover:bg-violet-700 text-white ">
            {isloading ? "Loading..." : "Generate Report"}
          </Button>
        </form>
      </Form>



{
  data && Object.keys(data).length > 0 && (
  
    <div className="mt-6 max-h grid-col-1 grid max-w-full bg-violet-100 md:grid-cols-2 p-4 shadow-xl px-6 rounded-xl mb-8">
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">Total Vehicle:</h2>
          <p className="mr-3 text-nowrap text-lg "> {data.totalVehicle}</p>
        </label>
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">Total Booking:</h2>
          <p className="mr-3 text-nowrap text-lg "> {data.totalBooking}</p>
        </label>
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">Commission:</h2>
          <p className="mr-3 text-nowrap text-lg "> {data.commission}</p>
        </label>
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">Total Revenue:</h2>
          <p className="mr-3 text-nowrap text-lg "> {data.totalRevenue}</p>
        </label>
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">Total DriverBhara:</h2>
          <p className="mr-3 text-nowrap text-lg "> {data.totalDriverBhara}</p>
        </label>
       
      
    </div>
  )
}
    

<div className="w-2/3 h-5/6" >
{(data && Object.keys(data).length > 0)?
    <InflationChart  data={dataBar} category={categoryBar}
  totalValue={data.totalRevenue}
/>

 : <p className="font-light text-red-700 mt-3">No Data Available for this Vehicle Type. Select vehicle Type</p>}
</div>


    </div>
  );
};

export default VehicleTypeBooking;
