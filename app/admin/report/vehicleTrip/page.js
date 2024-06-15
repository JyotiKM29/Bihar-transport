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
      setData(filteredData);
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
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4"
  });

  const tableElement = document.getElementById("bookingTable");

  // Add logo
  const logoUrl = "https://bihar-transport.vercel.app/_next/image?url=%2Fbt-logo.jpg&w=256&q=75";
  const img = new Image();
  img.src = logoUrl;

  img.onload = () => {
    doc.addImage(img, 'JPEG', 40, 10, 50, 50); // Add logo image to the PDF (x, y, width, height)

    // Add title
    doc.text("Vehicle Trip Report", 100, 30);

    // Add timestamp
    const date = new Date();
    const formattedDate = date.toLocaleDateString().replace(/\//g, '-');
    const formattedTime = date.toTimeString().slice(0, 8);
    const timestamp = `Exported on: ${formattedDate} at ${formattedTime}`;
    doc.text(timestamp, 100, 50);

    // AutoTable configuration
    doc.autoTable({
      html: "#bookingTable",
      startY: 70, // Adjust to fit the logo and timestamp
      styles: { halign: 'center', valign: 'middle', fontSize: 8 },
      headStyles: { fillColor: [52, 152, 219] },
      columnStyles: {
        0: { cellWidth: 20 }, // SI No.
        1: { cellWidth: 60 }, // Date
        2: { cellWidth: 60 }, // LR No.
        3: { cellWidth: 60 }, // Vehicle No.
        4: { cellWidth: 80 }, // From
        5: { cellWidth: 80 }, // To
        6: { cellWidth: 30 }, // Bill To
        7: { cellWidth: 40 }, // Qty
        8: { cellWidth: 60 }, // A. Weight
        9: { cellWidth: 40 }, // C. Weight
        10: { cellWidth: 40 }, // Rate
        11: { cellWidth: 60 }, // Hire Amt
        12: { cellWidth: 40 }, // Other Charges
        13: { cellWidth: 30 }, // Shortage
        14: { cellWidth: 30 }, // Advance
        15: { cellWidth: 60 }  // Total Amt
      },
      didDrawPage: function (data) {
        // Add page number at bottom
        let pageSize = doc.internal.pageSize;
        let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text('Page ' + doc.internal.getNumberOfPages(), data.settings.margin.left, pageHeight - 10);
      },
      didParseCell: function (data) { 
        if (data.cell.raw.innerText === "From" || data.cell.raw.innerText === "To") {
          data.cell.styles.halign = 'left'; // Align "From" and "To" columns to the left
        }
      },
      bodyStyles: {
        valign: 'top', // Align text to the top
        overflow: 'linebreak', // Wrap text in the cell
      }
    });

    const vehicleNo = data[0].vehicleData.vehicleNo || 'unknown';
    const fileName = `vehicleReport-of-${vehicleNo}-${formattedDate}.pdf`;

    doc.save(fileName);
  };
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
      totalAdditionalCharge += item.additionalCharges?.totalCharge || 0;
    });

    return {
      totalQty,
      totalActualWeight,
      totalBillingAmount,
      totalAdditionalCharge,
    };
  };

  let totals = calculateTotals(data);

  useEffect(() => {
    totals = calculateTotals(data);
  }, [data]);

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
                  <td className="border border-sky-900 p-2">
                    {item.loadingPoints ? item.loadingPoints.join(", ") : ""}
                  </td>
                  <td className="border border-sky-900 p-2">
                    {item.unloadingPoints ? item.unloadingPoints.join(", ") : ""}
                  </td>
                  <td className="border border-sky-900 p-2">{item.billTo}</td>
                  <td className="border border-sky-900 p-2">
                    {item.itemsList.item[0]?.quantity}
                    {item.itemsList.item[0]?.quantityUnit}
                  </td>
                  <td className="border border-sky-900 p-2">
                    {item.itemsList.totalActualWeight}
                    {item.itemsList.item[0]?.actualWeightUnit}
                  </td>
                  <td className="border border-sky-900 p-2">
                    {item.itemsList.item[0]?.chargedWeight}
                    {item.itemsList.item[0]?.actualWeightUnit}
                  </td>
                  <td className="border border-sky-900 p-2">
                    {item.itemsList.item[0]?.rate} per{" "}
                    {item.itemsList.item[0]?.rateAsPer}
                  </td>
                  <td className="border border-sky-900 p-2">
                    {item.totalBillingAmount}
                  </td>
                  <td className="border border-sky-900 p-2">
                    {item.additionalCharges?.totalCharge}
                  </td>
                  <td className="border border-sky-900 p-2">{item.shortage}</td>
                  <td className="border border-sky-900 p-2">{item.advanceAmount}</td>
                  <td className="border border-sky-900 p-2">
                    {item.totalBillingAmount}
                  </td>
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