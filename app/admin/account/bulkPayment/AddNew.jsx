"use client";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FieldForm from "../../component/FieldForm";
import { Button } from "../../../components/ui/button";
import SearchVOD from "./SearchVOD";
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
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";

const formSchema = z.object({
  adminId: z.string(),
  date: z.coerce.date(),
  vehicleNo: z.string(),
  recieveFrom: z.string(),
  recieveAmount: z.coerce.number().min(0),
  paymentMode: z.string(),
  remarks: z.string(),
});

const AddNew = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);
  const [bookingData, setBookingData] = useState([]);
  const [orderNO, setOrderNo] = useState([]);
  const [loadIt, setLoadIt] = useState(false);

  const initialFormState = {
    adminId: '',
    date: new Date().toISOString().split("T")[0],
    vehicleNo: undefined,
    recieveFrom: undefined,
    recieveAmount: undefined,
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
      const response = await fetch("/api/accounting/bulkPayment", {
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
        displayToast("New Bulk Payment Created", "✅");
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
  }

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  const fetchBookingDetails = async (vehicleNo) => {
    try {
      setOrderNo([]);
      console.log("vehicle no : ", vehicleNo);
      const response = await fetch(`/api/vehicledetails/${vehicleNo}`);
      const result = await response.json();
      await setBookingData(result.data?.bookedBy);
      console.log("booking data:  ", bookingData);
      await fetchOrderNo();
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
    }
  };

  useEffect(() => {
    if (form.getValues("vehicleNo")) {
      fetchBookingDetails(form.getValues("vehicleNo"));
    }
  }, [form.getValues("vehicleNo")]);

  const fetchOrderNo = async function () {
    bookingData.forEach(async (booking) => {
      console.log("it's started...");
      try {
        const data = await fetch(`/api/bookingdetails/${booking.bookingId}`);
        const newData = await data.json();
        if (newData.booking.orderNumber) {
          setOrderNo((prevState) => [...prevState, newData.booking.orderNumber]);
        } else {
          setOrderNo((prevState) => [...prevState, "Not Found"]);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    });
    console.log(orderNO);
  };

  useEffect(() => {
    if (bookingData.length > 0) {
      console.log("okay...");
      fetchOrderNo();
    }
  }, [bookingData, loadIt]);

  const calculateTotalAmount = () => {
    return bookingData.reduce((total, item) => total + item.driverBhara, 0);
  };

  const calculatePendingAmount = () => {
    return bookingData.reduce((total, item) => total + item.commission, 0);
  };

  const calculateNetBhara = () => {
    return bookingData.reduce((total, item) => total + item.netBhara, 0);
  };

  const calculateTotalAfterPayment = ()=>{
    return bookingData.reduce((total, item) => total + item.afterPayment, 0);
  }

   const calculateTotalBalanceAmount = ()=>{
    return bookingData.reduce((total, item) => total + item.balanceAmount, 0);
  }


  

  const totalDriverBhara = calculateTotalAmount();
  const totalCommission = calculatePendingAmount();
  const totalNetBhara = calculateNetBhara();
  const totalAfterpayment = calculateTotalAfterPayment();
  const totalBalanceAmount = calculateTotalBalanceAmount();


  /*

  let remainingAmount = receivedAmount;
    const updatedBookingData = bookingData.map((item) => {
      const totalBillingAmount = item.balanceAmount;
      const receiveAmount = Math.min(remainingAmount, totalBillingAmount);
      remainingAmount -= receiveAmount;
      return {
        ...item,
        receivedAmount: receiveAmount,
        afterPayment: totalBillingAmount - receiveAmount,
      };
    });



  */





  const distributeReceivedAmount = (receivedAmount) => {
    let remainingAmount = receivedAmount;
    const updatedBookingData = bookingData.map((item) => {
      const totalBillingAmount = item.netBhara;
      const receiveAmount = Math.min(remainingAmount, totalBillingAmount);
      remainingAmount -= receiveAmount;
      return {
        ...item,
        receiveAmount: receiveAmount,
        afterPayment: totalBillingAmount - receiveAmount,
      };
    });
    setBookingData(updatedBookingData);
  };

  const handleReceiveAmountChange = (e) => {
    
    const receiveAmount = parseFloat(e.target.value);
    if(receiveAmount > totalNetBhara){
    form.setValue("recieveAmount", totalNetBhara);
    distributeReceivedAmount(totalNetBhara);
    }
    else {
       form.setValue("recieveAmount", receiveAmount);
    distributeReceivedAmount(receiveAmount);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(myhandleSubmit)}>
        <h2 className="text-center text-xl font-semibold">New Bulk Payment:</h2>
        <FieldForm form={form} name="date" label="Date" type="date" />
        <FormField
          control={form.control}
          name="recieveFrom"
          render={({ field }) => (
            <SearchVOD
              form={form}
              field={field}
              label="Received From"
              fetchBookingDetails={fetchBookingDetails}
            />
          )}
        />
        <FieldForm
          form={form}
          name="vehicleNo"
          label="Vehicle No"
          type="text"
        />
        <div onChange={handleReceiveAmountChange}>
          <FieldForm
            form={form}
            name="recieveAmount"
            label={`Received Amount (Rs), less than ${totalNetBhara}`}
            type="number"
          />
        </div>
        <FormField
          control={form.control}
          name="paymentMode"
          render={({ field }) => (
            <FormItem className="flex items-center justify-center gap-4">
              <FormLabel className="text-nowrap text-sm lg:text-base">
                Paid By:
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
                  <SelectItem value="SBI">STATE BANK OF INDIA (SBI)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FieldForm form={form} name="remarks" label="Remarks" type="text" />
        <div className="my-8 flex items-center justify-center">
          <Button type="submit" className="w-full lg:w-1/3">
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </form>

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
                Arranged By
              </th>
              <th className="text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900 md:text-base">
                Rate As Per
              </th>
              <th className="text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900 md:text-base">
                Remarks
              </th>
              <th className="text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900 md:text-base">
                DriverBhara
              </th>
              <th className="text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900 md:text-base">
                Net Bhara
              </th>
              <th className="text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900 md:text-base">
                Payble Amount
              </th>
              <th className="text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900 md:text-base">
                Paid Amount
              </th>
              <th className="text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-blue-900 md:text-base">
                After Payment
              </th>
            </tr>
          </thead>
          <tbody>
            {bookingData.length > 0 &&
              bookingData.map((item, index) => (
                <tr key={index} className="w-full text-center">
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {index + 1}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {orderNO[index]}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {item?.arrangedBy}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {item?.rateAsPer}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {item?.remarks}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {item?.driverBhara}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {item?.netBhara}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {item?.balanceAmount}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {item?.receiveAmount || 0}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {item?.afterPayment === undefined
                      ? item?.balanceAmount
                      : item?.afterPayment}
                  </td>
                </tr>
              ))}
            {bookingData.length > 0 && (
              <tr className="w-full border border-blue-900 bg-blue-100 text-center font-semibold text-blue-950">
                <td
                  colSpan="4"
                  className="border border-blue-900 p-2 text-blue-950"
                >
                  TOTAL
                </td>
                <td className="border border-blue-900 p-2 text-blue-950"></td>
                <td className="border border-blue-900 p-2 text-blue-950">
                  {totalDriverBhara}
                </td>
                <td className="border border-blue-900 p-2 text-blue-950">
                  {totalNetBhara}
                </td>
                <td className="border border-blue-900 p-2 text-blue-950">
                  {totalBalanceAmount}
                </td>
                <td className="border border-blue-900 p-2 text-blue-950">
                  {form.getValues("recieveAmount") || 0}
                </td>
                <td className="border border-blue-900 p-2 text-blue-950">
                  {totalAfterpayment || totalBalanceAmount}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Form>
  );
};

export default AddNew;
