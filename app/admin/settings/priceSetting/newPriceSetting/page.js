"use client";
import { IoIosArrowBack } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "../../../../components/ui/button";
import { useContext, useState } from "react";
import * as z from "zod";
import { useToast } from "../../../../components/ui/use-toast";
import { UserContext } from "../../../../context/UserContextProvider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Input } from "@/app/components/ui/input";
import FieldForm from "../../FieldForm";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import CartTable from "./CartTable";
import SearchLedger from "./SearchLedger";
import SearchItem from "./SearchItem";
import SearchVehicleType from "./SearchVehicleType";

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
  fromWeight: z.coerce.number().optional(),
  toWeight: z.coerce.number().optional(),
  weightUnit: z.string().optional(),

  // Vehicle details
  vehicleType: z.string().optional(),

  // Quantity details
  fromQty: z.coerce.number().optional(),
  toQty: z.coerce.number().optional(),
  qtyUnit: z.string().optional(),

  // Distance details
  openingKM: z.coerce.number().optional(),
  closingKM: z.coerce.number().optional(),

  // Per trip details
  fromTrip: z.coerce.number().optional(),
  toTrip: z.coerce.number().optional(),

  // Rates
  partyRate: z.object({
    rate: z.coerce.number().optional(),
    freight: z.coerce.number().optional(),
  }),
  vehicleHireRate: z.object({
    rate: z.coerce.number().optional(),
    freight: z.coerce.number().optional(),
  }),

  // Additional charges
  additionalCharges: z.array(additionalChargeSchema),
});



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
        displayToast("Successfully Price Setting updated", "✅");
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
        <Button
          onClick={handleBack}
          className="flex gap-4 bg-indigo-600 hover:bg-indigo-700"
        >
          <IoIosArrowBack />
          Back
        </Button>
      </div>
      <h2 className=" mb-10 text-center text-3xl font-semibold text-indigo-800 underline">
        Price Setting
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(MyHandleSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 gap-x-6 rounded-2xl border border-indigo-100 bg-indigo-200 px-8 py-6 shadow-xl lg:grid-cols-2">
            {/* <FieldForm
              form={form}
              nameValue="customer"
              label="Customer"
              type="text"
            /> */}
             <FormField
            control={form.control}
            name="customer"
            render={({ field }) => (
              <SearchLedger
             
                form={form}
                field={field}
                label="Customer"
              />
            )}
          />
            {/* <FieldForm
              form={form}
              nameValue="customerId"
              label="Customer Id "
              type="text"
            /> */}
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
            {/* <FieldForm
              form={form}
              nameValue="searchItemProduct"
              label="Search Item Product "
              type="text"
            /> */}

<FormField
                  control={form.control}
                  name="searchItemProduct"
                  render={({ field }) => (
                    <SearchItem
                     
                      form={form}
                      field={field}
                        label="Search Item Product "
                    />
                  )}
                />

            {/* <FieldForm
              form={form}
              nameValue="vehicleType"
              label="Vehicle Type"
              type="text"
            /> */}
            <FormField
                        control={form.control}
                        name="vehicleType"
                        render={({ field }) => (
                          <SearchVehicleType
                            form={form}
                            field={field}
                            label="Vehicle Type"
                          />
                        )}
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
                        <SelectItem value="Two Way">Two Way</SelectItem>
                        <SelectItem value="Returning">Returning</SelectItem>
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

          <div className="grid grid-cols-1 gap-x-6 rounded-2xl border border-indigo-100 bg-indigo-50 px-8 py-6 shadow-xl lg:grid-cols-2">
            {form.watch("rateAsPer", "Weight") === "Weight" && (
              <>
                <p className="col-span-2 mb-4 text-center text-xl font-medium text-indigo-800  underline">
                  Weight
                </p>

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
              </>
            )}
            {form.watch("rateAsPer", "Quantity") === "Quantity" && (
              <>
            <p className="col-span-2 mb-4 mt-6 text-center text-xl font-medium text-indigo-800 underline">
              Quantity
            </p>

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
               </>
            )}
            {form.watch("rateAsPer", "Distance") === "Distance" && (
              <>
            <p className="col-span-2 mb-4 mt-6 text-center text-xl font-medium text-indigo-800 underline">
              Distance
            </p>

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
               </>
            )}
            {form.watch("rateAsPer", "Per Trip") === "Per Trip" && (
              <>
            <p className="col-span-2 mb-4 mt-6 text-center text-xl font-medium text-indigo-800 underline">
              Trip
            </p>

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
   </>
            )}
            {form.watch("rateAsPer", "Fixed") === "Fixed" && (
              <>
            <p className="col-span-2 mb-4 mt-6 text-center text-xl font-medium text-indigo-800 underline">
              Party Rate
            </p>

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

            <p className="col-span-2 mb-4 mt-6 text-center text-xl font-medium text-indigo-800 underline">
              Vehicle Rate
            </p>

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
            </>)}
          </div>

          <div className="grid grid-cols-1 gap-x-6 rounded-2xl border border-cyan-100 bg-cyan-50 px-8 py-6 shadow-xl lg:grid-cols-2">
            <p className="col-span-2 mb-4 text-center text-xl font-medium text-cyan-800  underline">
              Additional Chargers
            </p>
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
                className=" mb-6 mt-3 w-1/5 bg-green-800 hover:bg-green-900 focus:bg-green-900"
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
            <Button
              type="submit"
              className="h-12 w-full bg-indigo-600 text-lg hover:bg-indigo-700 lg:w-1/3"
            >
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VehicleEntry;
