"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FieldForm from "../../component/FieldForm";
import { Button } from "../../../components/ui/button";
import AdditionalContact from "./AdditionalContact";
import StarRating from "../StarRating";
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
import { Input } from "../../../components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";

const basicInfoSchema = z.object({
  accountName: z.string(),
  contactNo: z.coerce
    .number()
    .min(999999999, "Contact no not less than 10 digits")
    .max(9999999999, "Contact no is not more than 10 digits"),
  officeAddress: z.string(),

  // taxInfo :
  taxInfo: z.object({
    GSTIN: z.string(),
    PanNo: z.string(),
    tradeName: z.string(),
    legalName: z.string(),
    GSTINStatus: z.string(),
    principalPlaceOfBusiness: z.string(),
    rating: z.string(),
    remarks: z.string(),
    alert: z.coerce.boolean(),
  }),
});

const accountDetailsSchema = z.object({
  accountGroup: z.enum(
    [
      "Capital Account",
      "Cash in Hand",
      "Bank Account",
      "Gross Receipt Transport",
      "Cost of Transporting Account",
      "Indirect Expenses",
      "Sundry Debtor",
      "Sundry  Creditor",
      "Duties and Taxes ",
      "Customers",
      "Vehicle Vendor ",
      "Transporter",
      "Petrol Pump",
    ],
    "please select from given options",
  ),

  natureOfAccount: z.enum([
    "Capital",
    "Current Asset",
    "Indirect Income",
    "Expenses",
    "Amounts Recievable",
    "Liabilities",
  ]),

  // Openning Balance
  openingBalance: z.object({
    amount: z.coerce.number(),
    debitCredit: z.enum(["Debit", "Credit"]),
  }),
  creditLimit: z.coerce.number(),
});

const additionalInfoSchema = z.object({
  tripType: z.string(),
  route: z.string(),
  defaultPaymentTerm: z.string(),
  serviceToStates: z.string(),
  typeOfVehicle: z.string(),
  attachId: z.array(z.string().url()),
  // alert:z.string(),
});

const additionalContactSchema = z.object({
  proofType: z.string(),
  proofNumber: z.string(),
  name: z.string(),
  DOB: z.coerce.date(),
  SDWOf: z.string(),
  ContactNo: z.coerce
    .number()
    .min(999999999, "Contact no not less than 10 digits")
    .max(9999999999, "Contact no is not more than 10 digits"),
  alternativeContactNo: z.coerce
    .number()
    .min(999999999, "Contact no not less than 10 digits")
    .max(9999999999, "Contact no is not more than 10 digits")
    .optional(),
  Address: z.string(),

  designation: z.string(),
  email: z.string().email(),
});

const bankDetailsSchema = z.object({
  bankName: z.string(),
  nameOnPassbook: z.string(),
  accountNo: z.coerce.number(),
  IFSCCode: z.string(),
  branch: z.string(),
  upiNo: z.string(),
  upiType: z.string(),
});

const formSchema = z.object({
  adminId: z.string(),
  basicInfo: basicInfoSchema,
  accountDetails: accountDetailsSchema,
  additionalInfo: additionalInfoSchema.partial(),
  additionalContact: z.array(additionalContactSchema).optional(),

  bankDetails: bankDetailsSchema.partial(),
});

