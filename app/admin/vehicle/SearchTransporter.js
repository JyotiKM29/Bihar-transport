import React, { useContext, useEffect, useState } from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { UserContext } from "../../context/UserContextProvider";
import Modal from "../../components/ui/Modal"; // Assume Modal is a component you have for showing popups

const SearchTransporter = ({ form, field, personName }) => {
  const { user } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  async function fetchData(value) {
    try {
      
      if (value.legth < 3) {
        console.log("length : ", value.length);
        return;
      }


      const res = await fetch(`/api/senderdata/${user._id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      // console.log("data: ", result);

      if (result && Array.isArray(result.newdata) ) {
        const results = result.newdata.filter((booking) => {
          if (booking.accountDetails.accountGroup == "Transporter") {
          
            const consignorNameToSearch = booking.basicInfo.accountName;

            return (
              value &&
              consignorNameToSearch &&
              consignorNameToSearch.toLowerCase().includes(value.toLowerCase())
            );
          }
        });

        setSearchResult(results.slice(0, 5));
        // console.log("here: ", result);
      } else {
        // console.log("Person not found");
        if (personName === "consignorName") {
          setSearchResult([{ consignorName: value }]);
        } else {
          setSearchResult([{ consigneeName: value }]);
        }
      }
    } catch (error) {
      // console.log("Fetch failed", error);
    }
  }

  function handleChange(value) {
    setInputValue(value);
    setSearchTerm(value);
    if(value.length >= 2) fetchData(value);
  }

  useEffect(() => {
    if (field.value !== inputValue) {
      setInputValue(field.value);
    }
  }, [field.value]);

  function handleResultClick(result) {
    if (!result.isActive) {
      setSelectedResult(result);
      setShowModal(true);
    } else {
      proceedWithResult(result);
    }
  }

  function proceedWithResult(result) {
    setSearchResult([]);
    setSearchTerm("");

    const {
      bankDetails,
      _id,
    } = result;
       

    const { accountName, contactNo, officeAddress, rating } = result.basicInfo;

   

    form.setValue(
      "transporterDetails.bankDetails.bankName",
      bankDetails.bankName,
    );

    form.setValue(
      "transporterDetails.bankDetails.nameOnPassbook",
      bankDetails.nameOnPassbook,
    );

    form.setValue(
      "transporterDetails.bankDetails.accountNo",
      bankDetails.accountNo,
    );

    form.setValue(
      "transporterDetails.bankDetails.ifscCode",
      bankDetails.IFSCCode,
    );

    form.setValue("transporterDetails.bankDetails.upiNo", bankDetails.upiNo);
    form.setValue("transporterDetails.bankDetails.upiType", bankDetails.upiType);
    form.setValue("transporterDetails.ifOther.transporterRating", result?.basicInfo?.taxInfo?.rating);
    form.setValue("transporterDetails.ifOther.officeAddress", officeAddress);
    form.setValue("transporterDetails.ifOther.mobileNo", contactNo);
    





    

    // if (transporterDetails.vehicleGuarantor === "Others") {
    //   transporterDetails.ifOther = {
    //     proofType: "", // Assuming this will be filled later
    //     proofNumber: "", // Assuming this will be filled later
    //     name: "", // Assuming this will be filled later
    //     dob: "", // Assuming this will be filled later
    //     sDWOf: "", // Assuming this will be filled later
    //     mobileNo: "", // Assuming this will be filled later
    //     alternateMobNo: "", // Assuming this will be filled later
    //     officeAddress: "", // Assuming this will be filled later
    //     temporaryAddress: "", // Assuming this will be filled later
    //     permanentAddress: "", // Assuming this will be filled later
    //     sameAddress: "", // Assuming this will be filled later
    //     serviceToState: "", // Assuming this will be filled later
    //     transporterRating: "", // Assuming this will be filled later
    //     typeOfVehicle: "", // Assuming this will be filled later
    //   };
    // }





    setInputValue(accountName);
    if (personName === "consignorName") {
      form.setValue("consignorMobileNumber", contactNo);
      form.setValue("consignorName", accountName);
      form.setValue("consignorAddress", officeAddress);
      form.setValue("consignorID", _id);
    } else {
      form.setValue("consigneeMobileNumber", contactNo);
      form.setValue("consigneeName", accountName);
      form.setValue("consigneeAddress", officeAddress);
    }
  }

  function handleModalContinue() {
    setShowModal(false);
    proceedWithResult(selectedResult);
  }

  function handleModalCancel() {
    setShowModal(false);
    setSelectedResult(null);
  }

  return (
    <FormItem className="flex flex-1 items-center justify-center gap-4">
      <FormLabel className="text-nowrap text-sm lg:text-base">
        {personName === "transporterName" ? "Transporter" : "Vehicle Vendor"}{" "}
        Name :
      </FormLabel>
      <div className="relative flex flex-1 flex-col">
        <FormControl>
          <Input
            placeholder="Type to search..."
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
          />
        </FormControl>
        <p className="underline" >Type Atleast 2 charector to serach</p>

        <FormMessage />

        <div className="min-h absolute top-12 z-20 w-full overflow-y-scroll rounded-sm bg-slate-100">
          {searchResult.length === 0 && searchTerm && (
            <div
              className="w-full cursor-pointer px-3 py-2 hover:bg-slate-200"
              onClick={() => {
                field.onChange(searchTerm);
                setSearchTerm("");
              }}
            >
              {searchTerm} ( not found)
            </div>
          )}
          {searchResult &&
            Array.isArray(searchResult) &&
            searchResult.length > 0 &&
            searchResult.map((result, id) => (
              <div
                key={id}
                className="w-full cursor-pointer px-3 py-2 hover:bg-slate-200"
                onClick={() => handleResultClick(result)}
              >
                {result.basicInfo.accountName} , {result.basicInfo.contactNo} ,{" "}
                {result.basicInfo.officeAddress},{" "}
                {result.isActive ? "Active" : "Inactive"}
              </div>
            ))}
        </div>
      </div>

      {showModal && (
        <Modal
          title="User Not Active"
          onConfirm={handleModalContinue}
          onCancel={handleModalCancel}
        >
          <p>This user is not active. Do you want to proceed?</p>
        </Modal>
      )}
    </FormItem>
  );
};

export default SearchTransporter;
