"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { useRouter } from "next/navigation";
import DataView from "../../DataView";
import { IoIosArrowBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";

const View = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const router = useRouter();
  const [editAccounting, setEditAccounting] = useState(false);

  const id = params.id;
  async function fetchData() {
    const response = await fetch(
      `/api/accounting/getLedgerDetails/${id}`,
    );
    const result = await response.json();

    setData(result.data);
    setLoading(false);
    console.log("res", result);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

  return (
    <div className="max-w max-h mt-14 rounded-2xl  bg-white px-4 py-4 shadow-lg md:px-10 lg:my-4 lg:p-8 lg:px-20">
      <div className="flex items-center justify-between">
        <h2 className="mb-8  text-3xl font-semibold text-orange-500">
          Leadger Details :
        </h2>
        <div className="flex items-center justify-between space-x-2">
          <Button className="space-x-2 px-4" onClick={handleGoBack}>
            <IoIosArrowBack className=" fill-white" />
            <pre className="text-base">Back</pre>
          </Button>
          <Button
            onClick={() => setEditAccounting(!editAccounting)}
            className="space-x-2 px-4"
          >
            <pre className="text-base">Edit</pre>
            <MdEdit className="h-8 fill-white" />
          </Button>
        </div>
      </div>

      <>
        {loading ? (
          "loading ..."
        ) : (
          <>
          <h2 className="text-center font-medium text-blue-500 text-xl">Basic Info</h2>

          <DataView
              label=" Account Name"
              value={data?.basicInfo?.accountName}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`basicInfo.accountName`}
            />
            <hr />
            <DataView
              label="Contact No"
              value={data?.basicInfo?.contactNo}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`basicInfo.contactNo`}
            />
            <hr />
            <DataView
              label="office Address"
              value={data?.basicInfo?.officeAddress}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`basicInfo.officeAddress`}
            />
            <hr />
           
          <h2 className="text-center mt-8 font-medium text-blue-500 text-xl">Tax Info</h2>
           

            <DataView
              label="Receive Amount"
              value={data?.basicInfo?.taxInfo?.GSTIN}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`basicInfo.taxInfo.GSTIN`}
            />
            <hr />
            <DataView
              label="PAN No"
              value={data?.basicInfo?.taxInfo?.PanNo}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`basicInfo.taxInfo.PanNo`}
            />
            <hr />
            <DataView
              label="trade Name"
              value={data?.basicInfo?.taxInfo?.tradeName}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`basicInfo.taxInfo.tradeName`}
            />
            <hr />

            <DataView
              label="Legal Name"
              value={data?.basicInfo?.taxInfo?.legalName}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`basicInfo.taxInfo.legalName`}
            />
            <hr />
            <DataView
              label="Principal Place of Business"
              value={data?.basicInfo?.taxInfo?.principalPlaceOfBusiness}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`basicInfo.taxInfo.principalPlaceOfBusiness`}
            />
            <hr />
            <DataView
              label="Rating "
              value={data?.basicInfo?.taxInfo?.rating}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`basicInfo.taxInfo.rating`}
            />
            <hr />
            <DataView
              label="Aditional Contact"
              value={data?.basicInfo?.taxInfo?.additionalContact}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`basicInfo.taxInfo.additionalContact`}
            />
            <hr />
            <DataView
              label="Remarks "
              value={data?.basicInfo?.taxInfo?.remarks}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`basicInfo.taxInfo.remarks`}
            />
            <hr />

            <h2 className="text-center mt-8 font-medium text-blue-500 text-xl">Account Details</h2>
            {/* Account details */}
            <DataView
              label="Opening Balance "
              value={data?.accountDetails?.openingBalance?.amount}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`accountDetails.openingBalance.amount`}
            />
            <hr />
            <DataView
              label="Opening Balance Type "
              value={data?.accountDetails?.openingBalance?.debitCredit}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`accountDetails.openingBalance.debitCredit`}
            />
            <hr />


            <DataView
              label="Account Group "
              value={data?.accountDetails?.accountGroup}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`accountDetails.accountGroup`}
            />
            <hr />
            <DataView
              label="Nature of Account "
              value={data?.accountDetails?.natureOfAccount}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`accountDetails.natureOfAccount`}
            />
            <hr />
            <DataView
              label="Credit Limit"
              value={data?.accountDetails?.creditLimit}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`accountDetails.creditLimit`}
            />
            <hr />
            <DataView
              label="Default Payment Term "
              value={data?.accountDetails?.defaultPaymentTerm}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`accountDetails.defaultPaymentTerm`}
            />
            <hr />
            <DataView
              label="Service to States "
              value={data?.accountDetails?.serviceToStates}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`accountDetails.serviceToStates`}
            />
            <hr />
            <DataView
              label="Type of Vehicle "
              value={data?.accountDetails?.typeOfVehicle}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`accountDetails.typeOfVehicle`}
            />
            <hr />
            <DataView
              label="Attach Id "
              value={data?.accountDetails?.attachId}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`accountDetails.attachId`}
            />
            <hr />
            <DataView
              label="Alert "
              value={data?.accountDetails?.alert}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`accountDetails.alert`}
            />
            <hr />

            
            <h2 className="text-center mt-8 font-medium text-blue-500 text-xl">Bank Detail</h2>
            <DataView
              label="Bank Name"
              value={data?.bankDetails?.bankName}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`bankDetails.bankName`}
            />
            <hr />
            <DataView
              label="Name on Passbook"
              value={data?.bankDetails?.nameOnPassbook}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`bankDetails.nameOnPassbook`}
            />
            <hr />
            <DataView
              label="Account No"
              value={data?.bankDetails?.accountNo}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`bankDetails.accountNo`}
            />
            <hr />
            <DataView
              label="IFSCCode"
              value={data?.bankDetails?.IFSCCode}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`bankDetails.IFSCCode`}
            />
            <hr />
            <DataView
              label="Branch"
              value={data?.bankDetails?.branch}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`bankDetails.branch`}
            />
            <hr />
            <DataView
              label="Upi No"
              value={data?.bankDetails?.upiNo}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`bankDetails.upiNo`}
            />
            <hr />
            <DataView
              label="Upi Type"
              value={data?.bankDetails?.upiType}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`bankDetails.upiType`}
            />
            <hr />
            <h2 className="text-center mt-8 font-medium text-blue-500 text-xl">Additional Info</h2>
            <DataView
              label="Trip Type "
              value={data?.additionalInfo?.tripType}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`additionalInfo.tripType`}
            />
            <hr />
            <DataView
              label="Route "
              value={data?.additionalInfo?.route}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`additionalInfo.route`}
            />
            <hr />
            <DataView
              label="Proof Type"
              value={data?.additionalInfo?.proofType}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`additionalInfo.proofType`}
            />
            <hr />
            <DataView
              label="Proof Number"
              value={data?.additionalInfo?.proofNumber}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`additionalInfo.proofNumber`}
            />
            <hr />
            <DataView
              label="Name "
              value={data?.additionalInfo?.name}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`additionalInfo.name`}
            />
            <hr />
            <DataView
              label=" DOB"
              value={data?.additionalInfo?.DOB}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`additionalInfo.DOB`}
              type="date"
            />
            <hr />
            <DataView
              label="SDWOf "
              value={data?.additionalInfo?.SDWOf}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`additionalInfo.SDWOf`}
            />
            <hr />
            <DataView
              label="Proof contact No "
              value={data?.additionalInfo?.proofContactNo}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`additionalInfo.proofContactNo`}
            />
            <hr />
            <DataView
              label="Proof Address "
              value={data?.additionalInfo?.proofAddress}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`additionalInfo.proofAddress`}
            />
            <hr />
            <DataView
              label="Designation "
              value={data?.additionalInfo?.designation}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`additionalInfo.designation`}
            />
            <hr />
            <DataView
              label="Email"
              value={data?.additionalInfo?.email}
              show={editAccounting}
              tableId={data?._id}
              apiCall="editledger"
              identifier={`additionalInfo.email`}
            />
            <hr />


            {/* Additional Chargers */}

            {data?.additionalContact.length !== 0 && (
  <>
    <h2 className="mt-8 text-center font-medium text-blue-500 text-xl">Additional Contacts</h2>

    {data?.additionalContact.map((addCont, index) => (
      <div key={index}>
        <h2 className="text-lg text-center font-semibold">{`CONTACT ${index + 1}`}</h2>
        <DataView
          label="Proof Type"
          value={addCont?.proofType}
          show={editAccounting}
          tableId={data?._id}
          apiCall="editledger"
          identifier={`additionalContact[${index}].proofType`}
        />
        <hr />

        <DataView
          label="Proof Number"
          value={addCont?.proofNumber}
          show={editAccounting}
          tableId={data?._id}
          apiCall="editledger"
          identifier={`additionalContact[${index}].proofNumber`}
        />
        <hr />

        <DataView
          label="Name"
          value={addCont?.name}
          show={editAccounting}
          tableId={data?._id}
          apiCall="editledger"
          identifier={`additionalContact[${index}].name`}
        />
        <hr />

        <DataView
          label="Date of Birth"
          value={addCont?.DOB}
          show={editAccounting}
          tableId={data?._id}
          apiCall="editledger"
          identifier={`additionalContact[${index}].DOB`}
          type="date"
        />
        <hr />

        <DataView
          label="Relationship"
          value={addCont?.SDWOf}
          show={editAccounting}
          tableId={data?._id}
          apiCall="editledger"
          identifier={`additionalContact[${index}].SDWOf`}
        />
        <hr />

        <DataView
          label="Contact Number"
          value={addCont?.ContactNo}
          show={editAccounting}
          tableId={data?._id}
          apiCall="editledger"
          identifier={`additionalContact[${index}].ContactNo`}
        />
        <hr />

        <DataView
          label="Alternative Contact Number"
          value={addCont?.alternativeContactNo}
          show={editAccounting}
          tableId={data?._id}
          apiCall="editledger"
          identifier={`additionalContact[${index}].alternativeContactNo`}
        />
        <hr />

        <DataView
          label="Address"
          value={addCont?.Address}
          show={editAccounting}
          tableId={data?._id}
          apiCall="editledger"
          identifier={`additionalContact[${index}].Address`}
        />
        <hr />

        <DataView
          label="Designation"
          value={addCont?.designation}
          show={editAccounting}
          tableId={data?._id}
          apiCall="editledger"
          identifier={`additionalContact[${index}].designation`}
        />
        <hr />

        <DataView
          label="Email"
          value={addCont?.email}
          show={editAccounting}
          tableId={data?._id}
          apiCall="editledger"
          identifier={`additionalContact[${index}].email`}
        />
        <hr />
      </div>
    ))}
  </>
)}


          
            {data?.booking.length > 0 ? (
              <div className="overflow-x-auto">
    <table className="min-w-full overflow-scroll">
           
            <thead>
                <tr >
                    <th className="border py-1 px-2 bg-blue-200">Order Number</th>
                    <th className="border py-1 px-2 bg-blue-200">Date</th>
                    <th className="border py-1 px-2 bg-blue-200">Vehicle Req Date</th>
                    <th className="border py-1 px-2 bg-blue-200">Consignor Name</th>
                    <th className="border py-1 px-2 bg-blue-200">Consignor Mobile No</th>
                    <th className="border py-1 px-2 bg-blue-200">Loading Points</th>
                    <th className="border py-1 px-2 bg-blue-200">Consignee Name</th>
                    <th className="border py-1 px-2 bg-blue-200">Consignee Mobile No</th>
                    <th className="border py-1 px-2 bg-blue-200">Unloading Points</th>
                    <th className="border py-1 px-2 bg-blue-200">Way</th>
                    <th className="border py-1 px-2 bg-blue-200">Vehicle Type</th>
                    <th className="border py-1 px-2 bg-blue-200">Party Bhara</th>
                    <th className="border py-1 px-2 bg-blue-200">Payment Liability</th>
                    <th className="border py-1 px-2 bg-blue-200">Bill To</th>
                    <th className="border py-1 px-2 bg-blue-200">Payment Term</th>
                    <th className="border py-1 px-2 bg-blue-200">Advance Amount</th>
                    <th className="border py-1 px-2 bg-blue-200">Balance Amount</th>
                    <th className="border py-1 px-2 bg-blue-200">Pay Mode</th>
                    <th className="border py-1 px-2 bg-blue-200">Transaction ID</th>
                    <th className="border py-1 px-2 bg-blue-200">Remarks</th>
                    <th className="border py-1 px-2 bg-blue-200">Additional Charges</th>
                    <th className="border py-1 px-2 bg-blue-200">Total Charges</th>
                    <th className="border py-1 px-2 bg-blue-200">Status</th>
                    <th className="border py-1 px-2 bg-blue-200">Is Urgent</th>
                  
                </tr>
            </thead>
            <tbody>
                {data?.booking?.map((booking, index) => (
                    <tr key={index}>
                        <td className="border py-1 px-2" >{booking?.savedBooking?.orderNumber}</td>
                        <td className="border py-1 px-2">{formatDate(booking?.savedBooking?.date)}</td>
<td className="border py-1 px-2">{formatDate(booking?.savedBooking?.vehicleRequiredDate)}</td>

                        <td className="border py-1 px-2">{booking?.savedBooking?.consignorName}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.consignorMobileNumber}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.loadingPoints.join(', ')}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.consigneeName}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.consigneeMobileNumber}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.unloadingPoints.join(', ')}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.way}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.vehicleType}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.partyBhara}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.paymentLiability}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.billTo}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.paymentTerm}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.advanceAmount}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.balanceAmount}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.payMode}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.transactionId}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.remarks}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.additionalCharges?.enabled.toString()}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.additionalCharges?.totalCharge}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.status}</td>
                        <td className="border py-1 px-2">{booking?.savedBooking?.isUrgent.toString()}</td>
                       
                    </tr>
                ))}
            </tbody>
        </table>
</div>
            ): <h2 className="text-center mt-4 text-red-600 font-medium">No Booking with that ledger</h2>}
          </>
        )}
      </>
    </div>
  );
};

export default View;
