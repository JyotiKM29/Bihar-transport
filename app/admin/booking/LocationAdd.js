"use client";
import React, { useContext, useState } from "react";
import { GrClose } from "react-icons/gr";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { UserContext } from "../../context/UserContextProvider";
import { Input } from "../../components/ui/input";

const LocationAdd = ({ form, field, label, nameValue }) => {
  const [Locations, setLocations] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { user } = useContext(UserContext);

  function addLocation(value) {
    form.setValue("adminId", user._id);
    setLocations((prev) => {
      const newLocations = [...prev, value];
      form.setValue(nameValue, newLocations);
      return newLocations;
    });
  }

  function deleteLocation(index) {
    setLocations((prevLocations) => {
      const newLocations = prevLocations.filter((_, i) => i !== index);
      form.setValue(nameValue, newLocations);
      return newLocations;
    });
  }

  async function fetchLocation(value) {
    if (value.length > 3) {
      try {
        const response = await fetch(`/api/map/${user._id}/${value}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const suggestedLocations = result.result.suggestedLocations;

        if (result && Array.isArray(suggestedLocations)) {
          const results = suggestedLocations.filter((location) => {
            const lowerCaseValue = value.toLowerCase();
            const lowerCasePlaceName = location.placeName.toLowerCase();
            const lowerCasePlaceAddress = location.placeAddress.toLowerCase();
            return (
              lowerCasePlaceName.includes(lowerCaseValue) ||
              lowerCasePlaceAddress.includes(lowerCaseValue)
            );
          });

          setSearchResult(results.slice(0, 5));
        } else {
          setSearchResult([{ placeAddress: value }]);
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      setSearchResult([]);
    }
  }

  function handleChange(e) {
    e.preventDefault();
    const value = e.target.value;
    form.setValue(field.name, value);
    setSearchTerm(value);
    setInputValue(value);
    fetchLocation(value);
  }

  return (
    <div className="relative">
      <FormItem className="min-w flex items-center justify-center gap-4">
        <FormLabel className="self-start pt-6 text-nowrap text-sm lg:text-base">
          {label} :
        </FormLabel>
        <div className="flex w-full flex-col">
          <FormControl>
            <Input
              type="text"
              value={inputValue}
              {...field}
              className="text-wrap"
              onChange={handleChange}
            />
          </FormControl>
          <FormMessage />
          <div className="min-h z-20 absolute top-16 max-w-full overflow-y-scroll rounded-sm bg-slate-100">
            {searchResult &&
              Array.isArray(searchResult) &&
              searchResult.length > 0 &&
              searchResult.map((result, id) => {
                const locationString =
                  result.placeName && result.placeAddress
                    ? `${result.placeName}, ${result.placeAddress}`
                    : result.placeAddress || result.placeName;
                return (
                  <div
                    key={id}
                    className="border w-full cursor-pointer px-3 py-2 hover:bg-slate-200"
                    onClick={() => {
                      addLocation(locationString);
                      setSearchResult([]);
                      setSearchTerm("");
                      setInputValue("");
                    }}
                  >
                    <p>
                      {result.placeName}, {result.placeAddress}
                    </p>
                  </div>
                );
              })}
          </div>
          {Locations.length > 0 && (
            <div
              id="box"
              className="flex flex-col min-h-14 items-center gap-1 overflow-x-scroll rounded-md border border-input px-3 py-0 text-sm ring-offset-background active:outline-none active:ring-2 active:ring-offset-1 pt-1"
            >
              {Locations.map((location, i) => (
                <span
                  key={i}
                  className="self-start flex min-h-8 py-1 items-center gap-1 rounded-lg bg-blue-50 px-3 justify-between"
                >
                  <pre className="text-wrap">{location}</pre>
                  <button
                    className="min-w bg-grey-100 h-full ml-4 rounded-full"
                    onClick={() => deleteLocation(i)}
                  >
                    <GrClose />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </FormItem>
    </div>
  );
};

export default LocationAdd;
