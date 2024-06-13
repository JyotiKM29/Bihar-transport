"use client";
import React, { useContext,  useState } from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { UserContext } from "../../../../context/UserContextProvider";
import { useToast } from "../../../../components/ui/use-toast";

const SearchVehicleType = ({ form, field, label  }) => {
  const { user } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  async function fetchData(value) {
    try {
      const res = await fetch(`/api/type/get/${user._id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      console.log("result my love", result);

      if (result && Array.isArray(result)) {
        const results = result.filter((item) => {
            return (
                value &&
                item.name &&
              
                item.name.toLowerCase().includes(value.toLowerCase())
            );
        });
        console.log("Filter data:", results);

        setSearchResult(results.slice(0, 5));
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

                   
                        setInputValue(result?.name)
                      
                        form.setValue("searchItemProduct",result?.name)
                  // form.setValue("vehicleType", result?.name);
                  // form.setValue("vehicleLength", result?.length);
                  // form.setValue("WeightCapacity", result?.weight);
                  // form.setValue("vehicleLengthUnit", result?.lengthUnit);
                  // form.setValue("WeightCapacityUnit", result?.weightUnit);
                  
                  setSearchResult([]);
                  setSearchTerm("");
                   
                   
                }}
              >
                {result.name} , {result.length}{result.lengthUnit} , {result.weight}{result.weightUnit} , {result.capacity}
              </div>
            ))}
        </div>
      </div>
    </FormItem>
  );
};

export default SearchVehicleType;
