import React, { useEffect, useRef } from "react";
import { IoCall } from "react-icons/io5";
import { IoMail } from "react-icons/io5";
import { FaEarthAmericas } from "react-icons/fa6";
import { FaUserLarge } from "react-icons/fa6";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Image from "next/image";


const PrintQuote = ({
  quoteid,
  date,
  product,
  name,
  address,
  phoneno,
  email,
  GSTIN,
}) => {

  const documentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => documentRef.current,
    documentTitle: `Quatation-${name}`,
    bodyClass: "p-8", // some padding
  });

 

  return (
    <div className="py-32">

        <div className="flex justify-between px-8">
    <p>Download or Print Quotation :</p>
         <Button onClick={handlePrint}>  <Printer />  &nbsp; Print to PDF</Button>
    </div>
      <div ref={documentRef} className="min-h-[10vh] ">
        <div className="grid grid-cols-2 gap-8">
          {/* company details */}
          <div>
            <p className="border-t-4 border-orange-900 py-2 text-center text-lg font-light uppercase">
              Quotation
            </p>
            <div className="border-b-2 border-t-4 border-red-700 px-4">
              <h4 className="text-center text-xl font-semibold uppercase text-red-700">
                Bihar Transport
              </h4>
              <p className="flex gap-2 p-1">
                <span className="font-semibold text-nowrap">Head Office </span>NH-31, Barauni-Purnia Highway, Harpur Chowk, Begusarai, Bihar-851122
              </p>
              
              <p className="flex gap-2 p-1">
                <IoCall />
                +91 8210931799
              </p>
              <p className="flex gap-2 p-1">
                <IoMail />
                Info@bihartransport.in
              </p>
              <p className="flex gap-2 p-1">
                <FaEarthAmericas />
                www.bihartransport.in
              </p>
              <p className="flex gap-2 p-1">
                <span className="font-semibold">GST No.</span> 123
              </p>
            </div>
          </div>
          {/* company Image  */}
          <div className="flex items-center justify-center border-b-2 border-red-700 ">
          <Image src={'/bt-logo.jpg'} height={200} width={250} alt="bihar transport"/>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 p-2">
          <p>
            <span className="font-semibold">Quote No :</span>
            &nbsp; {quoteid}
          </p>
          <p>
            <span className="font-semibold">Date :</span>
            &nbsp;  {date?.split("T")[0]}
          </p>
        </div>

        {/* for Transist */}
        <h2 className="text-center text-xl font-semibold uppercase">
          For Transit
        </h2>
        <div className="px-2">
          <p className="flex items-center gap-4">
            <FaUserLarge /> TO
          </p>
          <p className="font-semibold uppercase">{name}</p>
          <p>{address}</p>
          <p>{phoneno}</p>
          <p>{email}</p>
          <p>{GSTIN}</p>
        </div>

        {/* Sub Transist */}
        <h2 className="mt-6 text-center text-lg font-medium uppercase">
          SUB: transit Quote for
        </h2>
        <p className="px-2">
          Dear Sir/MadamA,s per our discussion regarding transportation
          requirements for the consignment to
        </p>
        <h4 className="mt-6 text-center text-lg font-medium uppercase">
          Quotation
        </h4>
        {/* table */}
        <div className="overflow-x-auto md:overflow-x-visible">
          <table className=" my-4 w-full border border-blue-600 ">
            <thead>
              <tr className=" w-full border border-blue-600 bg-blue-700 text-white">
                <th className=" text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-white  md:text-base  ">
                  Product Name
                </th>
                <th className=" text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-white  md:text-base  ">
                  Size
                </th>
                <th className=" text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-white  md:text-base  ">
                  Weight
                </th>
                <th className=" text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-white  md:text-base  ">
                  ETA
                </th>
                <th className=" text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-white  md:text-base  ">
                  rate
                </th>
                <th className=" text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-white  md:text-base  ">
                  Rate as per
                </th>
                <th className=" text-nowrap border border-blue-600 p-2 pr-3 text-sm font-medium text-white  md:text-base  ">
                  Advance
                </th>
              </tr>
            </thead>
            <tbody>
              {product?.map((items, i) => (
                <tr key={i} className="w-full text-center">
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {items.productName}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {items.itemSize}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {items.itemWeight}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {items.ETA}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {items.rate}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {items.rateAsPer}
                  </td>
                  <td className="border border-blue-900 p-2 text-blue-700">
                    {items.Advance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-2">
          <div>
            <p>
              <span className="font-semibold">Remarks :</span>
            </p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
          </div>
          <h4 className="ml-4 text-xl font-light">Terms & Condition</h4>
          <p className="ml-8 p-[.15rem] text-sm font-light">
            {" "}
            1. Rates quoted above are valid for 48Hrs only.
          </p>
          <p className="ml-8 p-[.15rem] text-sm font-light">
            2. Extra charges will be implied If the consignment exceeds the
            limitÂ of fleet dimension/ RTO Regulations.{" "}
          </p>
          <p className="ml-8 p-[.15rem] text-sm font-light">
            3. Advance payment is to be made (unless stated above, in which
            caseÂ you shall pay the quoted price).
          </p>
          <p className="ml-8 p-[.15rem] text-sm font-light">
            4. If the unloading time exceeds 4hrs halting will be charged as
            perÂ actuals
          </p>
          <p className="ml-8 p-[.15rem] text-sm font-light">
            5. Payments are to be made within 7 days from the date of invoice.
          </p>
          <p className="ml-8 p-[.15rem] text-sm font-light">
            6. If Vehicle Is Cancelled Prior To 60min/On Arrival Charges AreÂ
            Applicable.
          </p>
          <p className="ml-8 p-[.15rem] text-sm font-light">
            7. Change in destination/location is to be charged extra.{" "}
          </p>
        </div>
        <div>
          <div className="mt-16 flex min-h-12 justify-between px-6   pt-16 ">
            <div className="col-span-3 ">
              <h4 className="font-bold   ">Bank Details :</h4>
              <p className=" text-nowrap">
                <span className="font-medium ">Name:</span> BIHAR TRANSPORT
              </p>
              <p className=" text-nowrap">
                {" "}
                <span className="font-medium ">A/C No:</span> 59208757320018
              </p>
              <p className=" text-nowrap">
                {" "}
                <span className="font-medium ">Ifsc Code:</span> HDFC0000755
              </p>
              <p className=" text-nowrap">
                <span className="font-medium ">Branch:</span> Begusarai, Bihar
              </p>
              <p className=" ">
                <span className="font-medium  ">Bank Name:</span> SBI Bank
              </p>
            </div>

            <div className="col-span-3 flex flex-col font-semibold">
              <p className=" ">For and Behalf of</p>
              <p className="text-center">Bihar Transport</p>
            </div>
          </div>
          <p className=" mb-6 p-2 px-4 text-center text-sm font-light">
            This is a computer generated document No seal and signature
            required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintQuote;
