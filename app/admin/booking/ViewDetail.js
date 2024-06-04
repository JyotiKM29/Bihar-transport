"use client";
import { useToast } from "../../components/ui/use-toast";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import FieldComponent from "./FieldComponent";
import { Button } from "../../components/ui/button";
// import Lightbox from "react-image-lightbox";
// import "react-image-lightbox/style.css";

const ViewDetail = ({ bookingDetails, heading }) => {
  // const [lightboxOpen, setLightboxOpen] = useState(false);
  // const [lightboxIndex, setLightboxIndex] = useState(0);

  // const openLightbox = (index) => {
  //   setLightboxIndex(index);
  //   setLightboxOpen(true);
  // };

  // const closeLightbox = () => {
  //   setLightboxOpen(false);
  // };
  const { toast } = useToast();
  const router = useRouter();
  const [editBooking, setEditBooking] = useState(false);
  // console.log('Hey jyoti ' ,bookingDetails)

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-[90vh] w-full rounded-2xl bg-white px-6 py-4 shadow-sm ">
      <div className="flex flex-col-reverse items-center justify-between md:flex-row">
        <h1 className="mb-6 mt-2 text-2xl font-semibold text-cyan-600 md:mt-0 lg:text-4xl">
          {heading} Details:{" "}
        </h1>
        <div className="flex items-center justify-between space-x-2">
          <Button
            className="space-x-2 bg-cyan-600 px-4  hover:bg-cyan-700"
            onClick={handleGoBack}
          >
            <IoIosArrowBack className=" fill-white" />
            <pre className="text-base ">Back</pre>
          </Button>
          <Button
            onClick={() => setEditBooking(!editBooking)}
            className="space-x-2 bg-cyan-600 px-4  hover:bg-cyan-700"
          >
            <pre className="text-base">Edit</pre>
            <MdEdit className="h-8 fill-white" />
          </Button>
        </div>
      </div>
      <div className="grid min-h-10  grid-cols-2 rounded-2xl bg-orange-100 p-4 shadow-md md:grid-cols-3">
        <div className="flex  gap-4 ">
          <h2 className="font-semibold ">Order Id :</h2>
          <h2 className=""> {bookingDetails?.booking?.orderNumber}</h2>
        </div>

        <div className="flex  gap-4 ">
          <h2 className="font-semibold ">Date :</h2>
          <h2 className="">
            {" "}
            {new Date(bookingDetails?.booking?.date).toLocaleDateString()}
          </h2>
        </div>

        <div className="flex  gap-4 ">
          <h2 className="font-semibold ">Created By :</h2>
          <h2 className=""> {bookingDetails?.booking?.createdBy.name}</h2>
        </div>
      </div>

      <div className="mt-4 grid min-h-10  grid-cols-1 gap-x-16 rounded-2xl bg-cyan-50 p-4 shadow-lg md:grid-cols-2">
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
          value={bookingDetails?.booking?.bookingType}
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
          className="grid-span-2"
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
      {bookingDetails?.booking?.itemsList.item.length > 0 && (
        <div>
          <h2 className="mb-4 mt-6 text-center text-2xl  font-semibold text-cyan-700 underline">
            Material Info{" "}
          </h2>
          <div className="overflow-x-auto md:overflow-x-visible">
            <table className="mx-2 my-4 w-full border border-cyan-600 ">
              <thead>
                <tr className="w-full border border-cyan-600 bg-cyan-200">
                  <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                    Charges Name
                  </th>
                  <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                    Qty
                  </th>
                  <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                    Rate
                  </th>
                  <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                    Amount
                  </th>
                  <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                    GST
                  </th>
                  <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                    Actual Wt.
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookingDetails?.booking?.itemsList.item.map((items, i) => (
                  <tr key={i} className="w-full text-center">
                    <td className="border border-cyan-900 p-2 text-cyan-700">
                      {items.material}
                    </td>
                    <td className="border border-cyan-900 p-2 text-cyan-700">
                      {items.quantity}&nbsp;{items.quantityUnit}
                    </td>
                    <td className="border border-cyan-900 p-2 text-cyan-700">
                      {items.rate}&nbsp; {items.rateUnit}
                    </td>
                    <td className="border border-cyan-900 p-2 text-cyan-700">
                      {items.basicAmount}
                    </td>
                    <td className="border border-cyan-900 p-2 text-cyan-700">
                      {items.GSTType}
                    </td>
                    <td className="border border-cyan-900 p-2 text-cyan-700">
                      {items.actualWeight}&nbsp; {items.actualWeightUnit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between gap-8 rounded-lg bg-cyan-50">
            <h2 className="p-4 font-semibold text-cyan-900  ">
              Total Amount:
              <span className="ml-4 rounded border border-cyan-400 bg-cyan-100 p-1 px-3 font-light ">
                {bookingDetails?.booking?.itemsList.totalAmount}
              </span>
            </h2>
            <h2 className="p-4 font-semibold text-cyan-900 ">
              Total Weight:
              <span className="ml-4 rounded border border-cyan-400 bg-cyan-100 p-1  px-3 font-light ">
                {bookingDetails?.booking?.itemsList.totalActualWeight}
              </span>
            </h2>
          </div>
        </div>
      )}
      {/* Additional Charges */}
      {bookingDetails?.booking?.additionalCharges.chargers.length > 0 && (
        <div>
          <h2 className="mb-4 mt-6 text-center text-2xl  font-semibold text-cyan-700 underline">
            Additional Chargers{" "}
          </h2>
          <div className="overflow-x-auto md:overflow-x-visible">
            <table className="mx-2 my-4 w-full border border-cyan-600 ">
              <thead>
                <tr className="w-full border border-cyan-600 bg-cyan-200">
                  <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                    Charges Name
                  </th>
                  <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                    Qty
                  </th>
                  <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                    Rate
                  </th>
                  <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookingDetails?.booking?.additionalCharges.chargers.map(
                  (items, i) => (
                    <tr key={i} className="w-full text-center">
                      <td className="border border-cyan-900 p-2 text-cyan-700">
                        {items.name}
                      </td>
                      <td className="border border-cyan-900 p-2 text-cyan-700">
                        {items.qty}{" "}
                      </td>
                      <td className="border border-cyan-900 p-2 text-cyan-700">
                        {items.rate}
                      </td>
                      <td className="border border-cyan-900 p-2 text-cyan-700">
                        {items.amount}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between gap-8 rounded-lg bg-cyan-50">
            <h2 className="p-4 font-semibold text-cyan-900  ">
              Total Amount:
              <span className="ml-4 rounded border border-cyan-400 bg-cyan-100 p-1 px-3 font-light ">
                {bookingDetails?.booking?.additionalCharges.totalCharge}
              </span>
            </h2>
          </div>
        </div>
      )}

      {/* Payment Details  */}
      <h2 className="mb-4 mt-6 text-center text-2xl  font-semibold text-cyan-700 underline">
        Payment Details{" "}
      </h2>
      <div className="mb-4 mt-6 grid min-h-20 grid-cols-1 gap-x-16 rounded-lg border border-cyan-500 p-4 shadow-md md:grid-cols-2">
        <FieldComponent
          label={"Payment Term "}
          show={editBooking}
          tableId={bookingDetails?.booking?._id}
          identifier="paymentTerm"
          value={bookingDetails?.booking?.paymentTerm}
        />
        <FieldComponent
          label={"Balance Amount"}
          show={editBooking}
          tableId={bookingDetails?.booking?._id}
          identifier="balanceAmount"
          value={bookingDetails?.booking?.balanceAmount}
        />
        <FieldComponent
          label={"party Bhara"}
          show={editBooking}
          tableId={bookingDetails?.booking?._id}
          identifier="partyBhara"
          value={bookingDetails?.booking?.partyBhara}
        />

        <FieldComponent
          label={"Total Additional Charger"}
          show={editBooking}
          tableId={bookingDetails?.booking?._id}
          identifier="totalAdditionalCharges"
          value={bookingDetails?.booking?.totalAdditionalCharges}
        />
        <FieldComponent
          label={"Total Additional Charger Tax"}
          show={editBooking}
          tableId={bookingDetails?.booking?._id}
          identifier="totalAdditionalChargeTax"
          value={bookingDetails?.booking?.totalAdditionalChargeTax}
        />
        <FieldComponent
          label={"Total Billing Amount"}
          show={editBooking}
          tableId={bookingDetails?.booking?._id}
          identifier="totalBillingAmount"
          value={bookingDetails?.booking?.totalBillingAmount}
        />
        <FieldComponent
          label={"Total Amount paid"}
          show={editBooking}
          tableId={bookingDetails?.booking?._id}
          identifier="totalPaidAmount"
          value={bookingDetails?.booking?.totalPaidAmount}
        />
      </div>

      <div className="grid grid-cols-1 gap-x-16 rounded-lg bg-cyan-50 p-4 md:grid-cols-2">
        <FieldComponent
          label={"Way"}
          show={editBooking}
          tableId={bookingDetails?.booking?._id}
          identifier="way"
          value={bookingDetails?.booking?.way}
        />
        <FieldComponent
          label={"Vehicle Type"}
          show={editBooking}
          tableId={bookingDetails?.booking?._id}
          identifier="vehicleType"
          value={bookingDetails?.booking?.vehicleType}
        />
        <FieldComponent
          label={"No of Vehicle"}
          show={editBooking}
          tableId={bookingDetails?.booking?._id}
          identifier="noOfVehicle"
          value={bookingDetails?.booking?.noOfVehicle}
        />
        <FieldComponent
          label={"Remark"}
          show={editBooking}
          tableId={bookingDetails?.booking?._id}
          identifier="remarks"
          value={bookingDetails?.booking?.remarks}
        />
      </div>

      {/* Allocated Vehicle */}
      {bookingDetails?.booking?.allotedVehicle.length > 0 && (
        <div>
          <h2 className="mb-4 mt-6 text-center text-2xl  font-semibold text-cyan-700 underline">
            Allocated Vehicle{" "}
          </h2>
          <div className="mt-4 grid min-h-10  grid-cols-1 gap-x-16 rounded-2xl bg-cyan-200 p-4 shadow-lg md:grid-cols-2">
            <FieldComponent
              label={"Owner Name"}
              value={bookingDetails?.booking?.allotedVehicle[0]?.vehicleOwner}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="allotedVehicle[0].vehicleOwner"
            />
            <FieldComponent
              label={"Owner Mobile No"}
              value={
                bookingDetails?.booking?.allotedVehicle[0]?.vehicleOwnerPhone
              }
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="allotedVehicle[0].vehicleOwnerPhone"
            />
            <FieldComponent
              label={"Driver Name"}
              value={bookingDetails?.booking?.allotedVehicle[0]?.vehicleDriver}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="allotedVehicle[0].vehicleDriver"
            />
            <FieldComponent
              label={"Driver Mobile No"}
              value={
                bookingDetails?.booking?.allotedVehicle[0]?.vehicleDriverPhone
              }
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="allotedVehicle[0].vehicleDriverPhone"
            />
            <FieldComponent
              label={"Vehicle No"}
              value={bookingDetails?.booking?.allotedVehicle[0]?.vehicleNo}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="allotedVehicle[0].vehicleNo"
            />
            <FieldComponent
              label={"Vehicle Allocated Date"}
              value={new Date(
                bookingDetails?.booking?.allotedVehicle[0]?.date,
              ).toLocaleDateString()}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="allotedVehicle[0].date"
            />
          </div>
        </div>
      )}

      {/* Generated Invoice Details */}
      {
        <div>
          <h2 className="mb-4 mt-6 text-center text-2xl  font-semibold text-cyan-700 underline">
            Invoice Details :
          </h2>
          <div className="overflow-x-auto md:overflow-x-visible">
            <table className="mx-2 my-4 w-full border border-cyan-600 ">
              <thead>
                <tr className="w-full border border-cyan-600 bg-cyan-200">
                  <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                    Invoice No
                  </th>
                  <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                    Date
                  </th>
                  <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                    Amount
                  </th>
                  <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                    Total
                  </th>
                  <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                    Remark
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="w-full text-center">
                  <td className="border border-cyan-900 p-2 text-cyan-700">
                    {bookingDetails?.booking?.generatedInvoice?.invoiceNumber}
                  </td>
                  <td className="border border-cyan-900 p-2 text-cyan-700">
                    {new Date(
                      bookingDetails?.booking?.generatedInvoice?.invoiceDate,
                    ).toLocaleDateString()}
                  </td>
                  <td className="border border-cyan-900 p-2 text-cyan-700">
                    {bookingDetails?.booking?.generatedInvoice?.invoiceAmount}
                  </td>

                  <td className="border border-cyan-900 p-2 text-cyan-700">
                    {bookingDetails?.booking?.generatedInvoice?.invoiceTotal}
                  </td>
                  <td className="border border-cyan-900 p-2 text-cyan-700">
                    {bookingDetails?.booking?.generatedInvoice?.invoiceRemarks}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      }

      {/* Dispacted */}
      {bookingDetails?.booking?.dispatch?.isDispatched === true && (
        <div>
          <h2 className="mb-4 mt-6 text-center text-2xl  font-semibold text-cyan-700 underline">
            Dispatch Details :
          </h2>

          <div className="mb-4 mt-6 grid  min-h-20 grid-cols-1 gap-x-16 rounded-lg border border-cyan-500 p-4 shadow-md md:grid-cols-2">
            <FieldComponent
              label={"Bill Type"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="dispatch.dispatchDetails.billtyType"
              value={
                bookingDetails?.booking?.dispatch?.dispatchDetails?.billtyType
              }
            />
            <FieldComponent
              label={"Dispatch Date"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="paymentTerm"
              value={new Date(
                bookingDetails?.booking?.dispatch?.dispatchDetails?.dispatchDate,
              ).toLocaleDateString()}
            />
            <FieldComponent
              label={"Dispatch Time"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="paymentTerm"
              value={
                bookingDetails?.booking?.dispatch?.dispatchDetails?.dispatchTime
              }
            />
            <FieldComponent
              label={"ledger Bal. of Party"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="paymentTerm"
              value={
                bookingDetails?.booking?.dispatch?.dispatchDetails
                  ?.ledgerBalanceOfParty
              }
            />
            <FieldComponent
              label={"Total Freight"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="paymentTerm"
              value={
                bookingDetails?.booking?.dispatch?.dispatchDetails?.totalFreight
              }
            />
            <FieldComponent
              label={"Remarks"}
              show={editBooking}
              tableId={bookingDetails?.booking?._id}
              identifier="paymentTerm"
              value={
                bookingDetails?.booking?.dispatch?.dispatchDetails?.remarks
              }
            />
            <div className="col-span-full justify-between  rounded bg-cyan-50 p-4 sm:flex">
              <div>
                <p className="mb-4  text-center text-xl  font-light text-cyan-700 underline">
                  Consignor Invoice Details
                </p>

                <FieldComponent
                  label={"Delivery No"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.dispatch?.dispatchDetails
                      ?.consignorInvoiceDetails?.consignorDeliveryNo
                  }
                />
                <FieldComponent
                  label={"Invoice No"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.dispatch?.dispatchDetails
                      ?.consignorInvoiceDetails?.consignorInvoiceNo
                  }
                />
                <FieldComponent
                  label={"Invoice date"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={new Date(
                    bookingDetails?.booking?.dispatch?.dispatchDetails?.consignorInvoiceDetails?.consignorInvoiceDate,
                  ).toLocaleDateString()}
                />
              </div>

              <div>
                <p className="mb-4  text-center text-lg font-light text-cyan-700  underline ">
                  eWay Bill Details
                </p>
                <FieldComponent
                  label={"Bill Date"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={new Date(
                    bookingDetails?.booking?.dispatch?.dispatchDetails?.consignorInvoiceDetails?.eWayBillDetails?.eWayBillDate,
                  ).toLocaleDateString()}
                />
                <FieldComponent
                  label={"Bill No"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.dispatch?.dispatchDetails
                      ?.consignorInvoiceDetails?.eWayBillDetails?.eWayBillNo
                  }
                />
                <FieldComponent
                  label={"Exp. Date"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={new Date(
                    bookingDetails?.booking?.dispatch?.dispatchDetails?.consignorInvoiceDetails?.eWayBillDetails?.expDate,
                  ).toLocaleDateString()}
                />
              </div>
            </div>

            {/* table of Chargers */}
            {bookingDetails?.booking?.dispatch?.dispatchDetails?.dispatch
              ?.chargesDetails.length > 0 && (
              <div className="col-span-full">
                <p className="mb-4 mt-6 text-center text-xl  font-light text-cyan-700 underline">
                  Charges Details
                </p>
                <div className="overflow-x-auto md:overflow-x-visible">
                  <table className="mx-2 my-4 w-full border border-cyan-600 ">
                    <thead>
                      <tr className="w-full border border-cyan-600 bg-cyan-200">
                        <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                          Charges Name
                        </th>
                        <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                          days
                        </th>
                        <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                          Rate
                        </th>
                        <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                          Amount
                        </th>
                        <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                          Remarks
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingDetails?.booking?.dispatch?.dispatchDetails?.dispatch?.chargesDetails.map(
                        (items, i) => (
                          <tr key={i} className="w-full text-center">
                            <td className="border border-cyan-900 p-2 text-cyan-700">
                              {items.chargesName}
                            </td>
                            <td className="border border-cyan-900 p-2 text-cyan-700">
                              {items.days}
                            </td>
                            <td className="border border-cyan-900 p-2 text-cyan-700">
                              {items.rate}
                            </td>
                            <td className="border border-cyan-900 p-2 text-cyan-700">
                              {items.amount}
                            </td>
                            <td className="border border-cyan-900 p-2 text-cyan-700">
                              {items.remarks}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="col-span-full">
              <FieldComponent
                label={"Additional Rate For Company"}
                show={editBooking}
                tableId={bookingDetails?.booking?._id}
                identifier="paymentTerm"
                value={
                  bookingDetails?.booking?.dispatch?.dispatchDetails?.dispatch
                    ?.additionalRateForCompany
                }
              />
            </div>
            {/* Additional Details */}
            <div className="col-span-full  grid grid-cols-1 gap-x-16 rounded bg-cyan-50 p-4 md:grid-cols-2">
              <FieldComponent
                label={"Delivery Type"}
                show={editBooking}
                tableId={bookingDetails?.booking?._id}
                identifier="paymentTerm"
                value={
                  bookingDetails?.booking?.dispatch?.dispatchAdditionalDetails
                    ?.deliveryType
                }
              />
              <FieldComponent
                label={"Manual LR No"}
                show={editBooking}
                tableId={bookingDetails?.booking?._id}
                identifier="paymentTerm"
                value={
                  bookingDetails?.booking?.dispatch?.dispatchAdditionalDetails
                    ?.manualLRNo
                }
              />
              <FieldComponent
                label={"Broker Commission"}
                show={editBooking}
                tableId={bookingDetails?.booking?._id}
                identifier="paymentTerm"
                value={
                  bookingDetails?.booking?.dispatch?.dispatchAdditionalDetails
                    ?.brokerCommission
                }
              />
              <FieldComponent
                label={"Shipping Risk"}
                show={editBooking}
                tableId={bookingDetails?.booking?._id}
                identifier="paymentTerm"
                value={
                  bookingDetails?.booking?.dispatch?.dispatchAdditionalDetails
                    ?.shippingRisk
                }
              />
              {bookingDetails?.booking?.dispatch?.dispatchAdditionalDetails
                ?.insurance?.isInsured === true && (
                <>
                  <p className="text-light col-span-full my-4 text-center text-xl text-cyan-700 underline">
                    Insurance
                  </p>
                  <FieldComponent
                    label={"Insurance Provider"}
                    show={editBooking}
                    tableId={bookingDetails?.booking?._id}
                    identifier="paymentTerm"
                    value={
                      bookingDetails?.booking?.dispatch
                        ?.dispatchAdditionalDetails?.insurance
                        ?.insuranceProvider
                    }
                  />
                  <FieldComponent
                    label={"Policy No"}
                    show={editBooking}
                    tableId={bookingDetails?.booking?._id}
                    identifier="paymentTerm"
                    value={
                      bookingDetails?.booking?.dispatch
                        ?.dispatchAdditionalDetails?.insurance?.policyNo
                    }
                  />
                  <FieldComponent
                    label={"Broker Details"}
                    show={editBooking}
                    tableId={bookingDetails?.booking?._id}
                    identifier="paymentTerm"
                    value={
                      bookingDetails?.booking?.dispatch
                        ?.dispatchAdditionalDetails?.insurance?.brokerDetails
                    }
                  />
                  <FieldComponent
                    label={"Policy Amount"}
                    show={editBooking}
                    tableId={bookingDetails?.booking?._id}
                    identifier="paymentTerm"
                    value={
                      bookingDetails?.booking?.dispatch
                        ?.dispatchAdditionalDetails?.insurance?.policyAmount
                    }
                  />
                  <FieldComponent
                    label={"Claim Amount"}
                    show={editBooking}
                    tableId={bookingDetails?.booking?._id}
                    identifier="paymentTerm"
                    value={
                      bookingDetails?.booking?.dispatch
                        ?.dispatchAdditionalDetails?.insurance?.claimAmount
                    }
                  />
                </>
              )}
            </div>

            <div className="col-span-full">
              <p className="text-light col-span-full my-4 text-center text-xl text-cyan-700 underline">
                Additional Rate Table
              </p>
              <div className="overflow-x-auto md:overflow-x-visible">
                <table className="mx-2 my-4 w-full border border-cyan-600">
                  <thead>
                    <tr className="w-full border border-cyan-600 bg-cyan-200">
                      <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                        Charges Name
                      </th>
                      <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                        Days
                      </th>
                      <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                        Rate
                      </th>
                      <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                        Amount
                      </th>
                      <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingDetails?.booking?.dispatch?.dispatchAdditionalRate.map(
                      (items, i) => (
                        <tr key={i} className="w-full text-center">
                          <td className="border border-cyan-900 p-2 text-cyan-700">
                            {items.chargesName}
                          </td>
                          <td className="border border-cyan-900 p-2 text-cyan-700">
                            {items.days}
                          </td>
                          <td className="border border-cyan-900 p-2 text-cyan-700">
                            {items.rate}
                          </td>
                          <td className="border border-cyan-900 p-2 text-cyan-700">
                            {items.amount}
                          </td>
                          <td className="border border-cyan-900 p-2 text-cyan-700">
                            {items.remarks}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payment History */}
          {bookingDetails?.booking?.paymentHistory.length > 0 && (
            <div>
              <h2 className="mb-4 mt-6 text-center text-2xl  font-semibold text-cyan-700 underline">
                Payment History :
              </h2>
              <div className="overflow-x-auto md:overflow-x-visible">
                <table className="mx-2 my-4 w-full border border-cyan-600 ">
                  <thead>
                    <tr className="w-full border border-cyan-600 bg-cyan-200">
                      <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                        Payment Date
                      </th>
                      <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                        Paid Amount
                      </th>

                      <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                        Payment Mode
                      </th>
                      <th className=" text-nowrap border border-cyan-600 p-2 pr-3 text-sm font-medium text-cyan-900  md:text-base  ">
                        TDS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingDetails?.booking?.paymentHistory?.map(
                      (items, i) => (
                        <tr key={i} className="w-full text-center">
                          <td className="border border-cyan-900 p-2 text-cyan-700">
                            {new Date(items.paymentDate).toLocaleDateString()}
                          </td>
                          <td className="border border-cyan-900 p-2 text-cyan-700">
                            {items.paidAmount}
                          </td>
                          <td className="border border-cyan-900 p-2 text-cyan-700">
                            {items.paymentMode}
                          </td>
                          <td className="border border-cyan-900 p-2 text-cyan-700">
                            {items.TDS}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Delivery details */}
          <div>
            <h2 className="mb-4 mt-6 text-center  text-2xl  font-semibold text-cyan-700 underline">
              Delivery
            </h2>

            <div className="mb-4 mt-6 grid  min-h-20 grid-cols-1 gap-x-16 rounded border border-cyan-500 shadow-lg md:grid-cols-2">
              <div className="col-span-full grid grid-cols-1 gap-x-16 rounded bg-cyan-100 p-4 md:grid-cols-2 ">
                <p className="col-span-full mb-4 text-center text-xl  font-light text-cyan-700 underline">
                  Delivery Details
                </p>

                <FieldComponent
                  label={"Reporting date"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={new Date(
                    bookingDetails?.booking?.delivery?.delivery_details?.reporting_date,
                  ).toLocaleDateString()}
                />
                <FieldComponent
                  label={"Unloading date"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={new Date(
                    bookingDetails?.booking?.delivery?.delivery_details?.unloading_date,
                  ).toLocaleDateString()}
                />
                <FieldComponent
                  label={"Material Received by"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.delivery_details
                      ?.material_received_by
                  }
                />
                <FieldComponent
                  label={"Phone No"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.delivery_details
                      ?.phone_number
                  }
                />
                <FieldComponent
                  label={"Stamp"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.delivery_details?.stamp
                      ? "Yes "
                      : "No"
                  }
                />
                <FieldComponent
                  label={"Sign"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.delivery_details?.sign
                      ? "Yes "
                      : "No"
                  }
                />
              </div>
              <div className="col-span-full my-3 grid grid-cols-1 gap-x-16 rounded-lg p-4 md:grid-cols-2 ">
                <p className="col-span-full mb-4 text-center text-xl  font-light text-cyan-700 underline">
                  Payment Details
                </p>

                <FieldComponent
                  label={"LR Dues Amount"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.payment_details
                      ?.lr_dues_amount
                  }
                />
                <FieldComponent
                  label={"Payment Modes"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.payment_details
                      ?.payment_modes
                  }
                />
                <FieldComponent
                  label={"Amount Received "}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.payment_details
                      ?.amount_received
                  }
                />
                <FieldComponent
                  label={"fine "}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.payment_details?.fine
                  }
                />
                <FieldComponent
                  label={"final Due"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.payment_details
                      ?.final_due
                  }
                />
                <FieldComponent
                  label={"Remarks"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.payment_details?.remarks
                  }
                />
              </div>
              <div className="col-span-full grid grid-cols-1 gap-x-16 rounded bg-cyan-100 p-4 md:grid-cols-2 ">
                <p className="col-span-full mb-4 text-center text-xl  font-light text-cyan-700 underline">
                  Consignment Info
                </p>

                <FieldComponent
                  label={"Delivery date"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={new Date(
                    bookingDetails?.booking?.delivery?.consignment_info[0]?.delivery_date,
                  ).toLocaleDateString()}
                />
                <FieldComponent
                  label={"Delivery No"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.consignment_info[0]
                      ?.delivery_number
                  }
                />
                <FieldComponent
                  label={"From Location"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.consignment_info[0]
                      ?.from_location
                  }
                />
                <FieldComponent
                  label={"To location"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.consignment_info[0]
                      ?.to_location
                  }
                />
                <FieldComponent
                  label={"Quantity"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.consignment_info[0]
                      ?.quantity
                  }
                />
                <FieldComponent
                  label={"Weight"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.consignment_info[0]
                      ?.weight
                  }
                />
                <FieldComponent
                  label={"Breakage"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.consignment_info[0]
                      ?.breakage
                  }
                />
                <FieldComponent
                  label={"Excess"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.consignment_info[0]
                      ?.excess
                  }
                />
                <FieldComponent
                  label={"Shortage"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.consignment_info[0]
                      ?.shortage
                  }
                />
                <FieldComponent
                  label={"Remarks"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.consignment_info[0]
                      ?.remarks
                  }
                />
                <div className="flex items-center justify-between">
                  <FieldComponent
                    label={"POD"}
                    show={editBooking}
                    tableId={bookingDetails?.booking?._id}
                    identifier="paymentTerm"
                    className="mr-4"
                  />
                  <div className="h-auto max-w-[200px]">
                    {/* <img
                      src={
                        bookingDetails?.booking?.delivery?.consignment_info[0]
                          ?.pod
                      }
                      alt="POD Image"
                      className="h-auto w-full transform cursor-pointer rounded-md shadow-md transition-transform hover:scale-105"
                      onClick={() => openLightbox(0)} // Change the index if you have multiple images
                    /> */}
                  </div>
                  {/* {lightboxOpen && (
                    <Lightbox
                      mainSrc={
                        bookingDetails?.booking?.delivery?.consignment_info[
                          lightboxIndex
                        ]?.pod
                      }
                      onCloseRequest={closeLightbox}
                      enableZoom={true}
                    />
                  )} */}
                </div>

                {/* <FieldComponent
                  label={"Action"}
                  show={editBooking}
                  tableId={bookingDetails?.booking?._id}
                  identifier="paymentTerm"
                  value={
                    bookingDetails?.booking?.delivery?.consignment_info[0]
                      ?.action
                  }
                /> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDetail;
