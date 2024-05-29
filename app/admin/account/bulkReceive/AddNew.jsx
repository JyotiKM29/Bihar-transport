"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FieldForm from "../../component/FieldForm";
import { Button } from "../../../components/ui/button";
import SearchLedger from "./SearchLedger";
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

const formSchema = z.object({
  adminId: z.string(),
  date: z.coerce.date(),
  ledgerId: z.string(),
  recieveAmount: z.coerce.number().min(0),
  receivedFrom: z.string(),
  paymentMode: z.string(),
  remarks: z.string(),
});

const AddNew = () => {
  const [booking, setBooking] = useState([]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);
  const [bookingData, setBookingData] = useState([]);

  function extractMaterials(data) {
    return data?.item?.map((item) => item.material).join(", ");
  }

  // const calculateTotalAmount = () => {
  //   return bookingData.reduce(
  //     (total, item) => total + item?.totalBillingAmount,
  //     0,
  //   );
  // };

  const calculateTotalAmount = () => {
    const total = bookingData.reduce(
      (total, item) => total + item?.totalBillingAmount,
      0,
    );
    return parseFloat(total.toFixed(2));
  };

  const totalAmount = calculateTotalAmount();

  useEffect(() => {
    form.setValue(
      "recieveAmount",
      Math.min(form.getValues("recieveAmount"), totalAmount),
    );
  }, [totalAmount]);

  const initialFormState = {
    adminId: "",
    date: new Date().toISOString().split("T")[0],
    ledgerId: undefined,
    recieveAmount: undefined,
    receivedFrom: undefined,
    paymentMode: undefined,
    remarks: undefined,
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

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
      const response = await fetch("/api/accounting/bulkReceive", {
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
        displayToast("New Bulk Created", "✅");
        form.reset(initialFormState);
      } else {
        console.error("Error:", newResult.message);
        displayToast("Error", "❌", newResult.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      displayToast("Error: ", "❌", error.message);
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

  const distributeReceivedAmount = (receivedAmount) => {
    let remainingAmount = receivedAmount;
    const updatedBookingData = bookingData.map((item) => {
      const totalBillingAmount = item.totalBillingAmount;
      const receiveAmount = Math.min(remainingAmount, totalBillingAmount);
      remainingAmount -= receiveAmount;
      return {
        ...item,
        receivedAmount: receiveAmount,
        afterPayment: totalBillingAmount - receiveAmount,
      };
    });
    setBookingData(updatedBookingData);
  };

  const handleReceiveAmountChange = (e) => {
    const receiveAmount = parseFloat(e.target.value);
    if (receiveAmount > totalAmount) {
      form.setValue("recieveAmount", totalAmount);
    } else {
      form.setValue("recieveAmount", receiveAmount);
    }
    distributeReceivedAmount(receiveAmount);
  };

  // handle the original booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const data = await Promise.all(
          booking.map(async (booking) => {
            const response = await fetch(
              `/api/bookingdetails/${booking.savedBooking._id}`,
            );
            const result = await response.json();
            return result.booking ? result.booking : null;
          }),
        );
        const validData = data.filter((item) => item !== null);
        setBookingData(validData);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    fetchBookingDetails();
  }, [booking]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(myhandleSubmit)}>
          <h2 className="text-center text-xl font-semibold">
            New Bulk receive :
          </h2>

          <FormField
            control={form.control}
            name="receivedFrom"
            render={({ field }) => (
              <SearchLedger
                booking={booking}
                setBooking={setBooking}
                form={form}
                field={field}
                label="Received From"
              />
            )}
          />
          <FieldForm
            form={form}
            name="date"
            label="Received Date"
            type="date"
          />

          <div onChange={handleReceiveAmountChange}>
            <FieldForm
              form={form}
              name="recieveAmount"
              label={`Received Amount  (Rs) - Max: ${totalAmount}`}
              type="number"
            />
          </div>
          <FormField
            control={form.control}
            name="paymentMode"
            render={({ field }) => {
              return (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel className="text-nowrap text-sm lg:text-base">
                    Paid By :
                  </FormLabel>
                  <Select
                    className="flex flex-1 flex-col"
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Paid By" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CASH">CASH</SelectItem>
                      <SelectItem value="BANK">BANK</SelectItem>
                      <SelectItem value="SBI">
                        STATE BANK OF INDIA (SBI)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FieldForm form={form} name="remarks" label="Remarks" type="text" />

          <div className="my-8 flex items-center justify-center">
            <Button type="submit" className="w-full lg:w-1/3">
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="overflow-x-auto md:overflow-x-visible">
        <table className="mx-2 my-4 w-full border border-blue-600">
          <thead>
            <tr className="w-full border border-blue-600 bg-blue-200">
              <th className="text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900 md:text-base">
                S.No
              </th>
              <th className="text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900 md:text-base">
                Order No
              </th>
              <th className="text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900 md:text-base">
                Material
              </th>
              <th className="text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900 md:text-base">
                Party Bhara
              </th>
              <th className="text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900 md:text-base">
                Additional Charge
              </th>
              <th className="text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900 md:text-base">
                Total Billing Amount
              </th>
              <th className="text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900 md:text-base">
                Received Amount
              </th>
              <th className="text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900 md:text-base">
                After Payment
              </th>
            </tr>
          </thead>
          <tbody>
            {bookingData.length > 0 &&
              bookingData.map((items, i) => (
                <tr key={i} className="w-full text-center">
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {i + 1}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {items?.orderNumber}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {extractMaterials(items?.itemsList)}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {items?.partyBhara}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {items?.totalAdditionalCharges}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {items?.totalBillingAmount}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {items.receivedAmount || 0}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {items.afterPayment !== undefined
                      ? items.afterPayment
                      : items.totalBillingAmount}
                  </td>
                </tr>
              ))}
            <tr className="w-full border-t border-blue-600">
              <td
                className="border border-blue-900 p-2 text-blue-700"
                colSpan="4"
              >
                Total Amount
              </td>
              <td className="border border-blue-900 p-2 text-blue-700">
                {totalAmount}
              </td>
              <td className="border border-blue-900 p-2 text-blue-700">-</td>
              <td className="border border-blue-900 p-2 text-blue-700">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddNew;
