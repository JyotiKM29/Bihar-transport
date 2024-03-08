"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";

const SearchVOD = ({ form, field, label  }) => {
  const { user } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  async function fetchData(value) {
    try {
      const res = await fetch(`/api/vehicledata/${user._id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      console.log("result fetched:", result);

      if (result && Array.isArray(result.data)) {
        const results = result.data.filter((item) => {
          const searchTermLowerCase = value.toLowerCase();
          return (
              // Check if the vehicleNo, owner name, or driver name includes the search term
              (item.vehicleNo && item.vehicleNo.toLowerCase().includes(searchTermLowerCase)) ||
              (item.owner && item.owner.name && item.owner.name.toLowerCase().includes(searchTermLowerCase)) ||
              (item.driver && item.driver.name && item.driver.name.toLowerCase().includes(searchTermLowerCase))
          );
      });
      console.log("Filter data:", results);

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

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  return (
    <FormItem className="flex flex-1 items-center justify-center gap-4">
      <FormLabel className="text-nowrap text-sm lg:text-base">
        {label} :
      </FormLabel>
      <div className="relative flex flex-1 flex-col">
        <FormControl>
          <Input
            placeholder="Type to search..."
            // value={field.value || searchTerm}
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
                // setEdit(true);
              }}
            >
              {searchTerm}  ( not found)
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

                    if(result?.vehicleNo){
                        setInputValue(result?.vehicleNo)
                 
                  form.setValue('vehicleNo', result?.vehicleNo);
                
                  
                  setSearchResult([]);
                  setSearchTerm("");
                    }else{

                        displayToast("Can't set ledger ", "❌" ,'ledger not found')
                    }
                   
                }}
              >
            
                {result?.owner?.name}(owner),&nbsp;&nbsp;&nbsp;  
                {result?.driver?.name}(driver),&nbsp;&nbsp;&nbsp; 
                {result?.vehicleNo}(vehicle No)
              </div>
            ))}
        </div>
      </div>
    </FormItem>
  );
};

export default SearchVOD;
