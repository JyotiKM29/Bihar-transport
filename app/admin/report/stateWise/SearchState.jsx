"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../../components/ui/button";
import StateData from "../../../../stateData.json";
import { useContext, useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";

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
  stateName:z.string(),
});

const SearchState = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);

  const dataBar = [
    data?.totalBooking,
    data?.confirmedBooking,
    data?.deliveredBooking,
    data?.cancelledBooking,
  ];
  const categoryBar = [
    "Total Booking",
    "Confirm Booking",
    "Delivered Booking",
    "Cancelled Booking",
  ];

  const initialFormState = {
    adminId: "",
    stateName:undefined,
  };
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  const StartDate = form.getValues("fromDate");
  const EndDate = form.getValues("toDate");

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
      const response = await fetch("/api/report/stateWise", {
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
        setData(newResult.sortedDistrictOrderCounts);
        console.log("data :", data);
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

  const stateNames = StateData.states.map((state) => state.state);

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
              name="stateName"
              render={({ field }) => {
                return (
                  <FormItem className="flex items-center justify-center gap-4">
                    <FormLabel className="text-nowrap text-sm lg:text-base">
                      State :
                    </FormLabel>
                    <Select
                      className="flex flex-1 flex-col"
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State " />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {stateNames.map((state, index) => (
                          <SelectItem key={index} value={state}>
                            {state}
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


      {/* Table */}
      <div className="overflow-x-scroll ">

     
      {data && Object.keys(data).length > 0 && (
  <table className="w-full mt-10 rounded ">
    <thead >
      <tr>
        <th className="border py-1 px-2 bg-blue-200">District</th>
        <th className="border py-1 px-2 bg-blue-200">Total Booking</th>
        <th className="border py-1 px-2 bg-blue-200">Confirm Booking</th>
        <th className="border py-1 px-2 bg-blue-200">Delivered Booking</th>
        <th className="border py-1 px-2 bg-blue-200">Cancelled Booking</th>
      </tr>
    </thead>
    <tbody>
      {Object.keys(data).map((district, index) => (
        <tr key={index}>
          <td className="border px-2 py-1 text-left pl-6 bg-gray-100">{district}</td>
          <td className="border px-2 py-1 text-center">{data[district].totalOrders}</td>
          <td className="border px-2 py-1 text-center">{data[district].confirmedOrders}</td>
          <td className="border px-2 py-1 text-center">{data[district].deliveredOrders}</td>
          <td className="border px-2 py-1 text-center">{data[district].canceledOrders}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}

</div>
     

    </div>
  );
};

export default SearchState;
