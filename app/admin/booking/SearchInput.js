import React, { useContext, useState } from "react";
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

  async function fetchData(value) {
    try {
      const res = await fetch(`/api/getbooking/${user._id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      console.log(result);

      if (result && Array.isArray(result.data)) {
        const results = result.data.filter((booking) => {
          const nameToSearch = booking[personName];
          return (
            value &&
            nameToSearch &&
            nameToSearch.toLowerCase().includes(value.toLowerCase())
          );
        });
        setSearchResult(results);
      } else {
        console.log("Person not found");
      }
    } catch (error) {
      console.log("Fetch failed", error);
    }
  }

  function handleChange(value) {
    setSearchTerm(value);
    fetchData(value);
  }

  return (
    <FormItem className="flex items-center justify-center gap-4">
      <FormLabel className="text-nowrap text-sm lg:text-base">
        {personName === "consignorName" ? "Consignor" : "Consignee"} Name :
      </FormLabel>
      <div className="relative flex flex-1 flex-col">
        <FormControl>
          <Input
            placeholder="Type to search..."
            value={field.value || searchTerm}
            onChange={(e) => handleChange(e.target.value)}
          />
        </FormControl>

        <FormMessage />

        <div className="min-h absolute top-12 w-full overflow-y-scroll rounded-sm bg-slate-100">
          {searchResult &&
            Array.isArray(searchResult) &&
            searchResult.length > 0 &&
            searchResult.map((result, id) => (
              <div
                key={id}
                className="w-full cursor-pointer px-3 py-2 hover:bg-slate-200"
                onClick={() => {
                  field.onChange(result[personName]);
                  setSearchResult([]);
                  if (personName === "consignorName") {
                    form.setValue(
                      "consignorMobileNumber",
                      result.consignorMobileNumber
                    );
                   // form.setValue("loadingPoints", result.loadingPoints);
                  } else {
                    form.setValue(
                      "consigneeMobileNumber",
                      result.consigneeMobileNumber
                    );
                   // form.setValue("unloadingPoints", result.unloadingPoints);
                  }
                }}
              >
                {result[personName]}
              </div>
            ))}
        </div>
      </div>
    </FormItem>
  );
};

export default SearchInput;
