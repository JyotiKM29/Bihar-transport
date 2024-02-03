"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FieldForm from "../FieldForm";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
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
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";

const formSchema = z
  .object({
    adminId: z.string(),
    type: z.enum(["personal", "company"]),
    consignorData: z.object({
      email: z.string().optional(),
      consignorName: z.string().optional(),

      //personal
      contactNo: z.coerce.number().optional(),
      address: z.string().optional(),
      dob: z.coerce.date().optional(),

      //compnay
      gstin: z.string().optional(),
      officeNo: z.coerce.number().optional(),

      legalName: z.string().optional(),
      gstinStatus: z.string().optional(),
      principalPlaceOfBusiness: z.string().optional(),
      storeAddress: z.string().optional(),
      creditLimit: z.coerce.number().optional(),
      defaultPaymentTerm: z.string().optional(),
      payableReceivable: z.string().optional(),
      accountGroup: z.string().optional(),
      openingBalance: z.coerce.number().optional(),
      remarks: z.string().optional(),
    }),
  })
  .refine(
    (data) => {
      if (data.type === "personal") {
        return Boolean(data.consignorData.consignorName);
      }
      return true;
    },
    {
      message: "For personal type, consignorName is required.",
      path: ["consignorData.consignorName"],
    },
  )
  .refine(
    (data) => {
      if (data.type === "personal") {
        return Boolean(data.consignorData.email);
      }
      return true;
    },
    {
      message: "For personal type, email is required.",
      path: ["consignorData.email"],
    },
  )
  .refine(
    (data) => {
      if (data.type === "personal") {
        return Boolean(data.consignorData.contactNo);
      }
      return true;
    },
    {
      message: "For personal type, contactNo is required.",
      path: ["consignorData.contactNo"],
    },
  )
  .refine(
    (data) => {
      if (data.type === "company") {
        return Boolean(data.consignorData.email);
      }
      return true;
    },
    {
      message: "For company type, email is required.",
      path: ["consignorData.email"],
    },
  )
  .refine(
    (data) => {
      if (data.type === "company") {
        return Boolean(data.consignorData.consignorName);
      }
      return true;
    },
    {
      message: "For company type, consignorName is required.",
      path: ["consignorData.consignorName"],
    },
  )
  .refine(
    (data) => {
      if (data.type === "company") {
        return Boolean(data.consignorData.gstin);
      }
      return true;
    },
    {
      message: "For company type, gstin is required.",
      path: ["consignorData.gstin"],
    },
  )
  .refine(
    (data) => {
      if (data.type === "company") {
        return Boolean(data.consignorData.officeNo);
      }
      return true;
    },
    {
      message: "For company type, officeNo is required.",
      path: ["consignorData.officeNo"],
    },
  );

const NewRegistration = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);



  const initialFormState = {
    adminId: user?._id,
    type: "",
    consignorData: {
      email: "",
      consignorName: "",
      contactNo: 0,
      address: "",
      dob: undefined,
      gstin: "",
      officeNo: 0,

      legalName: undefined,
      gstinStatus: undefined,
      principalPlaceOfBusiness: undefined,
      storeAddress: undefined,
      officeNo: undefined,
      creditLimit: undefined,
      defaultPaymentTerm: undefined,
      payableReceivable: undefined,
      accountGroup: undefined,
      openingBalance: undefined,
      remarks: undefined,
    },
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  const type= form.watch('type');

  useEffect(()=>{
   
  },[type])

  async function myhandleSubmit(value, e) {
    // console.log("hey !");
    // console.log(value);

    try {
      const res = formSchema.parse(value);
      console.log("solved", res);
    } catch (error) {
      console.log("hi", error);
    }
  }

  return (
    <div className="mt-14 lg:my-4 max-w max-h  bg-white py-4 lg:p-8 px-4 md:px-10 lg:px-20 shadow-md rounded-md">
      <h2 className="text-3xl font-semibold mb-6"> New Regeratration </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(myhandleSubmit)}
          className="flex flex-col max-w-xl w-full gap-0"
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap text-sm lg:text-base">
                    Type :
                  </FormLabel>
                  <Select
                    className="flex flex-1 flex-col"
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FieldForm
            form={form}
            name="consignorData.consignorName"
            label="consignorName"
            type="text"
          />

          <FormField
            control={form.control}
            name="consignorData.email"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap text-sm lg:text-base">
                    email :
                  </FormLabel>
                  <div className="flex flex-1 flex-col">
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              );
            }}
          />

{form.getValues("type") === "personal" ? (
            <>
          <FieldForm
            form={form}
            name="consignorData.contactNo"
            label="contactNo"
            type="number"
          />
          <FieldForm
            form={form}
            name="consignorData.address"
            label="address"
            type="text"
          />
          <FieldForm
            form={form}
            name="consignorData.dob"
            label="dob"
            type="date"
          />
     
     </>
          ):(
            <>

          <FieldForm
            form={form}
            name="consignorData.gstin"
            label="gstin"
            type="text"
          />
          <FieldForm
            form={form}
            name="consignorData.officeNo"
            label="officeNo"
            type="number"
          />
           <FieldForm
                form={form}
                name="consignorData.gstinStatus"
                label="gstinStatus"
                type="text"
              />
              <FieldForm
                form={form}
                name="consignorData.principalPlaceOfBusiness"
                label="principalPlaceOfBusiness"
                type="text"
              />
              <FieldForm
                form={form}
                name="consignorData.storeAddress"
                label="storeAddress"
                type="text"
              />
              <FieldForm
                form={form}
                name="consignorData.officeNo"
                label="officeNo"
                type="text"
              />
              <FieldForm
                form={form}
                name="consignorData.creditLimit"
                label="creditLimit"
                type="number"
              />
              <FieldForm
                form={form}
                name="consignorData.defaultPaymentTerm"
                label="defaultPaymentTerm"
                type="text"
              />
              <FieldForm
                form={form}
                name="consignorData.payableReceivable"
                label="payableReceivable"
                type="text"
              />
              <FieldForm
                form={form}
                name="consignorData.accountGroup"
                label="accountGroup"
                type="text"
              />
              <FieldForm
                form={form}
                name="consignorData.openingBalance"
                label="openingBalance"
                type="text"
              />
              <FieldForm
                form={form}
                name="consignorData.remarks"
                label="remarks"
                type="text"
              />
            </>
          )}

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default NewRegistration;

// setIsLoading(true);
// try {
//   const response = await fetch("/api/consigerRegistration", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(value),
//   });
//   console.log(response);

//   const newResult = await response.json();

//   if (response.ok) {
//     setIsLoading(false);
//     displayToast("Successfully registered", "✅");
//     // const userDetail = newResult.user;
//     form.reset(initialFormState);
//   } else {
//     console.error("Error:", newResult.message);
//     displayToast("Error", "❌", newResult.message);
//     setIsLoading(false);
//   }
// } catch (error) {
//   console.error("Error:", error);
//   displayToast("Error while sending data", "❌", newResult.message);
//   setIsLoading(false);
// }
