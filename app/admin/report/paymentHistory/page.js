
"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../../components/ui/button";
import { Form, FormField } from "../../../components/ui/form";
import { useContext, useState, useRef } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";
import InflationChart from "../vehicleNo/InflationChart";
import SearchVOD from "../vehicleNo/SearchVOD";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const formSchema = z.object({
  adminId: z.string(),
  vehicleNo: z.string(),
});

const VehicleNoBooking = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const tableRef = useRef();

  const initialFormState = {
    adminId: "",
    vehicleNo: "",
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  async function handleSubmit(value) {
    console.log(formSchema.safeParse(value));

    try {
      const res = formSchema.parse(value);
      console.log("solved", res);
    } catch (error) {
      console.log("hi", error);
    }

    value.adminId = user?._id;
    try {
      const response = await fetch("/api/report/vehicleNo", {
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
        displayToast("Successfully", "✅");
        console.log("New booking created!", newResult);
        setData(newResult.data);
        console.log('data :', data);
        form.reset(initialFormState);
      } else {
        console.error("Error:", newResult.message);
        displayToast("Error", "❌", newResult.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      displayToast("Error ", "❌", newResult.message);
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

  const dataBar = [
    data?.TotalBooking,
    data?.cancelledBooking,
    data?.pendingBooking,
    data?.confirmedBooking,
    data?.deliveredBooking,
  ];
  const categoryBar = [
    "Total Booking",
    "Cancelled Booking",
    "Pending Booking",
    "Confirm Booking",
    "Delivered Booking",
  ];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({ html: "#paymentTable" });
    doc.save("payment_history.pdf");
  };

  const calculateTotals = (payments) => {
    let totalTDS = 0;
    let totalReceived = 0;

    payments.forEach(items => {
      if (items?.TDS) {
        totalTDS += parseFloat(items.TDS);
      }
       if (items?.fine) {
        totalTDS += parseFloat(items.fine);
      }
      if (items?.paidAmount) {
        totalReceived += parseFloat(items.paidAmount);
      } else if (items?.recieveAmount) {
        totalReceived += parseFloat(items.recieveAmount);
      } else if (items?.amountPaid) {
        totalReceived += parseFloat(items.amountPaid);
      }
    });

    return { totalTDS, totalReceived };
  };

  const totals = calculateTotals(data?.newVehicle?.payment || []);

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex max-w-full flex-col items-center justify-between gap-4 md:flex-row"
        >
          <div className="flex-1">
            <FormField
              control={form.control}
              name="vehicleNo"
              render={({ field }) => (
                <SearchVOD form={form} field={field} label="Vehicle No" />
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full lg:w-1/5 shadow-md bg-violet-500 hover:bg-violet-700 text-white"
          >
            {isLoading ? "Loading..." : "Generate Report"}
          </Button>
        </form>
      </Form>

      {data && Object.keys(data).length > 0 && (
        <div className="max-h grid-col-1 grid max-w-full bg-teal-100 md:grid-cols-2 p-4 shadow-xl px-6 rounded-xl mb-8">
          <label className="flex gap-2">
            <h2 className="mr-3 text-nowrap text-lg font-semibold">
              Total Booking:
            </h2>
            <p className="mr-3 text-nowrap text-lg "> {data.TotalBooking}</p>
          </label>
          <label className="flex gap-2">
            <h2 className="mr-3 text-nowrap text-lg font-semibold">
              Cancelled Booking:
            </h2>
            <p className="mr-3 text-nowrap text-lg ">
              {" "}
              {data.statusData.Cancelled}
            </p>
          </label>
          <label className="flex gap-2">
            <h2 className="mr-3 text-nowrap text-lg font-semibold">
              Pending Booking:
            </h2>
            <p className="mr-3 text-nowrap text-lg "> {data.statusData.Pending}</p>
          </label>
          <label className="flex gap-2">
            <h2 className="mr-3 text-nowrap text-lg font-semibold">
              Confirm Booking:
            </h2>
            <p className="mr-3 text-nowrap text-lg ">
              {" "}
              {data.statusData.Confirmed}
            </p>
          </label>
          <label className="flex gap-2">
            <h2 className="mr-3 text-nowrap text-lg font-semibold">
              Delivered Booking:
            </h2>
            <p className="mr-3 text-nowrap text-lg ">
              {" "}
              {data.statusData.Delivered}
            </p>
          </label>
          <label className="flex gap-2">
            <h2 className="mr-3 text-nowrap text-lg font-semibold">
              Total Revenue:
            </h2>
            <p className="mr-3 text-nowrap text-lg "> {data.totalRevenue}</p>
          </label>
          <label className="flex gap-2">
            <h2 className="mr-3 text-nowrap text-lg font-semibold">
              Total Commission:
            </h2>
            <p className="mr-3 text-nowrap text-lg "> {data.totalCommision}</p>
          </label>
          <label className="flex gap-2">
            <h2 className="mr-3 text-nowrap text-lg font-semibold">
              Total Driver Earnings:
            </h2>
            <p className="mr-3 text-nowrap text-lg ">
              {" "}
              {data.totalDriverBhara}
            </p>
          </label>
        </div>
      )}

      <div className="w-2/3 h-5/6">
        {data && Object.keys(data).length > 0 ? (
          <InflationChart
            data={dataBar}
            category={categoryBar}
            totalValue={data.TotalBooking}
          />
        ) : (
          <p className="font-light text-red-700 ">
            No Data Available for this vehicle. Enter another vehicle no
          </p>
        )}
      </div>

      {data?.newVehicle?.payment.length > 0 && (
        <div>
          <h2 className="mb-4 mt-6 text-center text-2xl font-semibold text-sky-700 underline">
            Payment History
          </h2>
          <div className="overflow-x-auto xl:overflow-visible">
            <table id="paymentTable" className="mx-2 my-4 w-full border border-sky-600">
              <thead>
                <tr className="w-full border border-sky-600 bg-sky-200">
                  <th className="text-nowrap border border-sky-600 p-2 pr-3 text-sm font-medium text-sky-900 md:text-base">
                    Payment Date
                  </th>
                  <th className="text-nowrap border border-sky-600 p-2 pr-3 text-sm font-medium text-sky-900 md:text-base">
                    Paid Amount
                  </th>
                  <th className="text-nowrap border border-sky-600 p-2 pr-3 text-sm font-medium text-sky-900 md:text-base">
                    TDS
                  </th>
                  <th className="text-nowrap border border-sky-600 p-2 pr-3 text-sm font-medium text-sky-900 md:text-base">
                    Paid by
                  </th>
                  <th className="text-nowrap border border-sky-600 p-2 pr-3 text-sm font-medium text-sky-900 md:text-base">
                    Paid To (Driver, Owner, Vehicle No)
                  </th>
                  <th className="text-nowrap border border-sky-600 p-2 pr-3 text-sm font-medium text-sky-900 md:text-base">
                    Created By
                  </th>
                  <th className="text-nowrap border border-sky-600 p-2 pr-3 text-sm font-medium text-sky-900 md:text-base">
                    Narration
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.newVehicle?.payment.map((items, i) => {
                  const isFirstType = items?.paymentDate !== undefined;
                  const isSecondType = items?.recieveAmount !== undefined;
                  const isThirdType =
                    items?.amountPaid !== undefined && items?.fine !== undefined;

                  const createdBy = items?.createdBy?.name || items?.createdBy;
                  const remarks = items?.narration || items?.remarks;

                  return (
                    <tr key={i} className="w-full text-center">
                      <td className="border border-sky-900 p-2 text-sky-700">
                        {new Date(
                          isFirstType ? items?.paymentDate : items?.date
                        ).toLocaleDateString()}
                      </td>
                      {isFirstType ? (
                        <>
                          <td className="border border-sky-900 p-2 text-sky-700">
                            {items?.paidAmount}
                          </td>
                          <td className="border border-sky-900 p-2 text-sky-700">
                            {items?.TDS}
                          </td>
                          <td className="border border-sky-900 p-2 text-sky-700">
                            {items?.paidBy}
                          </td>
                          <td className="border border-sky-900 p-2 text-sky-700">
                            {items?.paidTo?.driverName},{" "}
                            {items?.paidTo?.ownerName},{" "}
                            {items?.paidTo?.vehicleNo}
                          </td>
                        </>
                      ) : isSecondType ? (
                        <>
                          <td className="border border-sky-900 p-2 text-sky-700">
                            {items?.recieveAmount}
                          </td>
                          <td className="border border-sky-900 p-2 text-sky-700">
                            {items?.TDS}
                          </td>
                          <td className="border border-sky-900 p-2 text-sky-700">
                            {items?.paymentMode}
                          </td>
                          <td className="border border-sky-900 p-2 text-sky-700">
                            {items?.recieveFrom}
                          </td>
                        </>
                      ) : isThirdType ? (
                        <>
                          <td className="border border-sky-900 p-2 text-sky-700">
                            {items?.amountPaid}
                          </td>
                          <td className="border border-sky-900 p-2 text-sky-700">
                            {items?.fine}
                          </td>
                          <td className="border border-sky-900 p-2 text-sky-700">
                            {items?.paymentMode}
                          </td>
                          <td className="border border-sky-900 p-2 text-sky-700">
                            {items?.createdBy}
                          </td>
                        </>
                      ) : null}
                      <td className="border border-sky-900 p-2 text-sky-700">
                        {createdBy}
                      </td>
                      <td className="border border-sky-900 p-2 text-sky-700">
                        {remarks}
                      </td>
                    </tr>
                  );
                })}
                <tr className="w-full text-center font-semibold">
                  <td className="border border-sky-900 p-2 text-sky-700">
                    Totals
                  </td>
                  <td className="border border-sky-900 p-2 text-sky-700">
                    {totals.totalReceived}
                  </td>
                  <td className="border border-sky-900 p-2 text-sky-700">
                    {totals.totalTDS}
                  </td>
                  <td colSpan="4" className="border border-sky-900 p-2 text-sky-700">
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Button onClick={handleExportPDF} className="mt-4 shadow-md bg-violet-500 hover:bg-violet-700 text-white">
            Export to PDF
          </Button>
        </div>
      )}
    </div>
  );
};

export default VehicleNoBooking;