const LedgerForm = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);
  const [showadditionalInfo, setShowAdditionalInfo] = useState(false);
  const [showadditionalContact, setshowAdditionalContact] = useState(false);
  const [showBankDetail, setShowBankDetail] = useState(false);

  const initialFormState = {
    adminId: "",
    basicInfo: {
      accountName: undefined,
      contactNo: undefined,
      officeAddress: undefined,

      // texInfo :
      taxInfo: {
        GSTIN: undefined,
        PanNo: undefined,
        tradeName: undefined,
        legalName: undefined,
        GSTINStatus: undefined,
        principalPlaceOfBusiness: undefined,
        rating: undefined,
        remarks: undefined,
        alert: false,
        // additionalContact:undefined,
      },
    },
    accountDetails: {
      accountGroup: undefined,
      natureOfAccount: undefined,
      // Openning Balance
      openingBalance: {
        amount: undefined,
        debitCredit: undefined,
      },
      creditLimit: undefined,
    },
    additionalInfo: {
      tripType: undefined,
      route: undefined,
      defaultPaymentTerm: undefined,
      serviceToStates: undefined,
      typeOfVehicle: undefined,
      attachId: undefined,
      alert: undefined,
    },
    additionalContact: [],

    bankDetails: {},
    GSTINAadharCardPanCardDrivingLicence: undefined,
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  const data = {
    additionalContact: [{ email: "Abc@gmail.com" }],
  };

  // console.log(formSchema.parse(data))

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

  const handleRatingChange = (value) => {
    // Update the value of the form field here
    form.setValue("basicInfo.taxInfo.rating", value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(myhandleSubmit)}>
        <div className="grid grid-cols-1  lg:grid-cols-2 lg:gap-8">
          <div className="">
            <h2 className="text-center text-xl font-semibold text-blue-500 underline underline-offset-1">
              {" "}
              Basic Info{" "}
            </h2>

            <FieldForm
              form={form}
              name="basicInfo.accountName"
              label="Account/Ledger Name"
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
              label="Office/Store Address"
              type="text"
            />

            <h2 className="text-center text-lg font-semibold text-blue-500 underline underline-offset-1">
              Tax Info{" "}
            </h2>

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

            <FormField
              control={form.control}
              name="basicInfo.taxInfo.rating"
              render={({ field }) => {
                return (
                  <FormItem className="flex items-center justify-center gap-4">
                    <FormLabel className="text-nowrap text-sm lg:text-base">
                      Rating :
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <StarRating onChange={handleRatingChange} />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {/* <FieldForm
            form={form}
            name="basicInfo.taxInfo.rating"
            label="Rating"
            type="text"
          /> */}
            <div className="flex w-full items-center gap-4">
              <div className="flex-1">
                <FieldForm
                  form={form}
                  name="basicInfo.taxInfo.remarks"
                  label="Remarks"
                  type="text"
                />
              </div>
              <FormField
                control={form.control}
                name="basicInfo.taxInfo.alert"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Alert :
                      </FormLabel>

                      <FormControl>
                        <Checkbox {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>

          <div className="">
            <h2 className="text-center text-xl font-semibold text-blue-500 underline underline-offset-1">
            
              Account Details
            </h2>

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
                          <option value="Capital Account">
                            Capital Account
                          </option>
                          <option value="Cash in Hand">Cash in Hand</option>
                          <option value="Bank Account">Bank Account</option>
                          <option value="Gross Receipt Transport">
                            {" "}
                            Gross Receipt Transport
                          </option>
                          <option value="Cost of Transporting Account">
                            Cost of Transporting Account
                          </option>
                          <option value="Indirect Expenses">
                            Indirect Expenses
                          </option>
                          <option value="retuIndirect Indirectrn">
                            Indirect Indirect
                          </option>
                          <option value="Sundry Debtor">Sundry Debtor </option>
                          <option value="Sundry  Creditor">
                            Sundry Creditor
                          </option>
                          <option value="Duties and Taxes">
                            Duties and Taxes{" "}
                          </option>
                          <option value="Customers ">Customers </option>
                          <option value="Vehicle Vendor">
                            Vehicle Vendor{" "}
                          </option>
                          <option value="Book Receipt">Book Receipt </option>
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
                          <option value="Indirect Income">
                            Indirect Income
                          </option>
                          <option value="Expenses">Expenses</option>
                          <option value="Amounts Receivable">
                            Amounts Receivable
                          </option>
                          <option value="Liabilities">Liabilities</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                );
              }}
            />

            <div className="flex w-full gap-0">
              <FormField
                control={form.control}
                name="accountDetails.openingBalance.amount"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-1 items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Opening Balance (Rs):
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            placeholder="Enter value of  opening balance"
                            className=" rounded-bl rounded-br-[0px] rounded-tl rounded-tr-[0px]"
                          />
                        </FormControl>

                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="accountDetails.openingBalance.debitCredit"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center ">
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <select
                            {...field}
                            className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                          >
                            <option value=""> Select Type </option>

                            <option value="Debit">Debit</option>
                            <option value="Credit">Credit</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
            </div>

            <FieldForm
              form={form}
              name="accountDetails.creditLimit"
              label="Credit Limit (Rs)"
              type="number"
            />

            {showBankDetail ? (
              <div className="">
                <h2
                  className="text-center text-xl font-semibold text-blue-500 underline underline-offset-1"
                  onClick={() => setShowBankDetail(!showBankDetail)}
                >
                 
                  Bank Details
                </h2>

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
              </div>
            ) : (
              <p
                   className="my-6 text-center text-xl font-semibold  px-8 py-2 rounded-lg shadow-md bg-blue-500 hover:bg-blue-700 text-white max-w-full "
                onClick={() => setShowBankDetail(!showBankDetail)}
              >
                Bank detail
              </p>
            )}

            {showadditionalContact ? (
              <AdditionalContact
                form={form}
                nameValue="additionalContact"
                setshowAdditionalContact={setshowAdditionalContact}
                showadditionalContact={showadditionalContact}
              />
            ) : (
              <p
                  className="my-6 text-center text-xl font-semibold   px-8 py-2 rounded-lg shadow-md bg-blue-500 hover:bg-blue-700 text-white max-w-full "
                onClick={() => setshowAdditionalContact(!showadditionalContact)}
              >
                Additional Contact{" "}
              </p>
            )}

            {showadditionalInfo ? (
              <div className="">
                <h2
                      className="text-center text-xl font-semibold text-blue-500 underline underline-offset-1"
                  onClick={() => setShowAdditionalInfo(!showadditionalInfo)}
                >
                  Additional Info{" "}
                </h2>

                <FormField
                  control={form.control}
                  name="additionalInfo.tripType"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center gap-4">
                        <FormLabel className="text-nowrap text-sm lg:text-base">
                          Trip Type:
                        </FormLabel>
                        <Select
                          className="flex flex-1 flex-col"
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Trip Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="One Way">One Way</SelectItem>
                            <SelectItem value="Two way">Two way</SelectItem>
                            <SelectItem value="Return">Return</SelectItem>
                            <SelectItem value="All">All</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FieldForm
                  form={form}
                  name="additionalInfo.route"
                  label="Route"
                  type="text"
                />

                <FormField
                  control={form.control}
                  name="additionalInfo.defaultPaymentTerm"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center gap-4">
                        <FormLabel className="text-nowrap text-sm lg:text-base">
                          Default Payment Term:
                        </FormLabel>
                        <Select
                          className="flex flex-1 flex-col"
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Payment term" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="To be Billed">
                              To be Billed
                            </SelectItem>
                            <SelectItem value="To pay">To pay</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FieldForm
                  form={form}
                  name="additionalInfo.serviceToStates"
                  label="Service To States"
                  type="text"
                />
                <FieldForm
                  form={form}
                  name="additionalInfo.typeOfVehicle"
                  label="Type Of Vehicle"
                  type="text"
                />
                <FieldForm
                  form={form}
                  name="additionalInfo.attachId"
                  label="Attach Id"
                  type="File"
                />
              </div>
            ) : (
              <p
                    className="my-6 text-center text-xl font-semibold    px-8 py-2 rounded-lg shadow-md bg-blue-500 hover:bg-blue-700 text-white max-w-full "
                onClick={() => setShowAdditionalInfo(!showadditionalInfo)}
              >
                Additional Info{" "}
              </p>
            )}
          </div>
        </div>

        <div className="my-8 flex items-center justify-center">
          <Button type="submit" className="h-16 w-full text-lg lg:w-1/3 ">
            {isloading ? "Loading..." : " Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LedgerForm;
