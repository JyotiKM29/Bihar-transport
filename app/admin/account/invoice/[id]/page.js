"use client";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toWords } from "number-to-words";
import { useContext, useEffect } from "react";
import { UserContext } from "../../../../context/UserContextProvider";

function Invoice({ params }) {
  const [loader, setLoader] = useState(false);
  const { user } = useContext(UserContext);
  const [invoiceData, setInvoiceData] = useState([]);
  const [data, setData] = useState();
  const id = params.id;
  const userId = user?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const response = await fetch(`/api/accounting/invoice/${userId}`, {
            method: "GET",
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();

          console.log("Invoice Generated", result);

          if (result.booking) {
            setInvoiceData(result.booking);
            const bookingIndex = result.booking.findIndex(
              (booking) => booking._id === id,
            );
            if (bookingIndex !== -1) {
              setData(result.booking[bookingIndex]);
              console.log("Data", result.booking[bookingIndex]);
            } else {
              console.log("Booking with the specified ID was not found.");
            }
          } else {
            console.log("No booking data was returned.");
          }
        }
      } catch (error) {
        setLoader(false);
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [userId]);

  const exportToExcel = () => {
    setLoader(true);
    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      [
        "Bill To",
        data?.consignorName,
        "",
        "",
        "",
        "Invoice Date",
        data?.generatedInvoice?.invoiceDate.split("T")[0],
      ],
      [
        "From",
        data?.loadingPoints[0],
        "",
        "",
        "",
        "Invoice No",
        data?.generatedInvoice?.invoiceNumber,
      ],
      [
        "Consignor",
        data?.consignorName,
        "",
        "",
        "",
        "Vehicle No",
        data?.allotedVehicle[0]?.vehicleNo || "Not Alloted",
      ],
      ["Mobile No", data?.consignorMobileNumber, "", "", "", "", ""],
      ["Address", "Not Found", "", "", "", "", ""],
      ["To", data?.unloadingPoints[0], "", "", "", "", ""],
      ["Consignee", data?.consigneeName, "", "", "", "", ""],
      ["Mob No", data?.consigneeMobileNumber, "", "", "", "", ""],
      ["Address", "", "", "", "", "", ""],
      [
        "Material Name",
        "HSN CODE",
        "Qty.",
        "PKG. Type",
        "Actual Weight",
        "Charged Weight",
        "Rate As Per",
        "RATE",
        "Freight",
      ],
    ];

    data?.itemsList.item.forEach((item) => {
      worksheetData.push([
        item.material,
        item.hsnNo || "",
        item.quantity || "",
        item.quantityUnit || "",
        item.actualWeight || "" + item.actualWeightUnit,
        item.chargedWeight || "" + item.chargedWeightUnit,
        item.rateAsPer || "",
        item.rate || "",
        "₹ " + data?.itemsList?.totalAmount || "",
      ]);
    });

    worksheetData.push([
      "Charge Name",
      "Amount",
      "Rate",
      "Quantity",
      "Total Freight",
      "Total Charges",
      "Total Value",
      "Enabled",
      "Remarks",
    ]);

    data?.additionalCharges?.chargers.forEach((item) => {
      worksheetData.push([
        item.name,
        item.amount || "",
        item.rate || "",
        item.qty || "",
        item.amount || "",
        item.amount || "",
        "",
        item.isEnabled ? "Yes" : "No" || "",
        "",
      ]);
    });

    worksheetData.push(
      [
        "",
        "",
        "",
        "",
        "",
        "",
        "Total Billed Amount:",
        `₹ ${data?.totalBillingAmount?.toFixed(2) || 0}`,
      ],
      ["Amount in words:", toWords(data?.totalBillingAmount || 0)],
      ["Bank Details:"],
      ["Name:", "BIHAR TRANSPORT", "", "", "", "", ""],
      ["A/C No:", "59208757320018", "", "", "", "", ""],
      ["Ifsc Code:", "HDFC0000755", "", "", "", "", ""],
      ["Branch:", "Begusarai, Bihar", "", "", "", "", ""],
      ["Authorised Signatory:"],
      ["UPI Payment:"],
      ["UPI No:", "8757320018", "", "", "", "", ""],
      [
        "Note:",
        "Please pay by A/C payee cheque/D.D. in favour of Bihar Transport not to.",
      ],
    );

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice");

    XLSX.writeFile(workbook, "invoice.xlsx");
    setLoader(false);
  };

  const exportToPDF = () => {
    setLoader(true);
    const doc = new jsPDF();
    doc.setFontSize(12);

    doc.text(`Bill To: ${data?.consignorName}`, 10, 10);
    doc.text(
      `Invoice Date: ${data?.generatedInvoice?.invoiceDate.split("T")[0]}`,
      140,
      10,
    );

    doc.text(`From: ${data?.loadingPoints[0]}`, 10, 20);
    doc.text(`Invoice No: ${data?.generatedInvoice?.invoiceNumber}`, 140, 20);

    doc.text(`Consignor: ${data?.consignorName}`, 10, 30);
    doc.text(
      `Vehicle No: ${data?.allotedVehicle[0]?.vehicleNo || "Not Alloted"}`,
      140,
      30,
    );

    doc.text(`Mobile No: ${data?.consignorMobileNumber}`, 10, 40);

    doc.text(`Address: Not Found`, 10, 50);

    doc.text(`To: ${data?.unloadingPoints[0]}`, 10, 60);

    doc.text(`Consignee: ${data?.consigneeName}`, 10, 70);

    doc.text(`Mob No: ${data?.consigneeMobileNumber}`, 10, 80);

    doc.text(`Address:`, 10, 90);

    doc.autoTable({
      startY: 100,
      head: [
        [
          "Material Name",
          "HSN CODE",
          "Qty.",
          "PKG. Type",
          "Actual Weight",
          "Charged Weight",
          "Rate As Per",
          "RATE",
          "Freight",
        ],
      ],
      body: data?.itemsList.item.map((item) => [
        item.material,
        item.hsnNo || "",
        item.quantity || "",
        item.quantityUnit || "",
        item.actualWeight || "" + item.actualWeightUnit,
        item.chargedWeight || "" + item.chargedWeightUnit,
        item.rateAsPer || "",
        item.rate || "",
        "₹ " + data?.itemsList?.totalAmount || "",
      ]),
    });

    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 10,
      head: [
        [
          "Charge Name",
          "Amount",
          "Rate",
          "Quantity",
          "Total Freight",
          "Total Charges",
          "Total Value",
          "Enabled",
          "Remarks",
        ],
      ],
      body: data?.additionalCharges?.chargers.map((item) => [
        item.name,
        item.amount || "",
        item.rate || "",
        item.qty || "",
        item.amount || "",
        item.amount || "",
        "",
        item.enabled ? "Yes" : "No" || "",
        "",
      ]),
    });

    doc.text(
      `Total Billed Amount: ₹ ${data?.totalBillingAmount?.toFixed(2) || 0}`,
      10,
      doc.previousAutoTable.finalY + 10,
    );
    doc.text(
      `Amount in words: ${toWords(data?.totalBillingAmount || 0)}`,
      10,
      doc.previousAutoTable.finalY + 20,
    );

    doc.text(`Bank Details:`, 10, doc.previousAutoTable.finalY + 30);
    doc.text(`Name: BIHAR TRANSPORT`, 10, doc.previousAutoTable.finalY + 40);
    doc.text(`A/C No: 59208757320018`, 10, doc.previousAutoTable.finalY + 50);
    doc.text(`Ifsc Code: HDFC0000755`, 10, doc.previousAutoTable.finalY + 60);
    doc.text(`Branch: Begusarai, Bihar`, 10, doc.previousAutoTable.finalY + 70);

    doc.text(`Authorised Signatory:`, 10, doc.previousAutoTable.finalY + 80);

    doc.text(`UPI Payment:`, 10, doc.previousAutoTable.finalY + 90);
    doc.text(`UPI No: 8757320018`, 10, doc.previousAutoTable.finalY + 100);

    doc.text(
      `Note: Please pay by A/C payee cheque/D.D. in favour of Bihar Transport not to.`,
      10,
      doc.previousAutoTable.finalY + 110,
    );

    doc.save("invoice.pdf");
    setLoader(false);
  };

  return (
    <div className="w-full p-4 py-8">
      <div className="overflow-x-auto">
        <div className="min-w-full rounded-xl bg-white p-4 px-8 shadow-md  ">
          <h1 className="text-center text-4xl font-medium uppercase text-sky-600 underline mb-6 ">
            Invoice
          </h1>
          <div className="grid min-h-24 grid-cols-7  ">
            <div className="col-span-4 border border-gray-400  p-2">
              <p>
                <span className="font-medium">Bill To:</span>
                {` ${data?.consignorName}`}
              </p>
            </div>

            <div className="col-span-1 grid-rows-subgrid">
              <p colSpan="4" className="border border-gray-400  p-2 font-medium">
                Invoice Date:
              </p>
              <p colSpan="4" className="border border-gray-400  p-2 font-medium">
                Invoice No:
              </p>
              <p colSpan="4" className="border border-gray-400  p-2 font-medium">
                Vehicle No:
              </p>
            </div>
            <div className="col-span-2">
              <p
                colSpan="4"
                className="border border-gray-400  p-2"
              >{` ${data?.generatedInvoice?.invoiceDate.split("T")[0]}`}</p>
              <p
                colSpan="4"
                className="border border-gray-400  p-2"
              >{` ${data?.generatedInvoice?.invoiceNumber}`}</p>
              <p colSpan="4" className="border border-gray-400  p-2">
                {" "}
                {data?.allotedVehicle[0]?.vehicleNo || "Not Alloted"}
              </p>
            </div>
          </div>


          {/* 2nd Row  */}
          <div className="border border-t-0 border-gray-400  min-h-12">
          <p className="p-2 border border-t-0 border-gray-400    font-medium">From :</p>
          <div className="flex flex-col">
          <p  className=" px-4 py-1">
                    <span className="font-medium mr-1">Consignor:-</span> {`${data?.consignorName}`}
                  </p>
          <p className=" px-4 py-1">
                    <span className="font-medium mr-1">GST No:-</span> {`${data?.consignorName}`}
                  </p>

                  <p colSpan="5" className=" px-4 py-1">
                    <span className="font-medium mr-1">Mobile No:-</span> {data?.consignorMobileNumber}
                  </p>
                  <p colSpan="5" className=" px-4 py-1">
                    <span className="font-medium mr-1">Address:-</span> Not Found
                  </p>
                  <p>
                  &nbsp;
                  </p>
                  <p>
                  &nbsp;
                  </p>
                 
          </div>

          </div>

          {/* 3rd Row */}
          <div className="border border-t-0 border-gray-400  min-h-12">
          <p className="p-2 border border-t-0 border-gray-400  font-medium">To :</p>
          <div className="flex flex-col">
          <p  className=" px-4 py-1">
                    <span className="font-medium mr-1">Consignee:-</span> {`${data?.consigneeName}`}
                  </p>
          <p className=" px-4 py-1">
                    <span className="font-medium mr-1">GST No:-</span> {`${data?.consigneeName}`}
                  </p>

                  <p colSpan="5" className=" px-4 py-1">
                    <span className="font-medium mr-1">Mobile No:-</span> {data?.consigneeMobileNumber}
                  </p>
                  <p colSpan="5" className=" px-4 py-1">
                    <span className="font-medium mr-1">Address:-</span> Not Found
                  </p>
                  <p>
                  &nbsp;
                  </p>
                  <p>
                  &nbsp;
                  </p>
                 
          </div>

{/* MAterial Chargers */}
          </div>
          <h4 className="font-bold text-center  mt-6 mb-2 underline text-xl">Material Detail:</h4>
          <div className="overflow-x-auto md:overflow-x-visible">
            <table className=" mt-4 w-full border border-gray-400   ">
              <thead>
          <tr className="bg-gray-200 w-full">
                  <th className="border border-gray-400  font-semibold p-2">Material Name</th>
                  <th className="border border-gray-400  font-semibold p-2">HSN CODE</th>
                  <th className="border border-gray-400  font-semibold p-2">Qty.</th>
                  <th className="border border-gray-400  font-semibold p-2">PKG. Type</th>
                  <th className="border border-gray-400  font-semibold p-2">Actual Weight</th>
                  <th className="border border-gray-400  font-semibold p-2">Charged Weight</th>
                  <th className="border border-gray-400  font-semibold p-2">Rate As Per</th>
                  <th className="border border-gray-400  font-semibold p-2">RATE</th>
                  <th className="border border-gray-400  font-semibold p-2">Freight</th>
                </tr>
                </thead>
                <tbody>

                
                {data?.itemsList.item.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-400  p-2">
                      {item.material}
                    </td>
                    <td className="border border-gray-400  p-2">
                      {item.hsnNo || ""}
                    </td>
                    <td className="border border-gray-400  p-2">
                      {item.quantity || ""}
                    </td>
                    <td className="border border-gray-400  p-2">
                      {item.quantityUnit || ""}
                    </td>
                    <td className="border border-gray-400  p-2">
                      {item.actualWeight || ""}
                      {item.actualWeightUnit}
                    </td>
                    <td className="border border-gray-400  p-2">
                      {item.chargedWeight || ""}
                      {item.chargedWeightUnit}
                    </td>
                    <td className="border border-gray-400  p-2">
                      {item.rateAsPer || ""}
                    </td>
                    <td className="border border-gray-400  p-2">
                      {item.rate || ""}
                    </td>
                    <td className="border border-gray-400  p-2">
                      ₹ {data?.itemsList?.totalAmount || ""}
                    </td>

                  </tr>
                  
                 
                ))} 
              
                <tr>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
                </tr>
                <tr>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
                </tr>
                <tr>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
                </tr>
               
                </tbody>
                
                </table>
                <p className="flex  justify-between items-center border border-t-0 border-gray-400 px-2">
                  <span className="p-2 font-medium">Total Freight:   </span>
                  <span className="p-2">{data?.itemsList.totalAmount}</span>
                </p>
                
          </div>
        
