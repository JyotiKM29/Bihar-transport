"use client";
import { IoIosArrowBack } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm , useFieldArray} from "react-hook-form";
import { Button } from "../../../../components/ui/button";
import { useContext, useState } from "react";
import * as z from "zod";
import { useToast } from "../../../../components/ui/use-toast";
import { UserContext } from "../../../../context/UserContextProvider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../../components/ui/form";
import { Input } from "@/app/components/ui/input";
import FieldForm from "../../FieldForm";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import CartTable from "../CartTable";

const additionalChargeSchema = z.object({
  chargeName: z.string(),
  rate: z.coerce.number(),
  qty: z.coerce.number(),
  amount: z.coerce.number(),
});

const formSchema = z.object({
  customer: z.string(),
  customerId: z.string(),
  fromLocation: z.string(),
  toLocation: z.string(),
  searchItemProduct: z.string(),
  way: z.enum(["One Way", "Two Way", "Returning"]),
  rateAsPer: z.enum(["Weight", "Quantity", "Distance", "Per Trip", "Fixed"]),

  // Weight details
  fromWeight: z.coerce.number(),
  toWeight: z.coerce.number(),
  weightUnit: z.string(),

  // Vehicle details
  vehicleType: z.string(),

  // Quantity details
  fromQty: z.coerce.number(),
  toQty: z.coerce.number(),
  qtyUnit: z.string(),

  // Distance details
  openingKM: z.coerce.number(),
  closingKM: z.coerce.number(),

  // Per trip details
  fromTrip: z.coerce.number(),
  toTrip: z.coerce.number(),

  // Rates
  partyRate: z.object({
    rate: z.coerce.number(),
    freight: z.coerce.number(),
  }),
  vehicleHireRate: z.object({
    rate: z.coerce.number(),
    freight: z.coerce.number(),
  }),

  // Additional charges
  additionalCharges: z.array(additionalChargeSchema),
});

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const VehicleEntry = () => {
  const { toast } = useToast();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();

  const initialFormState = {
    customer: undefined,
    customerId: undefined,
    fromLocation: undefined,
    toLocation: undefined,
    searchItemProduct: undefined,
    way: undefined,
    rateAsPer: undefined,

    // Weight details
    fromWeight: undefined,
    toWeight: undefined,
    weightUnit: undefined,

    // Vehicle details
    vehicleType: undefined,

    // Quantity details
    fromQty: undefined,
    toQty: undefined,
    qtyUnit: undefined,

    // Distance details
    openingKM: undefined,
    closingKM: undefined,

    // Per trip details
    fromTrip: undefined,
    toTrip: undefined,

    // Rates
    partyRate: {
      rate: undefined,
      freight: undefined,
    },
    vehicleHireRate: {
      rate: undefined,
      freight: undefined,
    },

    // Additional charges
    additionalCharges: [],
  };

  const { reset, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "additionalCharges",
  });

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };



  async function MyHandleSubmit(values) {
    console.log("price :", values);

    try {
      const response = await fetch("api/setting/priceSetting/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      console.log(response);

      const newResult = await response.json();

      if (response.ok) {
        setIsLoading(false);
        displayToast(
          "Successfully Price Setting updated",
          "✅",
        );
        const userDetail = newResult.user;
        reset(initialFormState);
      } else {
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

  function handleBack() {
    route.back();
  }
  const addProduct = (product) => {
    append(product);
    form.setValue("additionalCharges", {
      chargeName: "",
      rate: 0,
      qty: 0,
     
      amount: 0,
     
    });
  };

  const deleteProduct = (index) => {
    remove(index);
  };

  const editProduct = (index, updatedProduct) => {
    update(index, updatedProduct);
  };

  return (
    <div className="min-h-[90vh] rounded-xl bg-white p-8 shadow-2xl">
      <div>
        <Button onClick={handleBack} className="bg-indigo-600 hover:bg-indigo-700 flex gap-4">
        <IoIosArrowBack />
        Back</Button>
      </div>
      <h2 className=" mb-10 text-center text-3xl font-semibold text-indigo-800 underline">
      New Price Setting
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(MyHandleSubmit)} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-x-6 lg:grid-cols-2 border border-indigo-100 shadow-xl bg-indigo-200 rounded-2xl px-8 py-6">
            <FieldForm
              form={form}
              nameValue="customer"
              label="Customer"
              type="text"
            />
            <FieldForm
              form={form}
              nameValue="customerId"
              label="Customer Id "
              type="text"
            />
            <FieldForm
              form={form}
              nameValue="fromLocation"
              label=" From Location"
              type="text"
            />
            <FieldForm
              form={form}
              nameValue="toLocation"
              label="To Location "
              type="text"
            />
            <FieldForm
              form={form}
              nameValue="searchItemProduct"
              label="Search Item Product "
              type="text"
            />
             <FieldForm
              form={form}
              nameValue="vehicleType"
              label="Vehicle Type"
              type="text"
            />
          
            
              <FormField
                  control={form.control}
                 name="way"
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

<FormField
                  control={form.control}
                 name="rateAsPer"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center gap-4">
                        <FormLabel className="text-nowrap text-sm lg:text-base">
                          Rate as per:
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
                            <SelectItem value="Weight">Weight</SelectItem>
                            <SelectItem value="Quantity">Quantity</SelectItem>
                            <SelectItem value="Distance">Distance</SelectItem>
                            <SelectItem value="Per Trip">Per Trip</SelectItem>
                            <SelectItem value="Fixed">Fixed</SelectItem>
                           
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                </div>

<div className="grid grid-cols-1 gap-x-6 lg:grid-cols-2 border border-indigo-100 shadow-xl bg-indigo-50 rounded-2xl px-8 py-6">

<p className="col-span-2 text-center font-medium underline text-xl text-indigo-800  mb-4">Weight</p>
          
            <FieldForm
              form={form}
              nameValue="fromWeight"
              label=" From Weight"
              type="text"
            />
            <FieldForm
              form={form}
              nameValue="toWeight"
              label=" To Weight"
              type="text"
            />
            <FieldForm
              form={form}
              nameValue="weightUnit"
              label="Weight Unit"
              type="text"
            />
           

<p className="col-span-2 text-center font-medium underline text-xl text-indigo-800 mt-6 mb-4">Quantity</p>
   
            <FieldForm
              form={form}
              nameValue="fromQty"
              label=" From Qty"
              type="text"
            />
            <FieldForm
              form={form}
              nameValue="toQty"
              label=" To Qty"
              type="text"
            />
            <FieldForm
              form={form}
              nameValue="qtyUnit"
              label="Qty Unit "
              type="text"
            />
<p className="col-span-2 text-center font-medium underline text-xl text-indigo-800 mt-6 mb-4">Distance</p>
   
            <FieldForm
              form={form}
              nameValue="openingKM"
              label="Opening KM "
              type="text"
            />
            <FieldForm
              form={form}
              nameValue="closingKM"
              label="Closing KM "
              type="text"
            />
            <p className="col-span-2 text-center font-medium underline text-xl text-indigo-800 mt-6 mb-4">Trip</p>
   
            <FieldForm
              form={form}
              nameValue="fromTrip"
              label="From Trip "
              type="text"
            />
            <FieldForm
              form={form}
              nameValue="toTrip"
              label="To Trip "
              type="text"
            />

<p className="col-span-2 text-center font-medium underline text-xl text-indigo-800 mt-6 mb-4">Party Rate</p>
   
            <FieldForm
              form={form}
              nameValue="partyRate.rate"
              label="Rate"
              type="text"
            />
            <FieldForm
              form={form}
              nameValue="partyRate.freight"
              label="Freight "
              type="text"
            />

<p className="col-span-2 text-center font-medium underline text-xl text-indigo-800 mt-6 mb-4">Vehicle Rate</p>
   
            <FieldForm
              form={form}
              nameValue="vehicleHireRate.rate"
              label="Rate "
              type="text"
            />
            <FieldForm
              form={form}
              nameValue="vehicleHireRate.freight"
              label="Freight "
              type="text"
            />
          </div>

          <div className="grid grid-cols-1 gap-x-6 lg:grid-cols-2 border border-cyan-100 shadow-xl bg-cyan-50 rounded-2xl px-8 py-6">
          <p className="col-span-2 text-center font-medium underline text-xl text-cyan-800  mb-4">Additional Chargers</p>
          <FieldForm
              form={form}
              nameValue="additionalCharges.chargeName"
              label="Charge Name "
              type="text"
            />
          <FieldForm
              form={form}
              nameValue="additionalCharges.rate"
              label="Rate"
              type="text"
            />
          <FieldForm
              form={form}
              nameValue="additionalCharges.qty"
              label="Quantity"
              type="text"
            />
          <FieldForm
              form={form}
              nameValue="additionalCharges.amount"
              label="Amount "
              type="text"
            />
            <div className="col-span-2 flex justify-center">
            <Button
              type="button"
              className=' w-1/5 mt-3 mb-6 bg-green-800 hover:bg-green-900 focus:bg-green-900'
              onClick={() => addProduct(form.getValues("product"))}
            >
              Add Product
            </Button>
            </div>
         
            <div className="col-span-2 mt-8">

            <CartTable
          items={fields}
          onDelete={deleteProduct}
          onEdit={editProduct}
          form={form}
        />
            </div>
          
          </div>
          <div className="mt-10 flex w-full justify-center">
            <Button type="submit" className="h-12 w-full text-lg lg:w-1/3 bg-indigo-600 hover:bg-indigo-700">
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VehicleEntry;
