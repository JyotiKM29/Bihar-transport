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
              (booking) => booking._id === id
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
      ["Bill To", data?.consignorName, "", "", "", "Invoice Date", data?.generatedInvoice?.invoiceDate.split("T")[0]],
      ["From", data?.loadingPoints[0], "", "", "", "Invoice No", data?.generatedInvoice?.invoiceNumber],
      ["Consignor", data?.consignorName, "", "", "", "Vehicle No", data?.allotedVehicle[0]?.vehicleNo || "Not Alloted"],
      ["Mobile No", data?.consignorMobileNumber, "", "", "", "", ""],
      ["Address", "Not Found", "", "", "", "", ""],
      ["To", data?.unloadingPoints[0], "", "", "", "", ""],
      ["Consignee", data?.consigneeName, "", "", "", "", ""],
      ["Mob No", data?.consigneeMobileNumber, "", "", "", "", ""],
      ["Address", "", "", "", "", "", ""],
      ["Material Name", "HSN CODE", "Qty.", "PKG. Type", "Actual Weight", "Charged Weight", "Rate As Per", "RATE", "Freight"]
    ];

    data?.itemsList.item.forEach(item => {
      worksheetData.push([
        item.material,
        item.hsnNo || "",
        item.quantity || "",
        item.quantityUnit || "",
        item.actualWeight || "" + item.actualWeightUnit,
        item.chargedWeight || "" + item.chargedWeightUnit,
        item.rateAsPer || "",
        item.rate || "",
        "₹ " + data?.itemsList?.totalAmount || ""
      ]);
    });

    worksheetData.push([
      "Charge Name", "Amount", "Rate", "Quantity", "Total Freight", "Total Charges", "Total Value", "Enabled", "Remarks"
    ]);

    data?.additionalCharges?.chargers.forEach(item => {
      worksheetData.push([
        item.name,
        item.amount || "",
        item.rate || "",
        item.qty || "",
        item.amount || "",
        item.amount || "",
        "",
        item.isEnabled ? "Yes" : "No" || "",
        ""
      ]);
    });

    worksheetData.push(
      ["", "", "", "", "", "", "Total Billed Amount:", `₹ ${data?.totalBillingAmount?.toFixed(2) || 0}`],
      ["Amount in words:", toWords(data?.totalBillingAmount || 0)],
      ["Bank Details:"],
      ["Name:", "BIHAR TRANSPORT", "", "", "", "", ""],
      ["A/C No:", "59208757320018", "", "", "", "", ""],
      ["Ifsc Code:", "HDFC0000755", "", "", "", "", ""],
      ["Branch:", "Begusarai, Bihar", "", "", "", "", ""],
      ["Authorised Signatory:"],
      ["UPI Payment:"],
      ["UPI No:", "8757320018", "", "", "", "", ""],
      ["Note:", "Please pay by A/C payee cheque/D.D. in favour of Bihar Transport not to."]
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
    doc.text(`Invoice Date: ${data?.generatedInvoice?.invoiceDate.split("T")[0]}`, 140, 10);

    doc.text(`From: ${data?.loadingPoints[0]}`, 10, 20);
    doc.text(`Invoice No: ${data?.generatedInvoice?.invoiceNumber}`, 140, 20);

    doc.text(`Consignor: ${data?.consignorName}`, 10, 30);
    doc.text(`Vehicle No: ${data?.allotedVehicle[0]?.vehicleNo || "Not Alloted"}`, 140, 30);

    doc.text(`Mobile No: ${data?.consignorMobileNumber}`, 10, 40);

    doc.text(`Address: Not Found`, 10, 50);

    doc.text(`To: ${data?.unloadingPoints[0]}`, 10, 60);

    doc.text(`Consignee: ${data?.consigneeName}`, 10, 70);

    doc.text(`Mob No: ${data?.consigneeMobileNumber}`, 10, 80);

    doc.text(`Address:`, 10, 90);

    doc.autoTable({
      startY: 100,
      head: [['Material Name', 'HSN CODE', 'Qty.', 'PKG. Type', 'Actual Weight', 'Charged Weight', 'Rate As Per', 'RATE', 'Freight']],
      body: data?.itemsList.item.map(item => [
        item.material,
        item.hsnNo || "",
        item.quantity || "",
        item.quantityUnit || "",
        item.actualWeight || "" + item.actualWeightUnit,
        item.chargedWeight || "" + item.chargedWeightUnit,
        item.rateAsPer || "",
        item.rate || "",
        "₹ " + data?.itemsList?.totalAmount || ""
      ])
    });

    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 10,
      head: [['Charge Name', 'Amount', 'Rate', 'Quantity', 'Total Freight', 'Total Charges', 'Total Value', 'Enabled', 'Remarks']],
      body: data?.additionalCharges?.chargers.map(item => [
        item.name,
        item.amount || "",
        item.rate || "",
        item.qty || "",
        item.amount || "",
        item.amount || "",
        "",
        item.enabled ? "Yes" : "No" || "",
        ""
      ])
    });

    doc.text(`Total Billed Amount: ₹ ${data?.totalBillingAmount?.toFixed(2) || 0}`, 10, doc.previousAutoTable.finalY + 10);
    doc.text(`Amount in words: ${toWords(data?.totalBillingAmount || 0)}`, 10, doc.previousAutoTable.finalY + 20);

    doc.text(`Bank Details:`, 10, doc.previousAutoTable.finalY + 30);
    doc.text(`Name: BIHAR TRANSPORT`, 10, doc.previousAutoTable.finalY + 40);
    doc.text(`A/C No: 59208757320018`, 10, doc.previousAutoTable.finalY + 50);
    doc.text(`Ifsc Code: HDFC0000755`, 10, doc.previousAutoTable.finalY + 60);
    doc.text(`Branch: Begusarai, Bihar`, 10, doc.previousAutoTable.finalY + 70);

    doc.text(`Authorised Signatory:`, 10, doc.previousAutoTable.finalY + 80);

    doc.text(`UPI Payment:`, 10, doc.previousAutoTable.finalY + 90);
    doc.text(`UPI No: 8757320018`, 10, doc.previousAutoTable.finalY + 100);

    doc.text(`Note: Please pay by A/C payee cheque/D.D. in favour of Bihar Transport not to.`, 10, doc.previousAutoTable.finalY + 110);

    doc.save('invoice.pdf');
    setLoader(false);
  };

  return (
    <div className="w-full p-4">
      <div className="overflow-x-auto">
        <div className="min-w-full bg-white">
          <div className="py-2 px-4">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th colSpan="5" className="border border-gray-300 p-2">{`Bill To: ${data?.consignorName}`}</th>
                  <th colSpan="4" className="border border-gray-300 p-2">{`Invoice Date: ${data?.generatedInvoice?.invoiceDate.split("T")[0]}`}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="5" className="border border-gray-300 p-2">{`From: ${data?.loadingPoints[0]}`}</td>
                  <td colSpan="4" className="border border-gray-300 p-2">{`Invoice No: ${data?.generatedInvoice?.invoiceNumber}`}</td>
                </tr>
                <tr>
                  <td colSpan="5" className="border border-gray-300 p-2"><b>Consignor:</b> {`${data?.consignorName}`}</td>
                  <td colSpan="4" className="border border-gray-300 p-2"><b>Vehicle No:</b> {data?.allotedVehicle[0]?.vehicleNo || "Not Alloted"}</td>
                </tr>
                <tr>
                  <td colSpan="5" className="border border-gray-300 p-2"><b>Mobile No:</b> {data?.consignorMobileNumber}</td>
                  <td colSpan="4" className="border border-gray-300 p-2"></td>
                </tr>
                <tr>
                  <td colSpan="5" className="border border-gray-300 p-2"><b>Address:</b> Not Found</td>
                  <td colSpan="4" className="border border-gray-300 p-2"></td>
                </tr>
                <tr>
                  <td colSpan="5" className="border border-gray-300 p-2"><b>To:</b> {data?.unloadingPoints[0]}</td>
                  <td colSpan="4" className="border border-gray-300 p-2"></td>
                </tr>
                <tr>
                  <td colSpan="5" className="border border-gray-300 p-2">Consignee:- {data?.consigneeName}</td>
                  <td colSpan="4" className="border border-gray-300 p-2"></td>
                </tr>
                <tr>
                  <td colSpan="5" className="border border-gray-300 p-2">Mob No.: {data?.consigneeMobileNumber}</td>
                  <td colSpan="4" className="border border-gray-300 p-2"></td>
                </tr>
                <tr>
                  <td colSpan="9" className="border border-gray-300 p-2">Address:-</td>
                </tr>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Material Name</th>
                  <th className="border border-gray-300 p-2">HSN CODE</th>
                  <th className="border border-gray-300 p-2">Qty.</th>
                  <th className="border border-gray-300 p-2">PKG. Type</th>
                  <th className="border border-gray-300 p-2">Actual Weight</th>
                  <th className="border border-gray-300 p-2">Charged Weight</th>
                  <th className="border border-gray-300 p-2">Rate As Per</th>
                  <th className="border border-gray-300 p-2">RATE</th>
                  <th className="border border-gray-300 p-2">Freight</th>
                </tr>
                {data?.itemsList.item.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{item.material}</td>
                    <td className="border border-gray-300 p-2">{item.hsnNo || ""}</td>
                    <td className="border border-gray-300 p-2">{item.quantity || ""}</td>
                    <td className="border border-gray-300 p-2">{item.quantityUnit || ""}</td>
                    <td className="border border-gray-300 p-2">{item.actualWeight || ""}{item.actualWeightUnit}</td>
                    <td className="border border-gray-300 p-2">{item.chargedWeight || ""}{item.chargedWeightUnit}</td>
                    <td className="border border-gray-300 p-2">{item.rateAsPer || ""}</td>
                    <td className="border border-gray-300 p-2">{item.rate || ""}</td>
                    <td className="border border-gray-300 p-2">₹ {data?.itemsList?.totalAmount || ""}</td>
                  </tr>
                ))}

                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Charge Name</th>
                  <th className="border border-gray-300 p-2">Amount</th>
                  <th className="border border-gray-300 p-2">Rate</th>
                  <th className="border border-gray-300 p-2">Quantity</th>
                  <th className="border border-gray-300 p-2">Total Freight</th>
                  <th className="border border-gray-300 p-2">Total Charges</th>
                  <th className="border border-gray-300 p-2">Total Value</th>
                  <th className="border border-gray-300 p-2">Enabled</th>
                  <th className="border border-gray-300 p-2">Remarks</th>
                </tr>
                {data?.additionalCharges?.chargers.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{item.name}</td>
                    <td className="border border-gray-300 p-2">{item.amount || ""}</td>
                    <td className="border border-gray-300 p-2">{item.rate || ""}</td>
                    <td className="border border-gray-300 p-2">{item.qty || ""}</td>
                    <td className="border border-gray-300 p-2">{item.amount || ""}</td>
                    <td className="border border-gray-300 p-2">{item.amount || ""}</td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2">{item.enabled ? "Yes" : "No" || ""}</td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                ))}

                <tr>
                   <td colSpan="6" className="border border-gray-300 p-2"><b></b></td>
                  <td colSpan="3" className="border border-gray-300 p-2"><b>Total Billed Amount:   </b> ₹ {data?.totalBillingAmount?.toFixed(2) || 0}</td>

                </tr>
                <tr>
                  <td colSpan="9" className="border border-gray-300 p-2"><b>Amount in words:</b> {toWords(data?.totalBillingAmount || 0)}</td>
                </tr>
                <tr>
                  <td colSpan="9" className="border border-gray-300 p-2"><b>Bank Details:</b></td>
                </tr>
                <tr className="bg-gray-200">
                  <td colSpan="3" className="border border-gray-300 p-2"><b>Name:</b> BIHAR TRANSPORT</td>
                  <td colSpan="6" className="border border-gray-300 p-2"></td>
                </tr>
                <tr>
                  <td colSpan="3" className="border border-gray-300 p-2"><b>A/C No:</b> 59208757320018</td>
                  <td colSpan="6" className="border border-gray-300 p-2"></td>
                </tr>
                <tr className="bg-gray-200">
                  <td colSpan="3" className="border border-gray-300 p-2"><b>Ifsc Code:</b> HDFC0000755</td>
                  <td colSpan="6" className="border border-gray-300 p-2"></td>
                </tr>
                <tr>
                  <td colSpan="3" className="border border-gray-300 p-2"><b>Branch:</b> Begusarai, Bihar</td>
                  <td colSpan="6" className="border border-gray-300 p-2"></td>
                </tr>
                <tr className="bg-gray-200">
                  <td colSpan="4" className="border border-gray-300 p-2"></td>
                  <td colSpan="5" className="border border-gray-300 p-2"><b>Authorised Signatory:</b></td>
                </tr>
                <tr>
                  <td colSpan="9" className="border border-gray-300 p-2"><b>UPI Payment:</b></td>
                </tr>
                <tr className="bg-gray-200">
                  <td colSpan="3" className="border border-gray-300 p-2"><b>UPI No:</b> 8757320018</td>
                  <td colSpan="6" className="border border-gray-300 p-2"></td>
                </tr>
                <tr>
                  <td colSpan="9" className="border border-gray-300 p-2"><b>Note:</b> Please pay by A/C payee cheque/D.D. in favour of Bihar Transport not to.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button
          variant="contained"
          color="primary"
          onClick={exportToExcel}
          disabled={loader}
        >
          {loader ? "Exporting..." : "Export to Excel"}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={exportToPDF}
          disabled={loader}
        >
          {loader ? "Exporting..." : "Export to PDF"}
        </Button>
      </div>
    </div>
  );
}

export default Invoice;