{/* Additional Chargers */}
        <div>
        <h4 className="font-bold text-center  mt-6 mb-2 underline text-xl">Additonal Chargers:</h4>
        <div className="overflow-x-auto md:overflow-x-visible">
            <table className=" mt-4 w-full border border-gray-400   ">
              <thead>
          <tr className="bg-gray-200 w-full">
                  <th className="border border-gray-400  font-semibold p-2">Ditension Charges</th>
                  <th className="border border-gray-400  font-semibold p-2">Packing  Charges</th>
                  <th className="border border-gray-400  font-semibold p-2">Picking Charges</th>
                  <th className="border border-gray-400  font-semibold p-2">Loading Charges</th>
                  <th className="border border-gray-400  font-semibold p-2">unLoading Charges</th>
                  <th className="border border-gray-400  font-semibold p-2">Other Charges</th>
                
                </tr>
                </thead>
                <tbody>

                
                {data?.additionalCharges.chargers.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-400  p-2">
                      {item.name ==='Detention Charge'? item.amount : " "}
                    </td>
                    <td className="border border-gray-400  p-2">
                     {item.name ==='Packing Charge'? item.amount : " "}
                    </td>
                    <td className="border border-gray-400  p-2">
                     {item.name ==='Pickup Charge'? item.amount : " "}
                    </td>
                    <td className="border border-gray-400  p-2">
                     {item.name ==='loading Charge'? item.amount : " "}
                    </td>
                    <td className="border border-gray-400  p-2">
                     {item.name ==='unloading Charge'? item.amount : " "}
                    </td>
                    <td className="border border-gray-400  p-2">
                      {item.name ==='Other Charge'? item.amount : " "}
                    </td>
                    

                  </tr>
                  
                 
                ))} 
              
                <tr>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              
                </tr>
                <tr>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              <td className="border border-gray-400  p-2"> &nbsp; </td>
              
                </tr>
               
               
                </tbody>
                
                </table>
                <p className="flex  justify-between items-center border border-t-0 border-gray-400 px-2">
                  <span className="p-2 font-medium">Total Additional Charges:   </span>
                  <span className="p-2">{data?.additionalCharges.totalCharge}</span>
                </p>
                <p className="flex  justify-between items-center border border-t-0 border-gray-400 px-2">
                  <span className="p-2 font-semibold">Total Billing Amount:   </span>
                  <span className="p-2"> {data?.totalBillingAmount?.toFixed(2) || 0}</span>
                </p>
                <div className="border border-t-0 border-gray-400 px-2">
                <p className="flex  justify-between items-center ">
                  <span className="p-2 font-semibold">Amount in words:   </span>
                  <span className="p-2"> {toWords(data?.totalBillingAmount || 0)}</span>
                 
                </p>
                <p>
                  &nbsp; 
                  </p>
                <p>
                  &nbsp; 
                  </p>
                </div>
                
               
                
          </div>
        </div>

        {/* BAnking */}
        <div className="grid grid-cols-4 min-h-12 border border-t-0 border-gray-400">
