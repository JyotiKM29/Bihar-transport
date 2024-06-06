// Import necessary libraries and components
import { useToast } from "../../components/ui/use-toast";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import FieldComponent from "./FieldComponent"; // Update the path to the correct location
import { Button } from "../../components/ui/button";
import PrintQuote from "./[quoteid]/PrintQuote";

const ViewDetail = ({ bookingDetails, heading }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [editBooking, setEditBooking] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-[10vh] w-full rounded-2xl bg-white px-6 py-4 ">
      <div className="flex items-center justify-between">
        <h1 className="mb-6 text-4xl">{heading} Details: </h1>
        <div className="flex items-center justify-between space-x-2">
          <Button className="space-x-2 px-4" onClick={handleGoBack}>
            <IoIosArrowBack className=" fill-white" />
            <pre className="text-base">Back</pre>
          </Button>
          <Button
            onClick={() => setEditBooking(!editBooking)}
            className="space-x-2 px-4"
          >
            <pre className="text-base">Edit</pre>
            <MdEdit className="h-8 fill-white" />
          </Button>
        </div>
      </div>
      <div className="w-full gap-8 xl:flex">
        <div className="w-full">
          {/* Render basic details */}
          <div className="mb-4 mt-3 flex items-center justify-between border-b">
            <h2 className="mr-3 text-nowrap text-lg font-semibold ">
              Quotation NO :
            </h2>
            <h2> {bookingDetails?.quoteNo}</h2>
          </div>
          <div className="mb-4 mt-3 flex items-center justify-between border-b">
            <h2 className="mr-3 text-nowrap text-lg font-semibold ">Quote Date :</h2>
            <h2> {new Date(bookingDetails?.quoteDate).toLocaleDateString()}</h2>
          </div>
          <div className="mb-4 mt-3 flex items-center justify-between border-b">
            <h2 className="mr-3 text-nowrap text-lg font-semibold ">Created Date :</h2>
            <h2> {new Date(bookingDetails?.createdAt).toLocaleDateString()}</h2>
          </div>
          <div className="mb-4 mt-3 flex items-center justify-between border-b">
            <h2 className="mr-3 text-nowrap text-lg font-semibold ">Updated Date :</h2>
            <h2> {new Date(bookingDetails?.updatedAt).toLocaleDateString()}</h2>
          </div>
          <div className="mt-3 flex items-center justify-between border-b ">
            <h2 className="mr-3 text-nowrap text-lg font-semibold ">
              Created By :
            </h2>
            <h2> {bookingDetails?.createdBy?.name}</h2>
          </div>
          {/* Render customer details */}
          <FieldComponent
            label={"Customer Name"}
            value={bookingDetails?.customerDetails?.customerName}
            show={editBooking}
            tableId={bookingDetails?._id}
            identifier="customerName"
          />
          <FieldComponent
            label={"Customer Address"}
            value={bookingDetails?.customerDetails?.customerAddress}
            show={editBooking}
            tableId={bookingDetails?._id}
            identifier="customerAddress"
          />
          <FieldComponent
            label={"Customer Email"}
            value={bookingDetails?.customerDetails?.customerEmail}
            show={editBooking}
            tableId={bookingDetails?._id}
            identifier="customerEmail"
          />
          {/* Render product details */}
        
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
              {bookingDetails?.product?.map((items, i) => (
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
        </div>
      </div>

      <PrintQuote 
      quoteid={bookingDetails?.quoteNo} 
      date={bookingDetails?.quoteDate} 
      product={bookingDetails?.product} 
      name={bookingDetails?.customerDetails?.customerName} 
      address={bookingDetails?.customerDetails?.customerAddress} 
      phoneno={bookingDetails?.customerDetails?.customerMobileNo} 
      email={bookingDetails?.customerDetails?.customerEmail} 
      
      GSTIN={bookingDetails?.customerDetails?.customerGSTIN} 
      
      />
    </div>
  );
};

export default ViewDetail;
