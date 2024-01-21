"use client";
import  { useToast }  from '../../../../components/ui/use-toast';
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import FieldComponent from "../../FieldComponent";
import { Button } from "../../../../components/ui/button";

const BookingDetails = ({ params }) => {
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editBooking , setEditBooking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/bookingdetails/${params.id}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
     
        }

        const data = await response.json();
        setLoading(false);
        setBookingDetails(data);
        displayToast("Fetch Booking Detail Succesfully ", "✅");

        console.log("data", data);
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
        displayToast("Error in Fetching Data", "❌", error.message);
      }
    };
    fetchData();
  }, [params.id]);


  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-[90vh] w-full rounded-2xl bg-white px-6 py-4 shadow-sm ">
      <div className="flex items-center justify-between">
        <h1 className="mb-6 text-4xl">Booking Details: </h1>
        <div className="space-x-2 flex items-center justify-between">
        <Button  className="px-4 space-x-2" onClick={handleGoBack}>
        
        <IoIosArrowBack className=" fill-white" />
        <pre className="text-base">Back</pre>
       
        
        </Button>
        <Button onClick={()=> setEditBooking(!editBooking)} className="px-4 space-x-2">
        <pre className="text-base">Edit</pre>
        <MdEdit className="h-8 fill-white" />
        </Button>
        </div>
       
      </div>
      {loading ? (
        <p>Loading.....</p>
      ) : (
        <div className="xl:flex w-full gap-8">
        <div className="w-full">
        <div className="flex justify-between items-center border-b mt-3 mb-4">
       <h2 className="mr-3 text-nowrap text-lg font-semibold "> Order Id :</h2> 
        <h2> { bookingDetails?.booking?.orderNumber}</h2>
       </div>
       <div className="flex justify-between items-center border-b mt-3 mb-4">
       <h2 className="mr-3 text-nowrap text-lg font-semibold "> Date  :</h2> 
        <h2> { bookingDetails?.booking?.date}</h2>
       </div>
       <div className="flex justify-between items-center border-b mt-3 ">
       <h2 className="mr-3 text-nowrap text-lg font-semibold "> Created By :</h2> 
        <h2> { bookingDetails?.booking?.createdBy.name}</h2>
       </div>
       
          <FieldComponent
            label={"Vehicle Required Date"}
            value={new Date(
              bookingDetails?.booking?.vehicleRequiredDate,
            ).toLocaleDateString()}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="vehicleRequiredDate"
            type='date'
          />
          <FieldComponent
            label={"Consignor Name"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="consignorName"  value={bookingDetails?.booking?.consignorName}
          />
          <FieldComponent
            label={"Consignor Mobile No"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="consignorMobileNumber"
              value={bookingDetails?.booking?.consignorMobileNumber}
          />
          <FieldComponent
            label={"Loading Points"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="loadingPoints"  value={bookingDetails?.booking?.loadingPoints?.join(',')}
          />
          <FieldComponent
            label={"Consignee Name "}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="consigneeName"  value={bookingDetails?.booking?.consigneeName}
          />
          <FieldComponent
            label={"Consignee Mobile No"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="consigneeMobileNumber"  value={bookingDetails?.booking?.consigneeMobileNumber}
          />
          <FieldComponent
            label={"Unloading Points"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="unloadingPoints"  value={bookingDetails?.booking?.unloadingPoints?.join(', ')}
            
          />  
          <FieldComponent label={"Way"} value={bookingDetails?.booking?.way} show={editBooking}
          tableId={bookingDetails?.booking?._id}
            identifier="way"
          />

          <FieldComponent
            label={"Material"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="material"  value={bookingDetails?.booking?.material}
          />
          <FieldComponent
            label={"Quantity"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="quantity"  value={bookingDetails?.booking?.quantity}
          />
      
          <FieldComponent
            label={"Quantity Unit "}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="quantityUnit"  value={bookingDetails?.booking?.quantityUnit}
          />
          <FieldComponent
            label={"Vehicle Type"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="vehicleType"  
            value={bookingDetails?.booking?.vehicleType}
          />
            </div>
        <div className="w-full">

        
          <FieldComponent
            label={"Actual Weight"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="actualWeight"  value={bookingDetails?.booking?.actualWeight}
          />

          <FieldComponent
            label={"Rate As Per"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="rateAsPer"  value={bookingDetails?.booking?.rateAsPer}
          />
          <FieldComponent
            label={"Rate"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="rate"  value={bookingDetails?.booking?.rate}
          />
          <FieldComponent
            label={"RateUnit"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="rateUnit"  value={bookingDetails?.booking?.rateUnit}
          />

          <FieldComponent
            label={"Party Bhara"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="partyBhara"  value={bookingDetails?.booking?.partyBhara}
          />

          <FieldComponent
            label={"Payment Liability"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="paymentLiability"  value={bookingDetails?.booking?.paymentLiability}
          />

          <FieldComponent
            label={"Bill To"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="billTo"  value={bookingDetails?.booking?.billTo}
          />

          <FieldComponent
            label={"Payment Term "}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="paymentTerm"  value={bookingDetails?.booking?.paymentTerm}
          />
          <FieldComponent
            label={"Advance Amount"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="advanceAmount"  value={bookingDetails?.booking?.advanceAmount}
          />
          <FieldComponent
            label={"Balance Amount"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="balanceAmount"  value={bookingDetails?.booking?.balanceAmount}
          />
          <FieldComponent
            label={"Pay Mode"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="payMode"  value={bookingDetails?.booking?.payMode}
          />
          <FieldComponent
            label={"Transaction Id"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="transactionId"  value={bookingDetails?.booking?.transactionId}
          />
          <FieldComponent
            label={"Remarks"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="remarks"  value={bookingDetails?.booking?.remarks}
          />
          <FieldComponent
            label={"Additional Charges"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="additionalCharges" value={bookingDetails?.booking?.additionalCharges}
          />
          <FieldComponent
            label={"Alloted Vehicle"}
            show={editBooking}
            tableId={bookingDetails?.booking?._id}
            identifier="allotedVehicle"  
            value={bookingDetails?.booking?.allotedVehicle}
          />
          </div>
      
         
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
