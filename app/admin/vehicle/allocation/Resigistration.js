"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form , FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,} from "../../../components/ui/form";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {  useState } from "react";
import * as z from "zod";

const driverSchema = z.object({
  licenseNo: z.string({ message: "License No is required" }),
  name: z.string({ message: "Name is required" }).min(3),
  issueDate: z.coerce.date({ message: "Issue Date is required" }),
  licenceValidity: z.coerce.date({
    message: "Licence Validity Date is required",
  }),
  DOB: z.coerce.date({ message: "Date of Birth is required" }),
  vehicleClass: z.string({ message: "Vehicle Class is required" }).min(3),
  licenceAuthority: z
    .string({ message: "Licence Authority is required" })
    .min(3),
  address: z.string({ message: "Address is required" }).min(3),
  phone: z
    .string()
    .min(10, {
      message: "Phone must be of 10 digits",
    })
    .max(10, {
      message: "Phone can't be more than 10 digits",
    }),
  altPhone: z
    .string()
    .min(10, {
      message: "Alternate Phone must be of 10 digits",
    })
    .max(10, {
      message: "Alternate Phone can't be more than 10 digits",
    }),
  rating: z.coerce.number({
    message: "Rating is required",
  }),
  smartPhone: z.coerce.boolean({ message: "Smartphone status is required" }),
  owner: z.coerce.boolean({ message: "Owner status is required" }),
  proof: z.string({ message: "Proof is required" }).min(3),
});

const bankSchema = z.object({
  upiNo: z.coerce
    .number({
      message: "UPI No is required",
    })
    .positive(),
  name: z.string({ message: "Name is required" }).min(3),
  accNo: z.coerce
    .number({
      message: "Account No is required",
    })
    .positive(),
  ifscCode: z.string({ message: "IFSC Code is required" }).min(3),
  proof: z.string({ message: "Proof is required" }).min(3),
});

const ownerSchema = z.object({
  proofType: z.string({ message: "Proof Type is required" }).min(3),
  proofNumber: z.string({ message: "Proof Number is required" }).min(3),
  name: z.string({ message: "Name is required" }).min(3),
  DOB: z.coerce.date({ message: "Date of Birth is required" }),
  phone: z
    .string()
    .min(10, {
      message: "Phone must be of 10 digits",
    })
    .max(10, {
      message: "Phone can't be more than 10 digits",
    }),
  secondPhone: z
    .string()
    .min(10, {
      message: "Second Phone must be of 10 digits",
    })
    .max(10, {
      message: "Second Phone can't be more than 10 digits",
    }),
  address: z.string({ message: "Address is required" }).min(3),
  rating: z.coerce
    .number({
      message: "Rating is required",
    })
    .positive(),
  withPhone: z.coerce.boolean({ message: "With Phone status is required" }),
  bank: bankSchema,
  remarks: z.string({ message: "Remarks are required" }).min(3),
});

const vehicleSchema = z.object({
  vehicleNo: z.string({ message: "Vehicle No is required" }).min(3),
  registrationAuthority: z
    .string({ message: "Registration Authority is required" })
    .min(3),
  fuelName: z.string({ message: "Fuel Name is required" }).min(3),
  vehicleAge: z.coerce
    .number({
      message: "Vehicle Age is required",
    })
    .positive(),
  vehicleType: z.string({ message: "Vehicle Type is required" }).min(3),
  vehicleClass: z.string({ message: "Vehicle Class is required" }).min(3),
  vehicleLength: z.string({ message: "Vehicle Length is required" }).min(3),
  passingCapacity: z.string({ message: "Passing Capacity is required" }).min(3),
  maxCapacity: z.string({ message: "Max Capacity is required" }).min(3),
  chassisNo: z.string({ message: "Chassis No is required" }).min(3),
  EngineNo: z.string({ message: "Engine No is required" }).min(3),
  fitnessValidUpTo: z.coerce.date({
    message: "Fitness Valid Up To date is required",
  }),
  taxPaidUpTo: z.coerce.date({ message: "Tax Paid Up To date is required" }),
  insuranceValidUpTo: z.coerce.date({
    message: "Insurance Valid Up To date is required",
  }),
  permitValidUpTo: z.coerce.date({
    message: "Permit Valid Up To date is required",
  }),
  nationalPermit: z.coerce.boolean({
    message: "National Permit status is required",
  }),
  nationalPermitValidUpTo: z.coerce.date({
    message: "National Permit Valid Up To date is required",
  }),
  allotmentStatus: z.string({ message: "Allotment Status is required" }).min(3),
  rcPhoto: z.string({ message: "RC Photo is required" }).min(3),
  Remark: z.string({ message: "Remark is required" }).min(3),
  owner: ownerSchema,
  driver: driverSchema,
});

const initialFormState = {
    vehicleNo: "",
    registrationAuthority: "",
    fuelName: "",
    vehicleAge: null,
    vehicleType: "",
    vehicleClass: "",
    vehicleLength: "",
    passingCapacity: "",
    maxCapacity: "",
    chassisNo: "",
    EngineNo: "",
    fitnessValidUpTo: null,
    taxPaidUpTo: null,
    insuranceValidUpTo: null,
    permitValidUpTo: null,
    nationalPermit: null,
    nationalPermitValidUpTo: null,
    allotmentStatus: "",
    rcPhoto: "",
    Remark: "",
    owner: {},
    driver: {},
  };


const RegistrationForm = () => {
  const [isloading, setIsLoading] = useState();

 
  const { reset, ...form } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialFormState,
  });

  function MyHandleSubmit() {
    console.log('data');
    console.log(form.getValues()); 
  }

  

  return (
    <div className="max-w max-h  bg-white px-0 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(MyHandleSubmit)}
          className="flex flex-col "
        >
          {/* <FieldForm
            form={form}
            nameValue="vehicleNo"
            label="Vehicle No"
            type="text"
          /> */}

          {/* <FormField
                control={form.control}
                name="vehicleNo"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Order ID 
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
              /> */}

          <Button
            type="submit"
            className="mt-8 h-16 w-full self-center bg-black text-lg xl:w-1/3"
          >
            {isloading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
