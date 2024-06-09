"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import FieldForm from "../component/FieldForm";
import { Button } from "../../components/ui/button";
import SearchProduct from "./SearchProduct";
import SearchCustomer from "./SearchCustomer";
import { Form, FormField } from "../../components/ui/form";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContextProvider";
import { useToast } from "../../components/ui/use-toast";
import CartTable from "./CartTable";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  adminId: z.string(),
  quoteDate: z.coerce.date(),
  quoteValidity: z.coerce.date(),
  customerDetails: z.object({
    customerId: z.string(),
    customerName: z.string(),
    customerAddress: z.string().optional(),
    customerMobileNo: z.coerce.number().optional(),
    customerEmail: z.string().optional(),
    customerGSTIN: z.string().optional(),
  }),
  products: z.array(
    z.object({
      productName: z.string(),
      itemSize: z.string().optional(),
      itemWeight: z.string().optional(),
      ETA: z.string().optional(),
      rate: z.coerce.number().optional(),
      rateAsPer: z.string().optional(),
      Advance: z.coerce.number().optional(),
    }),
  ),
});

const AddNew = () => {
  const route = useRouter();
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);

  const initialFormState = {
    adminId: "",
    quoteDate: new Date().toISOString().split("T")[0],
    quoteValidity: new Date().toISOString().split("T")[0],
    customerDetails: {
      customerId: generateUniqueId(),
      customerName: "",
      customerEmail: "",
      customerMobileNo: "",
      customerAddress: "",
      customerGSTIN: "",
    },
    products: [],
  };

  function generateUniqueId() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const addProduct = (product) => {
    append(product);
    form.setValue("product", {
      productName: "",
      itemSize: "",
      itemWeight: "",
      ETA: "",
      rate: 0,
      rateAsPer: "",
      Advance: 0,
    });
  };

  const deleteProduct = (index) => {
    remove(index);
  };

  const editProduct = (index, updatedProduct) => {
    update(index, updatedProduct);
  };

  async function myhandleSubmit(value) {
    const { customerDetails, ...rest } = value;
    const payload = {
      ...rest,
      adminId: user?._id,
    };

    if (customerDetails && Object.values(customerDetails).some((val) => val)) {
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
        body: JSON.stringify(payload),
      });
      console.log(response);

      const newResult = await response.json();

      if (response.ok) {
        setIsLoading(false);
        displayToast("Successfully Added new Quotation", "✅");
        console.log("quotation",newResult)
        form.reset(initialFormState);
        // move to detail page 
        route.push(`/admin/quotations/${newResult.id}`)

      } else {
        console.error("Error:", newResult.message);
        displayToast("Error", "❌ ", newResult.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      displayToast("Error", "❌ ", error.message);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(myhandleSubmit)}>
        <h2 className="text-center text-xl font-semibold">New Quotation :</h2>
        <FieldForm
          form={form}
          name="quoteDate"
          label="Quote Date"
          type="date"
        />
        <FieldForm
          form={form}
          name="quoteValidity"
          label="Quote Validity"
          type="date"
        />

        <div className="flex w-full gap-8">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="customerDetails.customerName"
              render={({ field }) => (
                <SearchCustomer form={form} field={field} label="Customer" />
              )}
            />
            <FieldForm
              form={form}
              name="customerDetails.customerId"
              label="Customer Id"
              type="text"
            />
            <FieldForm
              form={form}
              name="customerDetails.customerEmail"
              label="Customer Email"
              type="email"
            />
            <FieldForm
              form={form}
              name="customerDetails.customerMobileNo"
              label="Customer Phone"
              type="text"
            />
            <FieldForm
              form={form}
              name="customerDetails.customerAddress"
              label="Customer Address"
              type="text"
            />
            <FieldForm
              form={form}
              name="customerDetails.customerGSTIN"
              label="Customer GSTIN"
              type="text"
            />
          </div>

          <div className="flex-1">
            <FieldForm
              form={form}
              name="product.productName"
              label="Product Name"
              type="text"
            />
            <FieldForm
              form={form}
              name="product.itemSize"
              label="Item Size"
              type="text"
            />
            <FieldForm
              form={form}
              name="product.itemWeight"
              label="Item Weight"
              type="text"
            />
            <FieldForm form={form} name="product.ETA" label="ETA" type="text" />
            <FieldForm
              form={form}
              name="product.rate"
              label="Rate"
              type="number"
            />
            <FieldForm
              form={form}
              name="product.rateAsPer"
              label="Rate As Per"
              type="text"
            />
            <FieldForm
              form={form}
              name="product.Advance"
              label="Advance"
              type="number"
            />
            <Button
              type="button"
              onClick={() => addProduct(form.getValues("product"))}
            >
              Add Product
            </Button>
          </div>
        </div>

        <CartTable
          items={fields}
          onDelete={deleteProduct}
          onEdit={editProduct}
          form={form}
        />

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
