"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../../components/ui/button";
import { Form, FormField } from "../../../components/ui/form";
import { useContext,useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";
import InflationChart from "./InflationChart";
import SearchVOD from "./SearchVOD";

const formSchema = z.object({
  adminId: z.string(),
  vehicleNo: z.string(),
  
});

const VehicleNoBooking = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);

 

  const initialFormState = {
    adminId: "",
    vehicleNo: undefined,
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
      const response = await fetch("/api/report/vehicleNo", {
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
        console.log("New booking created!", newResult);
        setData(newResult.data);
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


  const dataBar =[data?.TotalBooking , data?.cancelledBooking , data?.pendingBooking , data?.confirmedBooking , data?.deleiveredBooking];
  const categoryBar = ["Total Booking" ,"Cancelled Booking" , "Pending Booking", "Confirm Booking" ,"Delivered Booking" ]


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
                name="vehicleNo" 
                
                render={({ field }) => (
                  <SearchVOD
                 
                    form={form}
                    field={field}
                    label='Vehicle No'
                  />
                )}
              />
          </div>
          
          <Button type="submit" className="w-full lg:w-1/3 ">
            {isloading ? "Loading..." : " Get Bookings"}
          </Button>
        </form>
      </Form>



{
  data && Object.keys(data).length > 0 && (
  
    <div className="max-h grid-col-1 grid max-w-full bg-teal-100 md:grid-cols-2 p-4 shadow-xl px-6 rounded-xl mb-8">
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">Total Booking:</h2>
          <p className="mr-3 text-nowrap text-lg "> {data.TotalBooking}</p>
        </label>
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">Cancelled Booking:</h2>
          <p className="mr-3 text-nowrap text-lg "> {data.cancelledBooking}</p>
        </label>
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">pending Booking:</h2>
          <p className="mr-3 text-nowrap text-lg "> {data.pendingBooking}</p>
        </label>
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">Confirm Booking:</h2>
          <p className="mr-3 text-nowrap text-lg "> {data.confirmedBooking}</p>
        </label>
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">Delivered Booking:</h2>
          <p className="mr-3 text-nowrap text-lg "> {data.deleiveredBooking}</p>
        </label>
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">Total Revenue:</h2>
          <p className="mr-3 text-nowrap text-lg "> {data.totalRevenue}</p>
        </label>
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">Total Commision:</h2>
          <p className="mr-3 text-nowrap text-lg "> {data.totalCommision}</p>
        </label>
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">Total Driver  Earnings:</h2>
          <p className="mr-3 text-nowrap text-lg "> {data.totalDriverBhara}</p>
        </label>
      
    </div>
  )
}
    

<div className="w-2/3 h-5/6" >
{(data && Object.keys(data).length > 0)? <InflationChart  data={dataBar} category={categoryBar}
  totalValue={data.TotalBooking}
/> : <p className="font-light text-red-700 ">No Booking  Data Available for this period. Select Dates</p>}
</div>


    </div>
  );
};

export default VehicleNoBooking;
