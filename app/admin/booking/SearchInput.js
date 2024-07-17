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

const SearchInput = ({ form, field, personName }) => {
  const { user } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  async function fetchData(value) {
    try {
      const res = await fetch(`/api/senderdata/${user._id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      // console.log("data: ", result);

      if (result && Array.isArray(result.newdata)) {
        const results = result.newdata.filter((booking) => {
          const consignorNameToSearch = booking.basicInfo.accountName;

          return (
            value &&
            consignorNameToSearch &&
            consignorNameToSearch.toLowerCase().includes(value.toLowerCase())
          );
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
    fetchData(value);
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

    if (personName === "consignorName") {
      setInputValue(result.basicInfo.accountName);
      form.setValue("consignorMobileNumber", result.basicInfo.contactNo);
      form.setValue("consignorName", result.basicInfo.accountName);
      form.setValue("consignorAddress", result.basicInfo.officeAddress);
      form.setValue("consignorID", result._id);
    } else {
      setInputValue(result.basicInfo.accountName);
      form.setValue("consigneeMobileNumber", result.basicInfo.contactNo);
      form.setValue("consigneeName", result.basicInfo.accountName);
      form.setValue("consigneeAddress", result.basicInfo.officeAddress);
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
        {personName === "consignorName" ? "Consignor" : "Consignee"} Name :
      </FormLabel>
      <div className="relative flex flex-1 flex-col">
        <FormControl>
          <Input
            placeholder="Type to search..."
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
          />
        </FormControl>

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
                {result.isActive? "Active" : "Inactive"}
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

export default SearchInput;
