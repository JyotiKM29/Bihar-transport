"use client";
import { useToast } from "../../components/ui/use-toast";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import FieldComponent from "./FieldComponent";
import { Button } from "../../components/ui/button";

const ViewDetail = ({  bookingDetails , heading}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [editBooking, setEditBooking] = useState(false);
  // console.log('Hey jyoti ' ,bookingDetails)
 

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-[90vh] w-full rounded-2xl bg-white px-6 py-4 shadow-sm ">
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
      {(
        <div className="w-full gap-8 xl:flex">
          <div className="w-full">
            <div className="mb-4 mt-3 flex items-center justify-between border-b">
              <h2 className="mr-3 text-nowrap text-lg font-semibold ">
                {" "}
                Order Id :
              </h2>
              <h2> {bookingDetails?.booking?.orderNumber}</h2>
            </div>
            <div className="mb-4 mt-3 flex items-center justify-between border-b">
              <h2 className="mr-3 text-nowrap text-lg font-semibold ">
                {" "}
                Date :
              </h2>
              <h2> {bookingDetails?.booking?.date}</h2>
            </div>
            <div className="mt-3 flex items-center justify-between border-b ">
              <h2 className="mr-3 text-nowrap text-lg font-semibold ">
                {" "}
                Created By :
              </h2>
              <h2> {bookingDetails?.booking?.createdBy.name}</h2>
            </div>

            <FieldComponent
              label={"Vehicle Required Date"}
              value={new Date(
                bookingDetails?.booking?.vehicleRequiredDate,
              ).toLocaleDateString()}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="vehicleRequiredDate"
              type="date"
            />
            <FieldComponent
              label={"Consignor Name"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="consignorName"
              value={bookingDetails?.booking?.consignorName}
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
              identifier="loadingPoints"
              value={bookingDetails?.booking?.loadingPoints?.join(",")}
            />
            <FieldComponent
              label={"Consignee Name "}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="consigneeName"
              value={bookingDetails?.booking?.consigneeName}
            />
            <FieldComponent
              label={"Consignee Mobile No"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="consigneeMobileNumber"
              value={bookingDetails?.booking?.consigneeMobileNumber}
            />
            <FieldComponent
              label={"Unloading Points"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="unloadingPoints"
              value={bookingDetails?.booking?.unloadingPoints?.join(", ")}
            />
            <FieldComponent
              label={"Way"}
              value={bookingDetails?.booking?.way}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="way"
            />

            <FieldComponent
              label={"Material"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="material"
              value={bookingDetails?.booking?.material}
            />
            <FieldComponent
              label={"Quantity"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="quantity"
              value={bookingDetails?.booking?.quantity}
            />

            <FieldComponent
              label={"Quantity Unit "}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="quantityUnit"
              value={bookingDetails?.booking?.quantityUnit}
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
              identifier="actualWeight"
              value={bookingDetails?.booking?.actualWeight}
            />

            <FieldComponent
              label={"Rate As Per"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="rateAsPer"
              value={bookingDetails?.booking?.rateAsPer}
            />
            <FieldComponent
              label={"Rate"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="rate"
              value={bookingDetails?.booking?.rate}
            />
            <FieldComponent
              label={"RateUnit"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="rateUnit"
              value={bookingDetails?.booking?.rateUnit}
            />

            <FieldComponent
              label={"Party Bhara"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="partyBhara"
              value={bookingDetails?.booking?.partyBhara}
            />

            <FieldComponent
              label={"Payment Liability"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="paymentLiability"
              value={bookingDetails?.booking?.paymentLiability}
            />

            <FieldComponent
              label={"Bill To"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="billTo"
              value={bookingDetails?.booking?.billTo}
            />

            <FieldComponent
              label={"Payment Term "}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="paymentTerm"
              value={bookingDetails?.booking?.paymentTerm}
            />
            <FieldComponent
              label={"Advance Amount"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="advanceAmount"
              value={bookingDetails?.booking?.advanceAmount}
            />
            <FieldComponent
              label={"Balance Amount"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="balanceAmount"
              value={bookingDetails?.booking?.balanceAmount}
            />
            <FieldComponent
              label={"Pay Mode"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="payMode"
              value={bookingDetails?.booking?.payMode}
            />
            <FieldComponent
              label={"Transaction Id"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="transactionId"
              value={bookingDetails?.booking?.transactionId}
            />
            <FieldComponent
              label={"Remarks"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="remarks"
              value={bookingDetails?.booking?.remarks}
            />

          

         
          </div>
        </div>
      )}

     
         {/* Display Additional Charges if enabled */}
         {bookingDetails?.booking?.additionalCharges?.enabled && (
          <>
          <h2 className="font-semibold text-center text-2xl mt-8">Additional Charges :</h2>
          <FieldComponent
                label={"Total Charges"}
                value={bookingDetails?.booking?.additionalCharges?.totalCharge}
                show={editBooking}
                tableId={bookingDetails?.booking?._id}
                identifier="additionalCharges.totalCharge"
              />
              {/* Display chargers array */}
            {bookingDetails?.booking?.additionalCharges?.chargers?.map(
              (charger, index) => (
                <div key={index}>
                  <FieldComponent
                    label={`Charger ${index + 1} Name`}
                    value={charger.name}
                    show={editBooking}
                    tableId={bookingDetails?.booking?._id}
                    identifier={`additionalCharges.chargers.name`}
                  />

                  <FieldComponent
                    label={`Charger ${index + 1} Rate`}
                    value={charger.rate}
                    show={editBooking}
                    tableId={bookingDetails?.booking?._id}
                    identifier={`additionalCharges.chargers.rate`}
                  />

                  <FieldComponent
                    label={`Charger ${index + 1} Quantity`}
                    value={charger.qty}
                    show={editBooking}
                    tableId={bookingDetails?.booking?._id}
                    identifier={`additionalCharges.chargers.qty`}
                  />

                  <FieldComponent
                    label={`Charger ${index + 1} Amount`}
                    value={charger.amount}
                    show={editBooking}
                    tableId={bookingDetails?.booking?._id}
                    identifier={`additionalCharges.chargers.amount`}
                  />
                </div>
              ),
            )}
          </>
             
            )}

            

            {bookingDetails?.booking?.allotedVehicle.length !== 0 && (
  <div>
    <h2 className="font-semibold text-center text-2xl mt-8">Vehicle Allocated :</h2>
    <FieldComponent
      label={"Owner Name"}
      value={bookingDetails?.booking?.allotedVehicle[0]?.vehicleOwner}
      show={editBooking}
      tableId={bookingDetails?.booking?._id}
      identifier="allotedVehicle.vehicleOwner"
    />
    <FieldComponent
      label={"Owner Mobile No"}
      value={bookingDetails?.booking?.allotedVehicle[0]?.vehicleOwnerPhone}
      show={editBooking}
      tableId={bookingDetails?.booking?._id}
      identifier="allotedVehicle.vehicleOwnerPhone"
    />
    <FieldComponent
      label={"Driver Name"}
      value={bookingDetails?.booking?.allotedVehicle[0]?.vehicleDriver}
      show={editBooking}
      tableId={bookingDetails?.booking?._id}
      identifier="allotedVehicle.vehicleDriver"
    />
    <FieldComponent
      label={"Driver Mobile No"}
      value={bookingDetails?.booking?.allotedVehicle[0]?.vehicleDriverPhone}
      show={editBooking}
      tableId={bookingDetails?.booking?._id}
      identifier="allotedVehicle.vehicleDriverPhone"
    />
    <FieldComponent
      label={"Vehicle No"}
      value={bookingDetails?.booking?.allotedVehicle[0]?.vehicleNo}
      show={editBooking}
      tableId={bookingDetails?.booking?._id}
      identifier="allotedVehicle.vehicleNo"
    />
    <FieldComponent
      label={"Vehicle Allocated Date"}
      value={bookingDetails?.booking?.allotedVehicle[0]?.date}
      show={editBooking}
      tableId={bookingDetails?.booking?._id}
      identifier="allotedVehicle.date"
    />
  </div>
)}

   

{bookingDetails?.booking?.invoice.length !== 0 && (
  <>
    <h2 className="font-semibold text-center text-2xl mt-8">Invoice detail :</h2>
    {bookingDetails?.booking?.invoice.map((invoice, index) => (
      <div key={index}>
        <FieldComponent
          label={`Invoice ${index + 1} Invoice ID`}
          value={invoice.invoiceId}
          tableId={bookingDetails?.booking?._id}
          identifier={`invoice.invoiceId`}
        />
        <FieldComponent
          label={`Invoice ${index + 1} Invoice Date`}
          value={invoice.invoiceDate}
          tableId={bookingDetails?.booking?._id}
          identifier={`invoice.invoiceDate`}
        />
        <FieldComponent
          label={`Invoice ${index + 1} Sent To Email`}
          value={invoice.sentOn}
          tableId={bookingDetails?.booking?._id}
          identifier={`invoice.sentOn`}
        />
        <FieldComponent
          label={`Invoice ${index + 1} Sent to Name`}
          value={invoice.sentTo}
          tableId={bookingDetails?.booking?._id}
          identifier={`invoice.sentTo`}
        />
        {invoice.generatedBy && (
          <FieldComponent
            label={`Invoice ${index + 1} Sended by Name`}
            value={invoice.generatedBy.name}
            tableId={bookingDetails?.booking?._id}
            identifier={`invoice.generatedBy.name`}
          />
        )}
      </div>
    ))}
  </>
)}

      
    </div>
  );
};

export default ViewDetail;
