// Import necessary libraries and components
import { useToast } from "../../components/ui/use-toast";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import FieldComponent from "./FieldComponent"; // Update the path to the correct location
import { Button } from "../../components/ui/button";

const ViewDetail = ({ bookingDetails, heading }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [editBooking, setEditBooking] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-[90vh] w-full rounded-2xl bg-white px-6 py-4 shadow-sm">
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
          {bookingDetails?.product?.map((product) => (
            <div key={product._id}>
              <FieldComponent
                label={"Product Name"}
                value={product.productName}
                show={editBooking}
                tableId={product._id}
                identifier="productName"
              />
              {/* You can add more fields for product if needed */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewDetail;
