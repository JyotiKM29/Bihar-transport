import React, { useContext, useEffect, useState } from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { UserContext } from "../../context/UserContextProvider";

const SearchInput = ({ form, field, personName }) => {
  const { user } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [inputValue, setInputValue] = useState("");


  async function fetchData(value) {
    try {
      const res = await fetch(`/api/senderdata/${user._id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      

      if (result && Array.isArray(result.newdata)) {
        const results = result.newdata.filter((booking) => {
          const consignorNameToSearch =
            booking.type === "personal"
              ? booking.personal?.consignorName
              : booking.company?.consignorName;

          return (
            value &&
            consignorNameToSearch &&
            consignorNameToSearch.toLowerCase().includes(value.toLowerCase())
          );
        });

        setSearchResult(results.slice(0, 5));
      } else {
        console.log("Person not found");
        if (personName === "consignorName") {
          setSearchResult([{ consignorName: value }]);
        } else {
          setSearchResult([{ consigneeName: value }]);
        }
      }
    } catch (error) {
      console.log("Fetch failed", error);
    }
  }


  function handleChange(value) {
    setInputValue(value);
    setSearchTerm(value);
    fetchData(value);
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
                onClick={() => {
                  
                  setSearchResult([]);
                  setSearchTerm("");
                  if (personName === "consignorName") {
                    if (result?.type === "company") {
                      setInputValue(result?.company?.consignorName);
                      form.setValue(
                        "consignorMobileNumber",
                        result?.company?.officeNo,
                      );
                      form.setValue(
                        "consignorName",
                        result?.company?.consignorName,
                      );
                    } else if (result?.type === "personal") {
                      setInputValue(result.personal.consignorName);
                      form.setValue(
                        "consignorMobileNumber",
                        result.personal.contactNo,
                      );
                      form.setValue(
                        "consignorName",
                        result.personal.consignorName,
                      );
                    }
                  } else {
                    if (result?.type === "company") {
                      setInputValue(result?.company?.consignorName);
                      form.setValue(
                        "consigneeMobileNumber",
                        result?.company?.officeNo,
                      );
                      form.setValue(
                        "consigneeName",
                        result?.company?.consignorName,
                      );
                    } else if (result?.type === "personal") {
                      setInputValue(result.personal.consignorName);
                      form.setValue(
                        "consigneeMobileNumber",
                        result.personal.contactNo,
                      );
                      form.setValue(
                        "consigneeName",
                        result.personal.consignorName,
                      );
                    }
                   
                  }
                }}
              >
                {result?.type === "company" && result?.company.consignorName}
                {result?.type === "personal" && result?.personal.consignorName}
              </div>
            ))}
        </div>
      </div>
    </FormItem>
  );
};

export default SearchInput;
