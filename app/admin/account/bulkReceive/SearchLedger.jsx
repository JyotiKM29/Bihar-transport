"use client";
import React, { useContext,  useState } from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";

const SearchLedger = ({ form, field, label ,setBooking, booking }) => {
  const { user } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();
  let bookingData =[];
  const [newBooking , setNewBooking] = useState([]);

  for (let i = 0; i < booking?.length; i++) {
    // console.log("booking new", booking);
    const id = booking[i].savedBooking?._id;

    if (id) {
      bookingData.push(id);

    }
    // console.log("Final bookingData array:", bookingData);
}




  async function fetchData(value) {
    try {
      const res = await fetch(`/api/accounting/getledger/${user._id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      // console.log("result my love", result);

      if (result && Array.isArray(result.data)) {
        const results = result.data.filter((item) => {
            return (
                value &&
                item.basicInfo &&
                item.basicInfo.accountName &&
                item.basicInfo.accountName.toLowerCase().includes(value.toLowerCase())
            );
        });
        // console.log("Filter data:", results);

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

                    if(result?.basicInfo?.accountName){
                        setInputValue(result?.basicInfo?.accountName)
                  form.setValue('receivedFrom', result?.basicInfo?.accountName);
                  form.setValue('ledgerId', result?._id);
                  const data = result?.booking
                  setBooking([...data]);
             
                  
                  setSearchResult([]);
                  setSearchTerm("");
                    }else{

                        displayToast("Can't set ledger ", "❌" ,'ledger not found')
                    }
                   
                }}
              >
                {result.basicInfo.accountName}
              </div>
            ))}
        </div>
      </div>
    </FormItem>
  );
};

export default SearchLedger;