<div className="col-span-1 ">
<h4 className="font-bold underline text-center my-1">Bank Details :</h4>
<p className="py-[2px]"><span className="font-medium mx-4">Name:</span> BIHAR TRANSPORT</p>
<p className="py-[2px]"> <span className="font-medium mx-4">A/C No:</span> 59208757320018</p>
<p className="py-[2px]">  <span className="font-medium mx-4">Ifsc Code:</span> HDFC0000755</p>
<p className="py-[2px]">
<span className="font-medium mx-4">Branch:</span> Begusarai, Bihar
</p>

<h4 className="font-bold underline text-center my-1 border border-x-0 border-gray-400"> UPI Payment</h4>
<p className=" ">
<span className="font-medium mx-4 ">UPI No:</span> 8757320018
</p>

</div>
<div className="col-span-1 border border-y-0 border-gray-400">

</div>
<div className="col-span-2 flex flex-col justify-between">
<h4 className="font-bold text-lg text-center my-1">For Bihar Transport</h4>
<p className="text-center">Authorised Signatory</p>
</div>
        </div>
        <p className=" border border-t-0 border-gray-400 p-2 px-4 mb-6">
      <span className="font-bold">Note :</span>  Please pay by A/C payee cheque/D.D. in favour of Bihar Transport not to.
                </p>

       
    </div>
    </div>
    </div>
  );
}

export default Invoice;
