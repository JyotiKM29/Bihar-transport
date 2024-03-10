"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FieldForm from "../component/FieldForm";
import { Button } from "../../components/ui/button";
import SearchProduct from "./SearchProduct";
import SearchCustomer from "./SearchCustomer";
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
import Link from "next/link";

const formSchema = z.object({
  adminId: z.string(),
  quoteDate: z.coerce.date(),
  quoteValidity: z.coerce.date(),
  customerDetails: z.object({
    customerId: z.string(),
    customerName: z.string(),
    customerEmail: z.string(),
    customerPhone: z.string(),
    customerAddress: z.string(),
  }),
  product: z.object({
    productId: z.string(),
    productName: z.string(),
    productDescription: z.string(),
    productPrice: z.coerce.number(),
    quantity: z.coerce.number(),
  }),
});

const AddNew = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);

  const initialFormState = {
    adminId: "",

    remarks: undefined,
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
      const response = await fetch("/api/quote/create", {
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
        displayToast("Successfully added new expanse", "✅");
        // const userDetail = newResult.user;
        form.reset(initialFormState);
      } else {
        console.error("Error:", newResult.message);
        displayToast("Error", "❌ ", newResult.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      displayToast("Error", "❌ ", newResult.message);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(myhandleSubmit)}>
        <h2 className="text-center  text-xl font-semibold">
          New Expense Creation :
        </h2>

        <FormField
          control={form.control}
          name="serviceAccount"
          render={({ field }) => (
            <SearchCustomer form={form} field={field} label="Expense Account" />
          )}
        />

        <FormField
          control={form.control}
          name="serviceAccount"
          render={({ field }) => (
            <SearchProduct form={form} field={field} label="Expense Account" />
          )}
        />

        <FieldForm form={form} name="remarks" label="Remarks" type="text" />

        <div className="my-8 flex items-center justify-center">
          <Button
            type="submit"
            className="w-full rounded-lg bg-cyan-500 px-8 py-2 text-white shadow-md hover:bg-cyan-700 lg:w-1/3 "
          >
            {isloading ? "Loading..." : " Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddNew;
