"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../../components/ui/button";

import { useContext, useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";



const formSchema = z.object({
  adminId: z.string(),

  financeYear: z.string().refine((year) => {
    // Regular expression to match "YYYY-YYYY" format
    const yearRangeRegex = /^\d{4}-\d{4}$/;
    return yearRangeRegex.test(year);
  }, {
    message: 'Invalid year range format. Please provide in "YYYY-YYYY" format.'
  })
});

const FinanceYear = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);

  const initialFormState = {
    adminId: "",
    financeYear: undefined,
  };
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

//   const StartDate = form.getValues("financeYear");
//   console.log("Start Date : ", StartDate);

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
      const response = await fetch("/api/setting/financeYear", {
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
        // console.log("New booking created!", newResult);
        setData(newResult.data);
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
              name="financeYear"
              render={({ field }) => {
                return (
                  <FormItem className="flex items-center justify-center gap-4">
                    <FormLabel className="text-nowrap text-base ">
                      Finance Year :
                    </FormLabel>
                    <div className="flex flex-1 flex-col">
                      <FormControl>
                      <Input {...field} type='text'/>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                );
              }}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-500 text-white shadow-md hover:bg-emerald-700 lg:w-1/5 "
          >
            {isloading ? "Loading..." : " Set finance year"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FinanceYear;
