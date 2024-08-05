"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import AdditionalChargers from "./AdditionalChargers";
import FieldForm from "../../../component/FieldForm";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
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
import { useRouter } from "next/navigation";

const chargesDetailsSchema = z.object({
  chargesName: z.string().optional(),
  days: z.coerce.number().optional(),
  rate: z.coerce.number().optional(),
  amount: z.coerce.number().optional(),
  remarks: z.string().optional(),
});

const eWayBillDetailsSchema = z.object({
  eWayBillNo: z.string(),
  eWayBillDate: z.coerce.date(),
  expDate: z.coerce.date(),
});

const consignorInvoiceDetailsSchema = z.object({
  isPODCompulsory: z.enum(["Yes", "No"]).transform((val) => val === "Yes"),
  podType: z.enum(["softCopy", "hardCopy"]),
  consignorInvoiceDate: z.coerce.date(),
  consignorDeliveryNo: z.string(),
  consignorInvoiceNo: z.string(),
  valueOfGoods: z.coerce.number(),
  eWayBillDetails: eWayBillDetailsSchema,
});

// ------dispatch details------
const dispatchDetailsSchema = z.object({
  lrNo:z.string(),
  billtyType: z.string(),
  dispatchDate: z.coerce.date(),
  dispatchTime: z.string().optional(),
  consignorInvoiceDetails: consignorInvoiceDetailsSchema,
  dispatch: z.object({
    // additionalRateForCompany: z.coerce.number(),
    chargesDetails: z.array(chargesDetailsSchema),
  }),
  ledgerBalanceOfParty: z.string(),
  remarks: z.string(),
});

// dispatchAdditionalDetailsSchema
const insuranceSchema = z
  .object({
    isInsured: z.enum(["Yes", "No"]).transform((val) => val === "Yes"),
    insuranceProvider: z.string().optional(),
    policyNo: z.string().optional(),
    policyAmount: z.coerce.number().optional(),
    claimAmount: z.coerce.number().optional(),
    brokerDetails: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.isInsured === "Yes") {
        return Boolean(data.insuranceProvider);
      }
      return true;
    },
    {
      message: "insuranceProvider is  required.",
      path: ["dispatch.dispatchAdditionalDetails.insurance.isInsured"],
    },
  );

const dispatchAdditionalDetailsSchema = z.object({
  deliveryType: z.string(),
  manualLRNo: z.string(),
  brokerCommission: z.coerce.number(),
  shippingRisk: z.string(),
  insurance: insuranceSchema,
});

// dispatchAdditionalRateSchema
const dispatchAdditionalRateSchema = z.object({
  chargesName: z.string().optional(),
  days: z.coerce.number().optional(),
  rate: z.coerce.number().optional(),
  amount: z.coerce.number().optional(),
  remarks: z.string().optional(),
});

const formSchema = z.object({
  adminId: z.string(),

  bookingId: z.string(),
  dispatch: z.object({
    isDispatched: z.coerce.boolean(),
    dispatchDetails: dispatchDetailsSchema,
    dispatchAdditionalDetails: dispatchAdditionalDetailsSchema,
    dispatchAdditionalRate: z.array(dispatchAdditionalRateSchema),
  }),
});

