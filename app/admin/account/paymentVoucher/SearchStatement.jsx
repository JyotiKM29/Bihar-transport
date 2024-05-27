"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FieldForm from "../../component/FieldForm";
import { Button } from "../../../components/ui/button";
import { Form } from "../../../components/ui/form";
import { useContext, useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";
import { DataTable } from "../data-table";
import ColumnHeader from "./ColumnHeader";

const formSchema = z.object({
  adminId: z.string(),
  fromDate: z.coerce.date(),
  toDate: z.coerce.date(),
});

const SearchBooking = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const columns = ColumnHeader();

  const initialFormState = {
    adminId: "",
    fromDate: new Date().toISOString().split("T")[0],
    toDate: new Date().toISOString().split("T")[0],
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  const myhandleSubmit = async (value) => {
    console.log(formSchema.safeParse(value));

    setIsLoading(true);

    try {
      const res = formSchema.parse(value);
      console.log("solved", res);
    } catch (error) {
      console.log("hi", error);
      setIsLoading(false);
      return;
    }

    value.adminId = user?._id;

    try {
      const response = await fetch("/api/accounting/statementPaymentVoucher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      const newResult = await response.json();

      if (response.ok) {
        setIsLoading(false);
        displayToast("Successfully", "✅");
        setData(newResult.voucherData); // Correct data assignment
        console.log("data :", newResult.voucherData);
        form.reset(initialFormState);
      } else {
        console.error("Error:", newResult.message);
        displayToast("Error", "❌", newResult.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      displayToast("Error ", "❌", error.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(myhandleSubmit)}
          className="flex max-w-full flex-col items-center justify-between gap-4 md:flex-row "
        >
          <div className="flex-1">
            <FieldForm
              form={form}
              name="fromDate"
              label="From Date"
              type="date"
            />
          </div>
          <div className="flex-1">
            <FieldForm form={form} name="toDate" label="To Date" type="date" />
          </div>
          <Button
            type="submit"
            className="w-full bg-violet-500 text-white shadow-md hover:bg-violet-700 lg:w-1/5 "
          >
            {isLoading ? "Loading..." : "Generate Report"}
          </Button>
        </form>
      </Form>

      <div className="flex w-full gap-8">
        {data && data.length > 0 && (
          <DataTable columns={columns} data={data} />
        )}
      </div>
    </div>
  );
};

export default SearchBooking;
