"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FieldForm from "../../component/FieldForm";
import { Button } from "../../../components/ui/button";

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


const basicInfoSchema = z.object({
  accountName :z.string(),
  contactNo:z.coerce.number().min(999999999,'Contact no not less than 10 digits').max(9999999999,'Contact no is not more than 10 digits'),
  officeAddress:z.string(),

  // texInfo :
  taxInfo: z.object({
    GSTIN:z.string(),
    PanNo:z.string(),
    tradeName:z.string(),
    legalName:z.string(),
    GSTINStatus:z.string(),
    principalPlaceOfBusiness:z.string(),
    rating:z.string(),
    remarks:z.string(),
    additionalContact:z.string(),
  })
})

const accountDetailsSchema = z.object({
  accountGroup:z.enum(['Capital Way' , 'Cash in Hand', 'Bank Account','Gross Receipt from Transporter Bussiness Account',
'Cost of Transporting Account' ,'Indirect Expenses', 'Sundry Debtor' ,'Sundry  Creditor','Duties and Taxes ','Customers', 'Vehicle Vendor ', 'Transporter', 'Petrol Pump'] ,"please select from given options"),

  natureOfAccount:z.enum(['Capital' , 'Current Asset','Income', 'Expenses','Amounts Recievable' , 'Liabilities']),

  // Openning Balance
  openingBalance: z.object({
    amount:z.coerce.number(),
    debitCredit:z.string(),
  }),
  creditLimit:z.coerce.number(),
  defaultPaymentTerm:z.string(),
  serviceToStates:z.string(),
  typeOfVehicle:z.string(),
  attachId:z.string(),
  alert:z.string(),
})

const additionalInfoSchema = z.object({

  tripType:z.string(),
  route:z.string(),
  proofType:z.string(),
  proofNumber:z.coerce.number(),
  name:z.string(),
  DOB:z.coerce.date(),
  SDWOf:z.string(),
  proofContactNo:z.string(),
  proofAddress:z.string(),
  proofAddress:z.string(),
  designation:z.string(),
  email:z.string().email(),
})

const bankDetailsSchema = z.object({
  bankName:z.string(),
  nameOnPassbook:z.string(),
  accountNo:z.string(),
  IFSCCode:z.string(),
  branch:z.string(),
  upiNo:z.string(),
  upiType:z.string(),
})

const formSchema = z
  .object({
    adminId:z.string(),
    basicInfo : basicInfoSchema,
    accountDetails: accountDetailsSchema,
    additionalInfo: additionalInfoSchema,
    bankDetails: bankDetailsSchema,
    GSTINAadharCardPanCardDrivingLicence:z.string(),
  
  });

