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

const SearchVehicle = ({ form, field, label }) => {
  const { user } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [inputValue , setInputValue] = useState("");

  async function fetchData(value) {
    try {
      const res = await fetch(`/api/vehicledata/${user._id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      //   console.log('result my love',result);

      if (result && Array.isArray(result.data)) {
        const results = result.data.filter((vehicle) => {
          return (
            value &&
            vehicle.vehicleNo &&
            vehicle.vehicleNo.toLowerCase().includes(value.toLowerCase())
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

  useEffect(() => {
    // Log the updated searchResult state
    console.log("Result:", searchResult);
  }, [searchResult]);

  function handleChange(value) {
    setSearchTerm(value);
    setInputValue(value);
    fetchData(value);
  }

  return (
    <FormItem className="flex flex-1 items-center justify-center gap-4">
      <FormLabel className="text-nowrap text-sm lg:text-base">
        {label} :
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
                // setEdit(true);
              }}
            >
              {searchTerm}
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
                  form.setValue("vehicleNo", result?.vehicleNo);

                  setInputValue(result?.vehicleNo)
                  form.setValue("vehicleType",result?.vehicleType)
                  form.setValue("DriverDetails.driverName",result?.driver?.name)
                  form.setValue("DriverDetails.driverMobNo",result?.driver?.phone)

                  const availableWgt = result?.maxCapacity * 100 - result?.filledWeight;
                  form.setValue("materialDetails.availableWgt",availableWgt)

                  if(result?.payment){
                    const pay =result?.payment;
                    const value =pay.reduce((total, payment) => total + payment.recieveAmount, 0) || 0;

                    console.log("Total avalaible capcity" ,value);
                    form.setValue("materialDetails.ledgerBalance",value);
                  }

                  



                  // form.setValue(
                  //   "transporterDetails.personName",
                  //   result?.transporterDetails[0]?.ifOther?.name,
                  // );
                  // form.setValue(
                  //   "transporterDetails.transporterMobNo",
                  //   result?.transporterDetails[0]?.ifOther?.mobileNo,
                  // );
              

                  setSearchResult([]);
                  setSearchTerm("");
                 
                }}
              >
                {result.vehicleNo}
              </div>
            ))}
        </div>
      </div>
    </FormItem>
  );
};

export default SearchVehicle;