const DispatchVehicle = ({ params }) => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);
  const route = useRouter();
  const [showEWayBillDetail, setShowEWayBillDetail] = useState(false);
  const [showConsignorInvoiceDetail, setShowConsignorInvoiceDetail] =
    useState(false);

  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  const [showAdditionalRateForCompany, setShowAdditionalRateForCompany] = useState(false);
    const [showAdditionalRateForVehicle, setShowAdditionalRateForVehicle] = useState(false);

  const [selectedTime, setSelectedTime] = useState(getCurrentTime());
  

   function getCurrentTime() {
     const today = new Date();
     const hours = String(today.getHours()).padStart(2, "0");
     const minutes = String(today.getMinutes()).padStart(2, "0");
     return `${hours}:${minutes}`;
   }

  



  const initialFormState = {
    adminId: "",

    // vehicleNo: undefined,
    bookingId: params?.vehicleno,
    dispatch: {
      isDispatched: true,
      dispatchDetails: {
        lrNo: undefined,
        billtyType: undefined,
        dispatchDate: new Date().toISOString().split("T")[0],
        dispatchTime: undefined,
        // totalFreight: undefined,
        consignorInvoiceDetails: {
          isPODCompulsory: "Yes",
          podType:"hardCopy",
          consignorInvoiceDate: new Date().toISOString().split("T")[0],
          consignorDeliveryNo: undefined,
          consignorInvoiceNo: undefined,
          valueOfGoods: undefined,
          eWayBillDetails: {
            eWayBillNo: undefined,
            eWayBillDate: new Date().toISOString().split("T")[0],
            expDate: new Date().toISOString().split("T")[0],
          },
        },
        dispatch: {
          chargesDetails: [
            {
              chargesName: undefined,
              days: undefined,
              rate: undefined,
              amount: undefined,
              remarks: undefined,
            },
          ],
        },
        ledgerBalanceOfParty: undefined,
        remarks: undefined,
      },

      dispatchAdditionalDetails: {
        deliveryType: undefined,
        manualLRNo: undefined,
        brokerCommission: undefined,
        shippingRisk: undefined,

        insurance: {
          isInsured: undefined,
          insuranceProvider: undefined,
          policyNo: undefined,
          policyAmount: undefined,
          claimAmount: undefined,
          brokerDetails: undefined,
        },
      },

      dispatchAdditionalRate: [
        {
          chargesName: undefined,
          days: undefined,
          rate: undefined,
          amount: undefined,
          remarks: undefined,
        },
      ],
    },
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  const insurance = form.watch(
    "dispatch.dispatchAdditionalDetails.insurance.isInsured",
  );

  async function myhandleSubmit(value) {
    try {
      const res = formSchema.parse(value);
      console.log("solved", res);
    } catch (error) {
      console.log("hi", error);
    }

    // form.setValue('adminId', user?._id,)
    value.adminId = user?._id;
    value.dispatchTime = selectedTime;

    console.log("dispatched time : ", value.dispatchTime);

    setIsLoading(true);
    try {
      const response = await fetch("/api/dispatchbooking", {
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
        displayToast("Successfully dispatched", "✅");
        // const userDetail = newResult.user;
        form.reset(initialFormState);

        route.push("/admin/booking?tab=dispatch");


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

  // diaable scrolling 

  useEffect(() => {
    const disableScrollOnNumberInput = (e) => {
      if (e.target.type === "number") {
        e.preventDefault();
      }
    };

    const handleWheelEvent = (e) => {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    };

    window.addEventListener("wheel", disableScrollOnNumberInput, {
      passive: false,
    });
    window.addEventListener("wheel", handleWheelEvent);

    return () => {
      window.removeEventListener("wheel", disableScrollOnNumberInput);
      window.removeEventListener("wheel", handleWheelEvent);
    };
  }, []);





  return (
    <div className="max-w   mt-14 w-full rounded-2xl  bg-white px-4 py-4 shadow-md md:px-10 lg:my-4 lg:p-8 lg:px-20">
      <h2 className="mb-6 text-3xl font-semibold"> Dispatch Booking Form</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(myhandleSubmit)}>
          <div className="flex flex-col gap-8 xl:flex-row">
            <div className="flex w-full max-w-xl flex-col gap-0">
              <FieldForm
                form={form}
                name="dispatch.dispatchDetails.lrNo"
                label="LR No"
                type="text"
              />
              <FieldForm
                form={form}
                name="dispatch.dispatchDetails.billtyType"
                label="Billty Type"
                type="text"
              />
              <FormField
                control={form.control}
                name="dispatch.dispatchDetails.billtyType"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-4">
                    <FormLabel className="whitespace-nowrap">
                      Billty Type 
                    </FormLabel>
                    <Select>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select One" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="billty">Billty</SelectItem>
                        <SelectItem value="invoice">Invoice</SelectItem>
                        <SelectItem value="gstInvoice">GST Invoice</SelectItem>
                        <SelectItem value="challan">Challan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FieldForm
                form={form}
                name="dispatch.dispatchDetails.dispatchDate"
                label="Dispatch Date"
                type="date"
              />
              <label className="w-full items-center gap-8 md:flex">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Dispatch Time:
                </span>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="block w-full rounded-md border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </label>
              {/* <FieldForm form={form} name="dispatch.dispatchDetails.dispatchTime" label="Dispatch Time">
  <input
    type="time"
    value={selectedTime}
    onChange={(e) => setSelectedTime(e.target.value)}
    className="block w-full rounded-md border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
  />
</FieldForm> */}

{showEWayBillDetail ? (
                <div>
                  <h2
                    className="mt-6 text-center text-2xl font-semibold"
                    onClick={() => setShowEWayBillDetail(!showEWayBillDetail)}
                  >
                    e-way Bill Details
                  </h2>

                  <FieldForm
                    form={form}
                    name="dispatch.dispatchDetails.consignorInvoiceDetails.eWayBillDetails.eWayBillNo"
                    label="E-Way Bill No"
                    type="text"
                  />
                  <FieldForm
                    form={form}
                    name="dispatch.dispatchDetails.consignorInvoiceDetails.eWayBillDetails.eWayBillDate"
                    label="E-Way Bill Date"
                    type="date"
                  />
                  <FieldForm
                    form={form}
                    name="dispatch.dispatchDetails.consignorInvoiceDetails.eWayBillDetails.expDate"
                    label="Exp-Date"
                    type="date"
                  />
                </div>
              ) : (
                <p
                  className="my-6 max-w-full rounded-lg bg-blue-500 px-8 py-2 text-center text-xl font-semibold text-white shadow-md hover:bg-blue-700"
                  onClick={() => setShowEWayBillDetail(!showEWayBillDetail)}
                >
                  e-way Bill Details
                </p>
              )}

              {showAdditionalRateForCompany? (
                <div>

                   <h2 className="mt-6 text-center text-2xl font-semibold"
                   onClick={() =>
                    setShowAdditionalRateForCompany(!showAdditionalRateForCompany)
                  }
                   >
                Additional Rate for Company
              </h2>
              {/* <FieldForm
                form={form}
                name="dispatch.dispatchDetails.dispatch.additionalRateForCompany"
                label="Additional Rate for Company"
                type="number"
              /> */}

              <AdditionalChargers
                form={form}
                nameValue="dispatch.dispatchDetails.dispatch.chargesDetails"
              />

              <div className="mt-8">
                <FieldForm
                  form={form}
                  name="dispatch.dispatchDetails.ledgerBalanceOfParty"
                  label="LedgerBalance of Party"
                  type="text"
                />
                <FieldForm
                  form={form}
                  name="dispatch.dispatchDetails.remarks"
                  label="Remarks"
                  type="text"
                />
              </div>

                  </div>
              ):(
                <p
                  className="my-6 max-w-full rounded-lg bg-blue-500 px-8 py-2 text-center text-xl font-semibold text-white shadow-md hover:bg-blue-700"
                  onClick={() =>
                    setShowAdditionalRateForCompany(!showAdditionalRateForCompany)
                  }
                >
                  Additional Rate for Company
                </p>
              )}


              {showAdditionalDetails ? (
                <div>
                  <h2
                    className="mt-6 text-center text-2xl font-semibold"
                    onClick={() =>
                      setShowAdditionalDetails(!showAdditionalDetails)
                    }
                  >
                    Additional Details
                  </h2>

                  <FieldForm
                    form={form}
                    name="dispatch.dispatchAdditionalDetails.deliveryType"
                    label="Delivery Type"
                    type="text"
                  />
                  <FieldForm
                    form={form}
                    name="dispatch.dispatchAdditionalDetails.manualLRNo"
                    label="Manual LRNo"
                    type="text"
                  />
                  <FieldForm
                    form={form}
                    name="dispatch.dispatchAdditionalDetails.brokerCommission"
                    label="Broker Commission"
                    type="number"
                  />
                  <FieldForm
                    form={form}
                    name="dispatch.dispatchAdditionalDetails.shippingRisk"
                    label="Shipping Risk"
                    type="text"
                  />

                  <FormField
                    control={form.control}
                    name="dispatch.dispatchAdditionalDetails.insurance.isInsured"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex items-center justify-center gap-4">
                          <FormLabel className="text-nowrap text-sm lg:text-base">
                            Insurance:
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
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  {form.getValues(
                    "dispatch.dispatchAdditionalDetails.insurance.isInsured",
                  ) === "Yes" ? (
                    <>
                      <h2 className="mt-6 text-center text-xl font-semibold">
                        Insurance Details
                      </h2>

                      <FieldForm
                        form={form}
                        name="dispatch.dispatchAdditionalDetails.insurance.insuranceProvider"
                        label="Insurance Provider"
                        type="text"
                      />
                      <FieldForm
                        form={form}
                        name="dispatch.dispatchAdditionalDetails.insurance.policyNo"
                        label="Policy No"
                        type="text"
                      />
                      <FieldForm
                        form={form}
                        name="dispatch.dispatchAdditionalDetails.insurance.policyAmount"
                        label="Policy Amount"
                        type="number"
                      />
                      <FieldForm
                        form={form}
                        name="dispatch.dispatchAdditionalDetails.insurance.claimAmount"
                        label="Claim Amount"
                        type="number"
                      />
                      <FieldForm
                        form={form}
                        name="dispatch.dispatchAdditionalDetails.insurance.brokerDetails"
                        label="Broker Details"
                        type="text"
                      />
                    </>
                  ) : null}
                </div>
              ) : (
                <p
                  className="my-6 max-w-full rounded-lg bg-blue-500 px-8 py-2 text-center text-xl font-semibold text-white shadow-md hover:bg-blue-700"
                  onClick={() =>
                    setShowAdditionalDetails(!showAdditionalDetails)
                  }
                >
                  Additional Details
                </p>
              )}



            
             

              {/* 
              
              Modified the style of this component
              
              <h2 className="mt-6 text-center text-2xl font-semibold">
                e-way Bill Details
              </h2>
              <FieldForm
                form={form}
                name="dispatch.dispatchDetails.consignorInvoiceDetails.eWayBillDetails.eWayBillNo"
                label="E-Way Bill No"
                type="text"
              />
              <FieldForm
                form={form}
                name="dispatch.dispatchDetails.consignorInvoiceDetails.eWayBillDetails.eWayBillDate"
                label="E-Way Bill Date"
                type="date"
              />
              <FieldForm
                form={form}
                name="dispatch.dispatchDetails.consignorInvoiceDetails.eWayBillDetails.expDate"
                label="Exp-Date "
                type="date"
              /> */}
              
            </div>

            <div className="flex w-full max-w-xl flex-col gap-0">
             
              {showConsignorInvoiceDetail ? (
                <div>
                  <h2
                    className="mt-6 text-center text-2xl font-semibold"
                    onClick={() =>
                      setShowConsignorInvoiceDetail(!showConsignorInvoiceDetail)
                    }
                  >
                    Consignor Invoice Details
                  </h2>
                  <div className="flex items-center space-x-4">
                    <FormField
                      control={form.control}
                      name="dispatch.dispatchDetails.consignorInvoiceDetails.isPODCompulsory"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-4">
                          <FormLabel className="whitespace-nowrap">
                            POD Compulsory (Yes/No)
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value ? "Yes" : "No"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dispatch.dispatchDetails.consignorInvoiceDetails.podType"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-4">
                          {/* <FormLabel className="whitespace-nowrap">POD Type</FormLabel> */}
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value ? "hardCopy" : "softCopy"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="hardCopy">
                                Hard Copy
                              </SelectItem>
                              <SelectItem value="softCopy">
                                Soft Copy
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FieldForm
                    form={form}
                    name="dispatch.dispatchDetails.consignorInvoiceDetails.consignorInvoiceDate"
                    label="Consignor - Invoice Date"
                    type="date"
                  />
                  <FieldForm
                    form={form}
                    name="dispatch.dispatchDetails.consignorInvoiceDetails.consignorDeliveryNo"
                    label="Consignor - Delivery No"
                    type="text"
                  />
                  <FieldForm
                    form={form}
                    name="dispatch.dispatchDetails.consignorInvoiceDetails.consignorInvoiceNo"
                    label="Consignor - Invoice No"
                    type="text"
                  />
                  <FieldForm
                    form={form}
                    name="dispatch.dispatchDetails.consignorInvoiceDetails.valueOfGoods"
                    label="Value of Goods (Rs.)"
                    type="number"
                  />
                </div>
              ) : (
                <p
                  className="my-6 max-w-full rounded-lg bg-blue-500 px-8 py-2 text-center text-xl font-semibold text-white shadow-md hover:bg-blue-700"
                  onClick={() =>
                    setShowConsignorInvoiceDetail(!showConsignorInvoiceDetail)
                  }
                >
                  Consignor Invoice Details
                </p>
              )}

              {showAdditionalRateForVehicle? (
                <div>



      
              <h2 className="mt-6 text-center text-2xl font-semibold"
               onClick={() =>
                    setShowAdditionalRateForVehicle(!showAdditionalRateForVehicle)
                  }
              >
                Additional Rate for Vehicle hired
              </h2>
              <AdditionalChargers
                form={form}
                nameValue="dispatch.dispatchAdditionalRate"
              />

              </div>
              ):(
              <div>
                
                 <p
                  className="my-6 max-w-full rounded-lg bg-blue-500 px-8 py-2 text-center text-xl font-semibold text-white shadow-md hover:bg-blue-700"
                  onClick={() =>
                    setShowAdditionalRateForVehicle(!showAdditionalRateForVehicle)
                  }
                >
                  Additional Rate for Vehicle hired
                </p>
                </div>

                )}
            </div>
          </div>

          <div className="flex w-full items-center justify-center">
            <Button type="submit" className="mt-8 w-full lg:w-1/3 ">
              {isloading ? "Loading..." : " Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DispatchVehicle;
