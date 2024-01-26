"use client";
import { useRouter } from "next/navigation";
import { MdEdit } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import React, { useContext, useEffect, useState } from "react";
import FieldComponent from "./FieldComponent";
import { Button } from "../../../../components/ui/button";
import { useToast } from "../../../../components/ui/use-toast";
import { UserContext } from "../../../../context/UserContextProvider";

const VechicleDetail = ({ params }) => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editvehicle, setEditVehicle] = useState(false);
  const { toast } = useToast();

  const adminId = user?._id;
  const _id = params.id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/vehicledetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id, adminId }),
        });
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setLoading(false);
        setVehicleDetails(data);
        console.log(data);
        displayToast("Fetch vehicle Detail Succesfully ", "✅");

        console.log("data", data);
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
        displayToast("Error in Fetching Data", "❌", error.message);
      }
    };
    fetchData();
  },  [adminId, _id ]);

  const handleGoBack = () => {
    router.back();
  };

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  function DateString(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  

  return (
    <div className="min-h-[90vh] w-full rounded-2xl bg-white px-6 py-4 shadow-sm ">
      <div className="flex items-center justify-between">
        <h1 className="mb-6 text-4xl">Vehicle Complete Details: </h1>
        <div className="flex items-center justify-between space-x-2">
          <Button className="space-x-2 px-4" onClick={handleGoBack}>
            <IoIosArrowBack className=" fill-white" />
            <pre className="text-base">Back</pre>
          </Button>
          <Button
            onClick={() => setEditVehicle(!editvehicle)}
            className="space-x-2 px-4"
          >
            <pre className="text-base">Edit</pre>
            <MdEdit className="h-8 fill-white" />
          </Button>
        </div>
      </div>
      {loading ? (
        <p>Loading.....</p>
      ) : (
        <>
          {/* Vehicle Details */}
          <div className="grid grid-cols-1 gap-y-1 gap-x-6 2xl:gap-x-8 lg:grid-cols-2 ">
          <h2 className="col-span-full text-2xl text-center font-bold mb-6 mt-3">Vehicle Details </h2>
            <FieldComponent
              label={"Vehicle No"}
              value={vehicleDetails?.newVehicle?.vehicleNo}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="vehicleNo"
              type="number"
            />
            <FieldComponent
              label={"Registration Authority"}
              value={vehicleDetails?.newVehicle?.registrationAuthority}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="registrationAuthority"
            />
            <FieldComponent
              label={"Fuel Name"}
              value={vehicleDetails?.newVehicle?.fuelName}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="fuelName"
            />
           
            {/* Continue Vehicle Details */}
            <FieldComponent
              label={"Vehicle Age"}
              value={vehicleDetails?.newVehicle?.vehicleAge}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="vehicleAge"
              type="number"
            />
            <FieldComponent
              label={"Vehicle Type"}
              value={vehicleDetails?.newVehicle?.vehicleType}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="vehicleType"
            />
            <FieldComponent
              label={"Vehicle Class"}
              value={vehicleDetails?.newVehicle?.vehicleClass}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="vehicleClass"
            />
            <FieldComponent
              label={"Vehicle Length"}
              value={vehicleDetails?.newVehicle?.vehicleLength}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="vehicleLength"
            />
            <FieldComponent
              label={"Passing Capacity"}
              value={vehicleDetails?.newVehicle?.passingCapacity}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="passingCapacity"
            />
            <FieldComponent
              label={"Max Capacity"}
              value={vehicleDetails?.newVehicle?.maxCapacity}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="maxCapacity"
            />
            <FieldComponent
              label={"Chassis No"}
              value={vehicleDetails?.newVehicle?.chassisNo}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="chassisNo"
            />
            <FieldComponent
              label={"Engine No"}
              value={vehicleDetails?.newVehicle?.EngineNo}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="EngineNo"
            />
            <FieldComponent
              label={"Fitness Valid Up To"}
              value={DateString(vehicleDetails?.newVehicle?.fitnessValidUpTo)}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="fitnessValidUpTo"
              type="date"
            />
            <FieldComponent
              label={"Tax Paid Up To"}
              value={DateString(vehicleDetails?.newVehicle?.taxPaidUpTo)}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="taxPaidUpTo"
              type="date"
            />
            <FieldComponent
              label={"Insurance Valid Up To"}
              value={DateString(vehicleDetails?.newVehicle?.insurenceValidUpTo)}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="insurenceValidUpTo"
              type="date"
            />
            <FieldComponent
              label={"Permit Valid Up To"}
              value={DateString(vehicleDetails?.newVehicle?.permitValidUpTo)}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="permitValidUpTo"
              type="date"
            />
            <FieldComponent
              label={"National Permit"}
              value={vehicleDetails?.newVehicle?.nationalPermit}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="nationalPermit"
              type="checkbox"
            />
            <FieldComponent
              label={"National Permit Valid Up To"}
              value={DateString(vehicleDetails?.newVehicle?.nationalPermitValidUpTo)}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="nationalPermitValidUpTo"
              type="date"
            />
            
            <FieldComponent
              label={"Remark"}
              value={vehicleDetails?.newVehicle?.Remark}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="Remark"
            />
            <FieldComponent
  label={"RC Photo"}
  value={vehicleDetails?.newVehicle?.rcPhoto}
  show={editvehicle}
  tableId={vehicleDetails?.newVehicle?._id}
  identifier="rcPhoto"
  type="file"
/>
            
            {/* <FieldComponent
              label={"RC Photo"}
              value={vehicleDetails?.newVehicle?.rcPhoto}
              show={editvehicle}
              tableId={vehicleDetails?.newVehicle?._id}
              identifier="rcPhoto"
              type="file"
            /> */}
          </div>

          {/* Owner Details */}
          <div className="mt-8">
             <h2 className="col-span-full text-2xl text-center font-bold mb-6 mt-3">Owner Details</h2>
            <div className="grid grid-cols-1 gap-y-1 gap-x-6 2xl:gap-x-8 lg:grid-cols-2 ">
              <FieldComponent
                label={"Proof Type"}
                value={vehicleDetails?.newVehicle?.owner?.proofType}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="ownerProofType"
              />
              <FieldComponent
                label={"Proof Number"}
                value={vehicleDetails?.newVehicle?.owner?.proofNumber}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="ownerProofNumber"
              />
              <FieldComponent
                label={"Name"}
                value={vehicleDetails?.newVehicle?.owner?.name}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="ownerName"
              />
              <FieldComponent
                label={"Date of Birth"}
                value={DateString(vehicleDetails?.newVehicle?.owner?.DOB)}
                show={editvehicle}
                tableId={DateString(vehicleDetails?.vehicle?._id)}
                identifier="ownerDOB"
                type="date" // Assuming this should be a date input
              />
              <FieldComponent
                label={"Phone"}
                value={vehicleDetails?.newVehicle?.owner?.phone}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="ownerPhone"
                type="tel" // Assuming this should be a telephone input
              />
              <FieldComponent
                label={"Second Phone"}
                value={vehicleDetails?.newVehicle?.owner?.secondPhone}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="ownerSecondPhone"
                type="tel" // Assuming this should be a telephone input
              />
              <FieldComponent
                label={"Address"}
                value={vehicleDetails?.newVehicle?.owner?.address}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="ownerAddress"
              />
              <FieldComponent
                label={"Rating"}
                value={vehicleDetails?.newVehicle?.owner?.rating}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="ownerRating"
                type="number" // Assuming this should be a number input
              />
              <FieldComponent
                label={"With Phone Status"}
                value={vehicleDetails?.newVehicle?.owner?.withPhone}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="ownerWithPhone"
                type="checkbox" // Assuming this should be a checkbox input
              />
              <FieldComponent
                label={"Bank Details"}
                value={vehicleDetails?.newVehicle?.owner?.bank?.upiNo}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="ownerBank"
              />
              <FieldComponent
                label={"Bank Details"}
                value={vehicleDetails?.newVehicle?.owner?.bank?.name}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="ownerBank"
              />
              <FieldComponent
                label={"Bank Details"}
                value={vehicleDetails?.newVehicle?.owner?.bank?.accNo}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="ownerBank"
              />
              <FieldComponent
                label={"Bank Details"}
                value={vehicleDetails?.newVehicle?.owner?.bank?.ifscCode}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="ownerBank"
              />
              <FieldComponent
                label={"Bank Details"}
                value={vehicleDetails?.newVehicle?.owner?.bank?.proof}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="ownerBank"
              />
              <FieldComponent
                label={"Remarks"}
                value={vehicleDetails?.newVehicle?.owner?.remarks}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="ownerRemarks"
              />
            </div>
          </div>

          {/* Driver Details */}
          <div className="mt-8">
             <h2 className="col-span-full text-2xl text-center font-bold mb-6 mt-3">
            Driver Details</h2>
            <div className="grid grid-cols-1 gap-y-1 gap-x-6 2xl:gap-x-8 lg:grid-cols-2 ">
              <FieldComponent
                label={"License No"}
                value={vehicleDetails?.newVehicle?.driver?.licenseNo}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="driverLicenseNo"
              />
              <FieldComponent
                label={"Name"}
                value={vehicleDetails?.newVehicle?.driver?.name}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="driverName"
              />
              <FieldComponent
                label={"Issue Date"}
                value={DateString(vehicleDetails?.newVehicle?.driver?.issueDate)}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="driverIssueDate"
                type="date"
              />
              <FieldComponent
                label={"Licence Validity"}
                value={DateString(vehicleDetails?.newVehicle?.driver?.licenceValidity)}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="driverLicenceValidity"
                type="date"
              />
              <FieldComponent
                label={"Date of Birth"}
                value={DateString(vehicleDetails?.newVehicle?.driver?.DOB)}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="driverDOB"
                type="date"
              />
              <FieldComponent
                label={"Vehicle Class"}
                value={vehicleDetails?.newVehicle?.driver?.vehicleClass}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="driverVehicleClass"
              />
              <FieldComponent
                label={"Licence Authority"}
                value={vehicleDetails?.newVehicle?.driver?.licenceAuthority}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="driverLicenceAuthority"
              />
              <FieldComponent
                label={"Address"}
                value={vehicleDetails?.newVehicle?.driver?.address}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="driverAddress"
              />
              <FieldComponent
                label={"Phone"}
                value={vehicleDetails?.newVehicle?.driver?.phone}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="driverPhone"
              />
              <FieldComponent
                label={"Alternate Phone"}
                value={vehicleDetails?.newVehicle?.driver?.altPhone}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="driverAltPhone"
              />
              <FieldComponent
                label={"Rating"}
                value={vehicleDetails?.newVehicle?.driver?.rating}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="driverRating"
                type="number" // Assuming this should be a number input
              />
              <FieldComponent
                label={"Smartphone Status"}
                value={vehicleDetails?.newVehicle?.driver?.smartPhone}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="driverSmartPhone"
                type="checkbox" // Assuming this should be a checkbox input
              />
              <FieldComponent
                label={"Owner Status"}
                value={vehicleDetails?.newVehicle?.driver?.owner}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="driverOwner"
                type="checkbox" // Assuming this should be a checkbox input
              />
              {/* <FieldComponent
                label={"Proof"}
                value={vehicleDetails?.newVehicle?.driver?.proof}
                show={editvehicle}
                tableId={vehicleDetails?.newVehicle?._id}
                identifier="driverProof"
                type="file"
              /> */}

              <FieldComponent
  label={"Proof"}
  value={vehicleDetails?.newVehicle?.driver?.proof}
  show={editvehicle}
  tableId={vehicleDetails?.newVehicle?._id}
  identifier="driverProof"
  type="file"
/>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VechicleDetail;


// upiNo, name, accNo, ifscCode, proof, _id, createdAt, updatedAt}