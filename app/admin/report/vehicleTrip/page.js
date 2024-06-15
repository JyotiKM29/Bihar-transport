"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../../components/ui/button";
import { Form, FormField } from "../../../components/ui/form";
import { useContext, useState, useRef, useEffect } from "react";
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
  const [newData, setNewData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
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
      setIsLoading(true);

      console.log("newData:", newData);

      const filteredData = newData.filter((item) => {
        return item.vehicleData?.vehicleNo === value.vehicleNo;
      });

      setFilteredData(filteredData);
      setData(filteredData)
      setIsLoading(false);
      displayToast("Successfully", "✅");
      console.log("Filtered data:", filteredData);
      form.reset(initialFormState);
    } catch (error) {
      console.error("Error:", error);
      displayToast("Error", "❌", error.message);
      setIsLoading(false);
    }
  }

  const userId = user?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const response = await fetch(
            `/api/accounting/fullLoadHireRegister/get/${userId}`,
            {
              method: "GET",
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();

          console.log("pending payment ", result);

          setNewData(result?.bookings || []);
          setLoading(false);

          console.log(newData);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [userId]);

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
  // Initialize jsPDF and set up the document
  const doc = new jsPDF();

  // Format 'from' and 'to' fields before rendering in PDF
  const formattedData = data.map((item, index) => ({
    ...item,
    from: item.loadingPoint ? item.loadingPoint.join(", ") : "",
    to: item.unloadingPoint ? item.unloadingPoint.join(", ") : "",
  }));

  // Generate the PDF table directly from formatted data
  doc.autoTable({
    head: [
      [
        'SI No.', 'Date', 'LR No.', 'Vehicle No.', 'From', 'To', 'Bill To',
        'Qty', 'A. Weight', 'C. Weight', 'Rate', 'Hire Amt', 'Other Charges',
        'Shortage', 'Advance', 'Total Amt'
      ]
    ],
    body: formattedData.map(row => [
      row.index + 1, new Date(row.date).toLocaleDateString(), row.orderNumber,
      row.vehicleData.vehicleNo, row.loadingPoints, row.unloadingPoints,
      row.billTo, row.itemsList.item[0]?.quantity + row.itemsList.item[0]?.quantityUnit,
      row.itemsList.totalActualWeight + row.itemsList.item[0]?.actualWeightUnit,
      row.itemsList.item[0]?.chargedWeight + row.itemsList.item[0]?.actualWeightUnit,
      row.itemsList.item[0]?.rate + ' per ' + row.itemsList.item[0]?.rateAsPer,
      row.totalBillingAmount, row.additionalCharges?.totalCharge, row.shortage,
      row.advanceAmount, row.totalBillingAmount
    ]),
    startY: 10,
  });

  // Save the PDF with a name
  doc.save("booking_report.pdf");
};

 const calculateTotals = (data) => {
  let totalQty = 0;
  let totalActualWeight = 0;
  let totalBillingAmount = 0;
  let totalAdditionalCharge = 0;

  data.forEach((item) => {
    totalQty += item.itemsList.item[0]?.quantity || 0;
    totalActualWeight += item.itemsList.totalActualWeight || 0;
    totalBillingAmount += item.totalBillingAmount || 0;
    totalAdditionalCharge += item.additionalCharges?.totalCharge||0;
  });

  return {
    totalQty,
    totalActualWeight,
    totalBillingAmount,
    totalAdditionalCharge,
  };
};

let totals = calculateTotals(data);


