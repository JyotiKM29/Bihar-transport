"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "../../../components/ui/form";
import { Button } from "../../../components/ui/button";
import { useContext, useState } from "react";
import * as z from "zod";
import { useToast } from "../../../components/ui/use-toast";
import FieldForm from "../FieldForm";
import { UserContext } from "../../../context/UserContextProvider";

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
  proof:  z.array(z.string().url()),
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
  proof:  z.array(z.string().url()),
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

const formSchema = z.object({
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
  passingCapacity: z.string({ message: "Passing Capacity is required" }),
  maxCapacity: z.string({ message: "Max Capacity is required" }),
  chassisNo: z.string({ message: "Chassis No is required" }).min(3),
  EngineNo: z.string({ message: "Engine No is required" }).min(3),
  fitnessValidUpTo: z.coerce.date({
    message: "Fitness Valid Up To date is required",
  }),
  taxPaidUpTo: z.coerce.date({ message: "Tax Paid Up To date is required" }),
  insurenceValidUpTo: z.coerce.date({
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
  rcPhoto:  z.array(z.string().url()),
  Remark: z.string({ message: "Remark is required" }).min(3),
  owner: ownerSchema,
  driver: driverSchema,
  adminId : z.string(),
});

const RegistrationForm = () => {
  const {toast} = useToast();
  const {user} = useContext(UserContext);
  const [isloading, setIsLoading] = useState();

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
    insurenceValidUpTo: null,
    permitValidUpTo: null,
    nationalPermit: false,
    nationalPermitValidUpTo: null,
  
    rcPhoto: "",
    Remark: "",
    owner: {},
    driver: {},
    adminId: '',
  };

  const { reset, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  async function MyHandleSubmit() {
    form.setValue('adminId',user._id);
    const values = form.getValues();
    console.log(values);

    try {
     
      const response = await fetch('/api/vehicleregistration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),  
      });
    console.log(response);
  
    const newResult = await response.json();
    
  
    if(response.ok){
      setIsLoading(false);
      displayToast("Successfully Booked, Click view Booking button to view the booking", "✅");
      const userDetail = newResult.user;
      reset(initialFormState);
    }
  
    else{
      console.error("Error:", newResult.message);
      displayToast("Error", "❌", newResult.message);
      setIsLoading(false);
    }
      } catch (error) {
        console.error("Error:", newResult.message);
      displayToast("Error", "❌", newResult.message);
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
    <div className="max-w max-h  bg-white px-0 ">
    <Form {...form}>
  <form onSubmit={form.handleSubmit(MyHandleSubmit)} className="grid grid-cols-1  lg:grid-cols-2 2xl:grid-cols-3  gap-x-10 xl:px-4">
  <h2 className="col-span-full text-2xl text-center font-bold mb-6 mt-3">Vehicle Details</h2>
    <FieldForm form={form} nameValue="vehicleNo" label="Vehicle No" type="text" />
    <FieldForm form={form} nameValue="registrationAuthority" label="Registration Authority" type="text" />
    <FieldForm form={form} nameValue="fuelName" label="Fuel Name" type="text" />
    <FieldForm form={form} nameValue="vehicleAge" label="Vehicle Age" type="number" />
    <FieldForm form={form} nameValue="vehicleType" label="Vehicle Type" type="text" />
    <FieldForm form={form} nameValue="vehicleClass" label="Vehicle Class" type="text" />
    <FieldForm form={form} nameValue="vehicleLength" label="Vehicle Length" type="text" />
    <FieldForm form={form} nameValue="passingCapacity" label="Passing Capacity" type="text" />
    <FieldForm form={form} nameValue="maxCapacity" label="Max Capacity" type="text" />
    <FieldForm form={form} nameValue="chassisNo" label="Chassis No" type="text" />
    <FieldForm form={form} nameValue="EngineNo" label="Engine No" type="text" />
    <FieldForm form={form} nameValue="fitnessValidUpTo" label="Fitness Valid Up To" type="date" />
    <FieldForm form={form} nameValue="taxPaidUpTo" label="Tax Paid Up To" type="date" />
    <FieldForm form={form} nameValue="insurenceValidUpTo" label="Insurance Valid Up To" type="date" />
    <FieldForm form={form} nameValue="permitValidUpTo" label="Permit Valid Up To" type="date" />
    <FieldForm form={form} nameValue="nationalPermit" label="National Permit" type="checkbox" />
    <FieldForm form={form} nameValue="nationalPermitValidUpTo" label="National Permit Valid Up To" type="date" />
   
    <FieldForm form={form} nameValue="rcPhoto" label="RC Photo" type="file" fileNumber={2}/>
    <FieldForm form={form} nameValue="Remark" label="Remark" type="text" />
    {/* Add fields for owner and driver here */}
    
    {/* ...existing fields... */}
    <h2 className="col-span-full text-2xl text-center font-bold mb-6 mt-3">Owner Details</h2>
    <FieldForm form={form} nameValue="owner.proofType" label="Owner Proof Type" type="text" />
    <FieldForm form={form} nameValue="owner.proofNumber" label="Owner Proof Number" type="text" />
    <FieldForm form={form} nameValue="owner.name" label="Owner Name" type="text" />
    <FieldForm form={form} nameValue="owner.DOB" label="Owner Date of Birth" type="date" />
    <FieldForm form={form} nameValue="owner.phone" label="Owner Phone" type="text" />
    <FieldForm form={form} nameValue="owner.secondPhone" label="Owner Second Phone" type="text" />
    <FieldForm form={form} nameValue="owner.address" label="Owner Address" type="text" />
    <FieldForm form={form} nameValue="owner.rating" label="Owner Rating" type="number" />
    <FieldForm form={form} nameValue="owner.withPhone" label="Owner With Phone" type="checkbox" />
    <FieldForm form={form} nameValue="owner.bank.upiNo" label="Owner Bank UPI No" type="number" />
    <FieldForm form={form} nameValue="owner.bank.name" label="Owner Bank Name" type="text" />
    <FieldForm form={form} nameValue="owner.bank.accNo" label="Owner Bank Account No" type="number" />
    <FieldForm form={form} nameValue="owner.bank.ifscCode" label="Owner Bank IFSC Code" type="text" />
    <FieldForm form={form} nameValue="owner.bank.proof" label="Owner Bank Proof" type="file" fileNumber={2}/>
    <FieldForm form={form} nameValue="owner.remarks" label="Owner Remarks" type="text" />

    <h2 className="col-span-full text-2xl text-center font-bold mb-6 mt-3">Driver Details</h2>
    <FieldForm form={form} nameValue="driver.licenseNo" label="Driver License No" type="text" />
    <FieldForm form={form} nameValue="driver.name" label="Driver Name" type="text" />
    <FieldForm form={form} nameValue="driver.issueDate" label="Driver License Issue Date" type="date" />
    <FieldForm form={form} nameValue="driver.licenceValidity" label="Driver License Validity" type="date" />
    <FieldForm form={form} nameValue="driver.DOB" label="Driver Date of Birth" type="date" />
    <FieldForm form={form} nameValue="driver.vehicleClass" label="Driver Vehicle Class" type="text" />
    <FieldForm form={form} nameValue="driver.licenceAuthority" label="Driver License Authority" type="text" />
    <FieldForm form={form} nameValue="driver.address" label="Driver Address" type="text" />
    <FieldForm form={form} nameValue="driver.phone" label="Driver Phone" type="text" />
    <FieldForm form={form} nameValue="driver.altPhone" label="Driver Alternate Phone" type="text" />
    <FieldForm form={form} nameValue="driver.rating" label="Driver Rating" type="number" />
    <FieldForm form={form} nameValue="driver.smartPhone" label="Driver Has Smartphone" type="checkbox" />
    <FieldForm form={form} nameValue="driver.owner" label="Driver Is Owner" type="checkbox" />
    <FieldForm form={form} nameValue="driver.proof" label="Driver Proof" type="file" fileNumber={2} />


    <div className="col-span-full flex  md:justify-center mt-8">
  <Button type="submit" className="h-16 bg-black text-lg w-full xl:w-1/3">
    {isloading ? "Loading..." : "Submit"}
  </Button>
</div>
  </form>
</Form>

    </div>
  );
};

export default RegistrationForm;
