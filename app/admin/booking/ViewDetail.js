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
        <h1 className="mb-6 text-4xl text-pink-600 font-semibold">{heading} Details: </h1>
        <div className="flex items-center justify-between space-x-2">
          <Button className="space-x-2 px-4 bg-pink-500  hover:bg-pink-600" onClick={handleGoBack}>
            <IoIosArrowBack className=" fill-white" />
            <pre className="text-base ">Back</pre>
          </Button>
          <Button
            onClick={() => setEditBooking(!editBooking)}
            className="space-x-2 px-4 bg-pink-500  hover:bg-pink-600"
          >
            <pre className="text-base">Edit</pre>
            <MdEdit className="h-8 fill-white" />
          </Button>
        </div>
      </div>
       <div className="min-h-10 bg-orange-100 rounded-2xl shadow-md p-4 grid grid-cols-3">
          <div className="flex  gap-4 ">
            <h2 className="font-semibold ">Order Id :</h2>
            <h2 className=""> {bookingDetails?.booking?.orderNumber}</h2>
          </div>

          <div className="flex  gap-4 ">
            <h2 className="font-semibold ">Date :</h2>
            <h2 className=""> {new Date(bookingDetails?.booking?.date).toLocaleDateString()}</h2>
          </div>

          <div className="flex  gap-4 ">
            <h2 className="font-semibold ">Created By :</h2>
            <h2 className="">  {bookingDetails?.booking?.createdBy.name}</h2>
          </div>

        
         
       </div>


       <div className="mt-4 min-h-10 bg-pink-50 rounded-2xl shadow-lg p-4 grid grid-cols-2 gap-x-16">

       <FieldComponent
              label={"Vehicle Req. Date"}
              value={new Date(
                bookingDetails?.booking?.vehicleRequiredDate,
              ).toLocaleDateString()}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="vehicleRequiredDate"
              type="date"
            />
       <FieldComponent
              label={"Booking Type"}
              value={
                bookingDetails?.booking?.bookingType
              }
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="bookingType"
              type="text"
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
              className='grid-span-2'
              label={"Loading Points"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="loadingPoints"
              value={bookingDetails?.booking?.loadingPoints?.join(",")}
            />

<FieldComponent
              label={"Unloading Points"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="unloadingPoints"
              value={bookingDetails?.booking?.unloadingPoints?.join(", ")}
            />

</div>

{/* Material Table */}
{bookingDetails?.booking?.itemsList.item.length > 0 &&
<div>
<h2 className="mt-6 mb-4 text-2xl text-center  text-pink-700 font-semibold underline">Material Info </h2>
<table className="mx-2 my-4 w-full border border-pink-600">
                  <thead>
                    <tr className="w-full border border-pink-600 bg-pink-200">
                      <th className=" text-pink-900 text-nowrap border border-pink-600 p-2 pr-3 text-sm font-medium  md:text-base  ">
                        Charges Name
                      </th>
                      <th className=" text-pink-900 text-nowrap border border-pink-600 p-2 pr-3 text-sm font-medium  md:text-base  ">
                        Qty
                      </th>
                      <th className=" text-pink-900 text-nowrap border border-pink-600 p-2 pr-3 text-sm font-medium  md:text-base  ">
                        Rate
                      </th>
                      <th className=" text-pink-900 text-nowrap border border-pink-600 p-2 pr-3 text-sm font-medium  md:text-base  ">
                        Amount
                      </th>
                      <th className=" text-pink-900 text-nowrap border border-pink-600 p-2 pr-3 text-sm font-medium  md:text-base  ">
                        GST 
                      </th>
                      <th className=" text-pink-900 text-nowrap border border-pink-600 p-2 pr-3 text-sm font-medium  md:text-base  ">
                        Actual Wt.
                      </th>
                   
                    </tr>
                  </thead>
                  <tbody>
                    {bookingDetails?.booking?.itemsList.item.map((items, i) => (
                      <tr key={i} className="w-full text-center">
                        <td className="border border-pink-900 text-pink-700 p-2">{items.material}</td>
                        <td className="border border-pink-900 text-pink-700 p-2">{items.quantity}&nbsp;{items.quantityUnit}</td>
                        <td className="border border-pink-900 text-pink-700 p-2">{items.rate}&nbsp; {items.rateUnit}</td>
                        <td className="border border-pink-900 text-pink-700 p-2">{items.basicAmount}</td>
                        <td className="border border-pink-900 text-pink-700 p-2">{items.GSTType}</td>
                        <td className="border border-pink-900 text-pink-700 p-2">{items.actualWeight}&nbsp;  {items.actualWeightUnit}</td>
                       
                      </tr>
                    ))}
                  </tbody>
                </table>

<div className="flex justify-between gap-8 bg-pink-50 rounded-lg">
<h2 className="p-4 font-semibold text-pink-900  ">
                  Total Amount:
                  <span className="ml-4 rounded border border-pink-400 bg-pink-100 font-light p-1 px-3 ">
                    {bookingDetails?.booking?.itemsList.totalAmount}
                  </span>
                </h2>
<h2 className="p-4 font-semibold text-pink-900 ">
                  Total Weight:
                  <span className="ml-4 rounded border border-pink-400 bg-pink-100 font-light  p-1 px-3 ">
                    {bookingDetails?.booking?.itemsList.totalActualWeight}
                  </span>
                </h2>
</div>
</div>
}
{/* Additional Charges */}
{ bookingDetails?.booking?.additionalCharges.chargers.length > 0 && <div>
<h2 className="mt-6 mb-4 text-2xl text-center  text-pink-700 font-semibold underline">Additional Chargers </h2>
<table className="mx-2 my-4 w-full border border-pink-600">
                  <thead>
                    <tr className="w-full border border-pink-600 bg-pink-200">
                      <th className=" text-pink-900 text-nowrap border border-pink-600 p-2 pr-3 text-sm font-medium  md:text-base  ">
                        Charges Name
                      </th>
                      <th className=" text-pink-900 text-nowrap border border-pink-600 p-2 pr-3 text-sm font-medium  md:text-base  ">
                        Qty
                      </th>
                      <th className=" text-pink-900 text-nowrap border border-pink-600 p-2 pr-3 text-sm font-medium  md:text-base  ">
                        Rate
                      </th>
                      <th className=" text-pink-900 text-nowrap border border-pink-600 p-2 pr-3 text-sm font-medium  md:text-base  ">
                        Amount
                      </th>
                      <th className=" text-pink-900 text-nowrap border border-pink-600 p-2 pr-3 text-sm font-medium  md:text-base  ">
                        GST 
                      </th>
                      <th className=" text-pink-900 text-nowrap border border-pink-600 p-2 pr-3 text-sm font-medium  md:text-base  ">
                        Actual Wt.
                      </th>
                   
                    </tr>
                  </thead>
                  <tbody>
                    {bookingDetails?.booking?.additionalCharges.chargers.map((items, i) => (
                      <tr key={i} className="w-full text-center">
                        <td className="border border-pink-900 text-pink-700 p-2">{items.material}</td>
                        <td className="border border-pink-900 text-pink-700 p-2">{items.quantity}&nbsp;{items.quantityUnit}</td>
                        <td className="border border-pink-900 text-pink-700 p-2">{items.rate}&nbsp; {items.rateUnit}</td>
                        <td className="border border-pink-900 text-pink-700 p-2">{items.basicAmount}</td>
                        <td className="border border-pink-900 text-pink-700 p-2">{items.GSTType}</td>
                        <td className="border border-pink-900 text-pink-700 p-2">{items.actualWeight}&nbsp;  {items.actualWeightUnit}</td>
                       
                      </tr>
                    ))}
                  </tbody>
                </table>

<div className="flex justify-between gap-8 bg-pink-50 rounded-lg">
<h2 className="p-4 font-semibold text-pink-900  ">
                  Total Amount:
                  <span className="ml-4 rounded border border-pink-400 bg-pink-100 font-light p-1 px-3 ">
                    {bookingDetails?.booking?.additionalCharges.totalCharge}
                  </span>
                </h2>

</div>

</div>}



{/* Payment Details  */}




<div className="min-h-20 border p-4 border-pink-500 mt-6 mb-4 rounded-lg shadow-md grid grid-cols-2 gap-x-16">
<FieldComponent
              label={"Payment Term "}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="paymentTerm"
              value={bookingDetails?.booking?.paymentTerm}
            />
<FieldComponent
              label={"Remarks"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="remarks"
              value={bookingDetails?.booking?.remarks}
            />


<FieldComponent
              label={"Total Additional Charger"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="remarks"
              value={bookingDetails?.booking?.totalAdditionalCharges
}
            />
<FieldComponent
             label={"Total Additional Charger Tax"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="remarks"
              value={bookingDetails?.booking?.totalAdditionalChargeTax
}
            />
<FieldComponent
              label={"Total Billing Amount"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="remarks"
              value={bookingDetails?.booking?.totalBillingAmount}
            />
<FieldComponent
              label={"Total Amount paid"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="remarks"
              value={bookingDetails?.booking?.totalPaidAmount}
            />

</div>



{/*  */}

  


     
     
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
                <h2 className="text-lg text-center font-semibold ">{`CHARGE ${index + 1}`}</h2>
                  <FieldComponent
                    label={` Name`}
                    value={charger.name}
                    show={editBooking}
                    tableId={bookingDetails?.booking?._id}
                    identifier={`additionalCharges.chargers.name`}
                  />

                  <FieldComponent
                    label={` Rate`}
                    value={charger.rate}
                    show={editBooking}
                    tableId={bookingDetails?.booking?._id}
                    identifier={`additionalCharges.chargers.rate`}
                  />

                  <FieldComponent
                    label={` Quantity`}
                    value={charger.qty}
                    show={editBooking}
                    tableId={bookingDetails?.booking?._id}
                    identifier={`additionalCharges.chargers.qty`}
                  />

                  <FieldComponent
                    label={` Amount`}
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
      <h2 className="text-lg text-center font-semibold ">{`INVOICE ${index + 1}`}</h2>
        <FieldComponent
          label={` Invoice ID`}
          value={invoice.invoiceId}
          tableId={bookingDetails?.booking?._id}
          identifier={`invoice.invoiceId`}
        />
        <FieldComponent
          label={` Invoice Date`}
          value={invoice.invoiceDate}
          tableId={bookingDetails?.booking?._id}
          identifier={`invoice.invoiceDate`}
        />
        <FieldComponent
          label={` Sent To Email`}
          value={invoice.sentOn}
          tableId={bookingDetails?.booking?._id}
          identifier={`invoice.sentOn`}
        />
        <FieldComponent
          label={` Sent to Name`}
          value={invoice.sentTo}
          tableId={bookingDetails?.booking?._id}
          identifier={`invoice.sentTo`}
        />
        {invoice.generatedBy && (
          <FieldComponent
            label={` Sended by Name`}
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