useEffect(()=>{
totals = calculateTotals(data);
},[data])

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

      {filteredData.length > 0 && (
        <div className="overflow-x-auto xl:overflow-visible mt-4">
          <h2 className="mb-4 text-center text-2xl font-semibold text-sky-700 underline">
            Booking Report
          </h2>
          <table id="bookingTable" className="mx-2 my-4 w-full border border-sky-600">
            <thead>
              <tr className="w-full border border-sky-600 bg-sky-200">
                <th className="border border-sky-600 p-2 text-sky-900">SI No.</th>
                <th className="border border-sky-600 p-2 text-sky-900">Date</th>
                <th className="border border-sky-600 p-2 text-sky-900">LR No.</th>
                <th className="border border-sky-600 p-2 text-sky-900">Vehicle No.</th>
                <th className="border border-sky-600 p-2 text-sky-900">From</th>
                <th className="border border-sky-600 p-2 text-sky-900">To</th>
                <th className="border border-sky-600 p-2 text-sky-900">Bill To</th>
                <th className="border border-sky-600 p-2 text-sky-900">Qty</th>
                <th className="border border-sky-600 p-2 text-sky-900">A. Weight</th>
                <th className="border border-sky-600 p-2 text-sky-900">C. Weight</th>
                <th className="border border-sky-600 p-2 text-sky-900">Rate</th>
                <th className="border border-sky-600 p-2 text-sky-900">Hire Amt</th>
                <th className="border border-sky-600 p-2 text-sky-900">Other Charges</th>
                <th className="border border-sky-600 p-2 text-sky-900">Shortage</th>
                <th className="border border-sky-600 p-2 text-sky-900">Advance</th>
                <th className="border border-sky-600 p-2 text-sky-900">Total Amt</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-sky-900 p-2">{index + 1}</td>
                  <td className="border border-sky-900 p-2">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="border border-sky-900 p-2">{item.orderNumber}</td>
                  <td className="border border-sky-900 p-2">{item.vehicleData.vehicleNo}</td>
                  <td className="border border-sky-900 p-2">{item.loadingPoints}</td>
                  <td className="border border-sky-900 p-2">{item.unloadingPoints}</td>
                  <td className="border border-sky-900 p-2">{item.billTo}</td>
                  <td className="border border-sky-900 p-2">{item.itemsList.item[0]?.quantity}{item.itemsList.item[0]?.quantityUnit}</td>
                  <td className="border border-sky-900 p-2">{item.itemsList.totalActualWeight}{item.itemsList.item[0]?.actualWeightUnit}</td>
                  <td className="border border-sky-900 p-2">{item.itemsList.item[0]?.chargedWeight}{item.itemsList.item[0]?.actualWeightUnit}</td>
                  <td className="border border-sky-900 p-2">{item.itemsList.item[0]?.rate} per {item.itemsList.item[0]?.rateAsPer}</td>
                  <td className="border border-sky-900 p-2">{item.totalBillingAmount}</td>
                  <td className="border border-sky-900 p-2">{item.additionalCharges?.totalCharge}</td>
                  <td className="border border-sky-900 p-2">{item.shortage}</td>
                  <td className="border border-sky-900 p-2">{item.advanceAmount}</td>
                  <td className="border border-sky-900 p-2">{item.totalBillingAmount}</td>
                </tr>
              ))}
              
            </tbody>
            <tfoot>
  <tr className="text-center font-semibold">
    <td colSpan="7" className="border border-sky-600 p-2">
      Total
    </td>
    <td className="border border-sky-600 p-2">{totals.totalQty}</td>
    <td className="border border-sky-600 p-2">{totals.totalActualWeight}</td>
    <td className="border border-sky-600 p-2"></td>
    <td className="border border-sky-600 p-2"></td>
    <td className="border border-sky-600 p-2"></td>
    <td className="border border-sky-600 p-2">{totals.totalAdditionalCharge}</td>
      <td className="border border-sky-600 p-2"></td>
        <td className="border border-sky-600 p-2"></td>
    <td className="border border-sky-600 p-2">{totals.totalBillingAmount}</td>
  </tr>
</tfoot>
          </table>
          <div className="flex items-center justify-center">
            <Button
              onClick={handleExportPDF}
              className="mt-4 shadow-md bg-violet-500 hover:bg-violet-700 text-white"
            >
              Export to PDF
            </Button>
          </div>
        </div>
      )}
     
    </div>
  );
};

export default VehicleNoBooking;