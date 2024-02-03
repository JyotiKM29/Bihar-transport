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
    // adminId: z.string(),
    type: z.enum(["personal", "company"]),
    consignorData: z.object({
      //common
      email: z.string().email().optional(),
      consignorName: z.string().optional(),

      //personal

      contactNo: z.coerce.number().optional(),
      address: z.string().optional(),
      dob: z.coerce.date().optional(),

      //compnay
      gstin: z.string(),
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
        return (
          data.consignorData.contactNo &&
          data.consignorData.email &&
          data.consignorData.consignorName
        );
      } else if (data.type === "company") {
        return (
          data.consignorData.gstin &&
          data.consignorData.consignorName &&
          data.consignorData.email
        );
      }
    },
    {
      message: "Required fields are missing based on the type.",
      path: ["consignorData"],
    },
  );

const NewRegistration = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);

  const initialFormState = {
    // adminId: user?._id,
    type: "personal",
    consignorData: {
      email: "",
      consignorName: "",
      contactNo: 0,
      address: "",
      dob: "",
      gstin: "",
      legalName: "",
      gstinStatus: "",
      principalPlaceOfBusiness: "",
      storeAddress: "",
      officeNo: "",
      creditLimit: "",
      defaultPaymentTerm: "",
      payableReceivable: "",
      accountGroup: "",
      openingBalance: "",
      remarks: "",
    },
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  async function MyHandleSubmit(value , e) {
    console.log("hey");
    console.log(value);
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await fetch("/api/consigerRegistration", {
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
    <div className="max-w max-h  bg-white px-8 py-4">
      <h2 className="text-3xl font-semibold"> New Regeratration</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(MyHandleSubmit)}
          className="flex flex-col gap-4 "
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
          <FormField
                control={form.control}
                name="consignorData.consignorName"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                      consignorName :
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

          {form.getValues("type") === "personal" || (
            <>

            <FormField
                control={form.control}
                name="consignorData.contactNo"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                      contactNo :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />

<FormField
                control={form.control}
                name="consignorData.address"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                      address :
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
                name="consignorData.dob"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                      dob :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
              

             
            </>
          )}
          {form.getValues("type") === "company" || (
            <>
              <FieldForm
                form={form}
                name="consignorData.gstin"
                label="gstin"
                type="text"
              />
              <FieldForm
                form={form}
                name="consignorData.legalName"
                label="legalName"
                type="text"
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

          <Button type="submit">{isloading ? "Loading..." : " Submit"}</Button>
        </form>
      </Form>
    </div>
  );
};

export default NewRegistration;
