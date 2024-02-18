"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FieldForm from "../../../component/FieldForm";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContextProvider";
import { useToast } from "../../../../components/ui/use-toast";

const formSchema = z.object({
  adminId: z.string(),
  paidAmount: z.coerce.number(),
  _id: z.string(),
  payMode: z.string(),

  paymentDate: z.coerce.date(),
  TDS: z.coerce.number(),
});

const CollectPayment = ({ params }) => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  const userId = user?._id;
  const vehicleId = params?.vehicleId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const response = await fetch(`/api/bookingdetails/${vehicleId}`, {
            method: "GET",
          });

          // console.log("response", response);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();

          setLoading(false);
          console.log(result.booking);

          setData(result);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [userId]);

  const initialFormState = {
    adminId: "",
    paidAmount: undefined,
    _id: params?.vehicleId,
    payMode: undefined,

    paymentDate: new Date().toISOString().split("T")[0],
    TDS: undefined,
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
      const response = await fetch("/api/accounting/collectAmount", {
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
    <div className="max-w max-h mt-14 rounded-2xl shadow-lg  bg-white px-4 py-4  md:px-10 lg:my-4 lg:p-8 lg:px-10">
      <h2 className="mb-8  text-3xl font-semibold">Collect Payment :</h2>

      <div className="max-h grid-col-1 grid max-w-full bg-sky-100 md:grid-cols-2 p-4 shadow-xl px-6 rounded-xl mb-8">
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">Consignor:</h2>
          <p className="mr-3 text-nowrap text-lg ">{data?.booking?.consignorName}</p>
        </label>
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">Consignee:</h2>
          <p className="mr-3 text-nowrap text-lg ">{data?.booking?.consigneeName}</p>
        </label>
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">Payment Liability:</h2>
          <p className="mr-3 text-nowrap text-lg ">{data?.booking?.paymentLiability}</p>
        </label>
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">Total Billing Amount
:</h2>
          <p className="mr-3 text-nowrap text-lg ">{data?.booking?.partyBhara}</p>
        </label>
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">Amount Received </h2>
          <p className="mr-3 text-nowrap text-lg ">{data?.booking?.advanceAmount}</p>
        </label>
        <label className="flex gap-2">
          <h2 className="mr-3 text-nowrap text-lg font-semibold ">Amount Pending </h2>
          <p className="mr-3 text-nowrap text-lg ">{data?.booking?.balanceAmount}</p>
        </label>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(myhandleSubmit)}>
          <FieldForm
            form={form}
            name="paidAmount"
            label="Paid Amount"
            type="number"
          />
          <FieldForm
            form={form}
            name="paymentDate"
            label="Payment Date"
            type="date"
          />
          <FieldForm form={form} name="TDS" label="TDS" type="number" />
          <FormField
            control={form.control}
            name="payMode"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap text-sm lg:text-base">
                    Paid Mode :
                  </FormLabel>
                  <Select
                    className="flex flex-1 flex-col"
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Paid By" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CASH">CASH</SelectItem>
                      <SelectItem value="BANK">BANK</SelectItem>
                      <SelectItem value="SBI">
                        STATE BANK OF INDIA (SBI){" "}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className=" my-8 flex items-center justify-center">
            <Button type="submit" className="h-14 text-lg w-full lg:w-1/3 ">
              {isloading ? "Loading..." : " Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CollectPayment;
