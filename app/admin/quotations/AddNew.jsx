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
  FormField,
 
} from "../../components/ui/form";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContextProvider";
import { useToast } from "../../components/ui/use-toast";


const formSchema = z.object({
  adminId: z.string(),
  quoteDate: z.coerce.date(),
  quoteValidity: z.coerce.date(),
  customerDetails: z.object({
    customerId: z.string(),
    customerName: z.string(),
    customerEmail: z.string().optional(),
    customerPhone: z.number().optional(),
    customerAddress: z.string().optional(),
  }),
  product: z.object({
    productId: z.string(),
    productName: z.string(),
    productDescription: z.string().optional(),
    productPrice: z.coerce.number().optional(),
    quantity: z.coerce.number().optional(),
  }),
});

const AddNew = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);

  const initialFormState = {
    adminId: "",
    quoteDate:new Date().toISOString().split("T")[0],
    quoteValidity:new Date().toISOString().split("T")[0],
    customerDetails:{
      customerId:generateUniqueId(),
      customerName:"",
      customerEmail:"",
      customerPhone:"",
      customerAddress:"",
    },
    product:{
      productId:undefined,
      productName:undefined,
      productDescription:undefined,
      productPrice:undefined,
      quantity:undefined,
    },
    
  };
  function generateUniqueId() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  async function myhandleSubmit(value) {
    console.log(formSchema.safeParse(value));
    const { customerDetails, ...rest } = value;
    const payload = {
      ...rest,
      adminId: user?._id,
    };
  
    // Conditionally add customerDetails if they contain meaningful information
    if (customerDetails && Object.values(customerDetails).some(val => val)) {
      payload.customerDetails = customerDetails;
    }
  
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
        displayToast("Successfully Added new Quatation", "✅");
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
          New Quatation :
        </h2>
        <FieldForm form={form} name="quoteDate" label="quoteDate" type="date" />
        <FieldForm form={form} name="quoteValidity" label="Quote Validity" type="date" />

<div className="flex gap-8 w-full">


<div className="flex-1">
<FormField
          control={form.control}
          name="customerDetails.customerName"
          render={({ field }) => (
            <SearchCustomer form={form} field={field} label="Customer" />
          )}
        />

<FieldForm form={form}  name="customerDetails.customerId" label="Customer Id" type="text" />

<FieldForm form={form}  name="customerDetails.customerEmail" label="Customer Name" type="email" />
<FieldForm form={form}  name="customerDetails.customerPhone" label="Customer Phone" type="number" />

<FieldForm form={form}  name="customerDetails.customerAddress" label="Customer Address" type="text" />

</div>
       
        
{/* 
        <FormField
          control={form.control}
          name="serviceAccount"
          render={({ field }) => (
            <SearchProduct form={form} field={field} label="Expense Account" />
          )}
        /> */}
        <div className="flex-1">

        <FieldForm form={form} name="product.productId" label="Product Id" type="text" />

        <FieldForm form={form} name="product.productName" label="Product Name" type="text" />

        <FieldForm form={form} name="product.productDescription" label="Product Description" type="text" />

        <FieldForm form={form} name="product.productPrice" label="Product Price" type="number" />

        <FieldForm form={form} name="product.quantity" label="Quantity" type="number" />
        </div>
</div>
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