const LedgerForm = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);


  const initialFormState = {
    adminId:'',
    basicInfo :{
      accountName :undefined,
      contactNo:undefined,
      officeAddress:undefined,
    
      // texInfo :
      taxInfo: {
        GSTIN:undefined,
        PanNo:undefined,
        tradeName:undefined,
        legalName:undefined,
        GSTINStatus:undefined,
        principalPlaceOfBusiness:undefined,
        rating:undefined,
        remarks:undefined,
        additionalContact:undefined,
      }
    },
    accountDetails:{
      accountGroup:undefined,
        natureOfAccount:undefined,
        // Openning Balance
        openingBalance: {
          amount:undefined,
          debitCredit:undefined,
        },
        creditLimit:undefined,
        defaultPaymentTerm:undefined,
        serviceToStates:undefined,
        typeOfVehicle:undefined,
        attachId:undefined,
        alert:undefined,
    },
    additionalInfo: {
      tripType:undefined,
  route:undefined,
  proofType:undefined,
  proofNumber:undefined,
  name:undefined,
  DOB:undefined,
  SDWOf:undefined,
  proofContactNo:undefined,
  proofAddress:undefined,
  proofAddress:undefined,
  designation:undefined,
  email:undefined,
    },
    bankDetails: {
      bankName:undefined,
      nameOnPassbook:undefined,
      accountNo:undefined,
      IFSCCode:undefined,
      branch:undefined,
      upiNo:undefined,
      upiType:undefined,
    },
    GSTINAadharCardPanCardDrivingLicence:undefined,
  }


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });


   
  async function myhandleSubmit(value) {
   
    console.log(formSchema.safeParse(value))

    try {
      const res = formSchema.parse(value);
      console.log("solved", res);
    } catch (error) {
      console.log("hi", error);
    }

    value.adminId = user?._id;
    try {
      const response = await fetch("/api/accounting/createledger", {
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
   
   
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(myhandleSubmit)}
       
      >
      <div className="grid grid-cols-1  lg:grid-cols-2 lg:gap-8">

    

<div className="">
<h2 className="text-xl font-semibold text-center text-blue-500 underline underline-offset-1"> Basic Info </h2>

     <FieldForm
            form={form}
            name="basicInfo.accountName"
            label="Account Name"
            type="text"
          />
    
     <FieldForm
            form={form}
            name="basicInfo.contactNo"
            label="Contact No"
            type="number"
          />
    
     <FieldForm
            form={form}
            name="basicInfo.officeAddress"
            label="Office Address"
            type="text"
          />

<h2 className="text-lg font-semibold text-center text-blue-500 underline underline-offset-1">Tax Info </h2>

     <FieldForm
            form={form}
            name="basicInfo.taxInfo.GSTIN"
            label="GSTIN"
            type="text"
          />
     <FieldForm
            form={form}
            name="basicInfo.taxInfo.PanNo"
            label="Pan No"
            type="text"
          />
     <FieldForm
            form={form}
            name="basicInfo.taxInfo.tradeName"
            label="Trade Name"
            type="text"
          />
     <FieldForm
            form={form}
            name="basicInfo.taxInfo.legalName"
            label="Legal Name"
            type="text"
          />
     <FieldForm
            form={form}
            name="basicInfo.taxInfo.GSTINStatus"
            label="GSTIN Status"
            type="text"
          />
     <FieldForm
            form={form}
            name="basicInfo.taxInfo.principalPlaceOfBusiness"
            label="Principal Place Of Business"
            type="text"
          />
     <FieldForm
            form={form}
            name="basicInfo.taxInfo.rating"
            label="Rating"
            type="text"
          />
     <FieldForm
            form={form}
            name="basicInfo.taxInfo.remarks"
            label="Remarks"
            type="text"
          />
     <FieldForm
            form={form}
            name="basicInfo.taxInfo.additionalContact"
            label="Additional Contact"
            type="text"
          />
    
    </div> 
    <div className="">
<h2 className="text-xl font-semibold text-center text-blue-500 underline underline-offset-1"> Account Details </h2>

<FormField
                control={form.control}
                name="accountDetails.accountGroup"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                      Account Group:
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <select {...field}>
                            <option value="">Select Account Group </option>
                            <option value="Capital Way">Capital Way</option>
                            <option value="Cash in Hand">Cash in Hand</option>
                            <option value="Bank Account">Bank Account</option>
                            <option value="Gross Receipt from Transporter Bussiness Account"> Gross Receipt from Transporter Bussiness Account</option>
                            <option value="Cost of Transporting Account">Cost of Transporting Account</option>
                            <option value="Indirect Expenses">Indirect Expenses</option>
                            <option value="retuIndirect Indirectrn">Indirect Indirect</option>
                            <option value="Sundry Debtor">Sundry Debtor </option>
                            <option value="Sundry  Creditor">Sundry  Creditor</option>
                            <option value="Duties and Taxes">Duties and Taxes </option>
                            <option value="Customers ">Customers </option>
                            <option value="Vehicle Vendor">Vehicle Vendor </option>
                            <option value="Transporter">Transporter </option>
                            <option value="Petrol Pump">Petrol Pump </option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />


 <FormField
  control={form.control}
  name="accountDetails.natureOfAccount"
  render={({ field }) => {
    return (
      <FormItem className="flex items-center justify-center gap-4">
        <FormLabel className="text-nowrap text-sm lg:text-base">
          Nature Of Account:
        </FormLabel>
        <div className="flex flex-1 flex-col">
          <FormControl>
            <select {...field}>
              <option value="">Select Nature Of Account</option>
              <option value="Capital">Capital</option>
              <option value="Current Asset">Current Asset</option>
              <option value="Income">Income</option>
              <option value="Expenses">Expenses</option>
              <option value="Amounts Receivable">Amounts Receivable</option>
              <option value="Liabilities">Liabilities</option>
            </select>
          </FormControl>
          <FormMessage />
        </div>
      </FormItem>
    );
  }}
/> 


<FieldForm
            form={form}
            name="accountDetails.openingBalance.amount"
            label="Opening Balance"
            type="number"
          />
<FieldForm
            form={form}
            name="accountDetails.openingBalance.debitCredit"
            label="Debit Credit"
            type="text"
          />


<FieldForm
            form={form}
            name="accountDetails.creditLimit"
            label="Credit Limit"
            type="number"
          />
<FieldForm
            form={form}
            name="accountDetails.defaultPaymentTerm"
            label="Default PaymentTerm"
            type="text"
          />
<FieldForm
            form={form}
            name="accountDetails.serviceToStates"
            label="Service To States"
            type="text"
          />
<FieldForm
            form={form}
            name="accountDetails.typeOfVehicle"
            label="type Of Vehicle"
            type="text"
          />
<FieldForm
            form={form}
            name="accountDetails.attachId"
            label="Attach Id"
            type="text"
          />
<FieldForm
            form={form}
            name="accountDetails.alert"
            label="Alert"
            type="text"
          />
</div>
<div className="">
<h2 className="text-xl font-semibold text-center text-blue-500 underline underline-offset-1"> Bank Details</h2>

<FieldForm
            form={form}
            name="bankDetails.bankName"
            label="Bank Name"
            type="text"
          />
<FieldForm
            form={form}
            name="bankDetails.nameOnPassbook"
            label="Name On Passbook"
            type="text"
          />
<FieldForm
            form={form}
            name="bankDetails.accountNo"
            label="Account No"
            type="text"
          />
<FieldForm
            form={form}
            name="bankDetails.IFSCCode"
            label="IFSC Code"
            type="text"
          />
<FieldForm
            form={form}
            name="bankDetails.branch"
            label="Branch"
            type="text"
          />
<FieldForm
            form={form}
            name="bankDetails.upiNo"
            label="Upi No"
            type="text"
          />
<FieldForm
            form={form}
            name="bankDetails.upiType"
            label="Upi Type"
            type="text"
          />

<h2 className="text-xl font-semibold text-center text-blue-500 underline underline-offset-1">ID proof</h2>

<FieldForm
            form={form}
            name="GSTINAadharCardPanCardDrivingLicence"
            label="Id proof"
            type="text"
          />
</div>
    <div className="">
<h2 className="text-xl font-semibold text-center text-blue-500 underline underline-offset-1">Additional Info </h2>

<FieldForm
            form={form}
            name="additionalInfo.tripType"
            label="Trip Type"
            type="text"
          />
<FieldForm
            form={form}
            name="additionalInfo.route"
            label="Route"
            type="text"
          />
<FieldForm
            form={form}
            name="additionalInfo.proofType"
            label="Proof Type"
            type="text"
          />
<FieldForm
            form={form}
            name="additionalInfo.proofNumber"
            label=" Proof Number"
            type="number"
          />
<FieldForm
            form={form}
            name="additionalInfo.name"
            label="Name"
            type="text"
          />
<FieldForm
            form={form}
            name="additionalInfo.DOB"
            label="DOB"
            type="date"
          />
<FieldForm
            form={form}
            name="additionalInfo.SDWOf"
            label="SDWOf"
            type="text"
          />
<FieldForm
            form={form}
            name="additionalInfo.proofContactNo"
            label="Proof ContactNo"
            type="text"
          />
<FieldForm
            form={form}
            name="additionalInfo.proofAddress"
            label="Proof Address"
            type="text"
          />
<FieldForm
            form={form}
            name="additionalInfo.designation"
            label="Designation"
            type="text"
          />
<FieldForm
            form={form}
            name="additionalInfo.email"
            label="Email"
            type="text"
          />
</div>





  </div>

<div className="flex justify-center items-center my-8">
<Button type="submit" className='h-16 text-lg w-full lg:w-1/3 '>{isloading ? "Loading..." : " Submit"}</Button>
</div>


     
        </form>
      </Form>
  
  )
}

export default LedgerForm
