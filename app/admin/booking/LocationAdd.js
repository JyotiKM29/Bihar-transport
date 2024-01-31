'use client'
import React, { useContext, useState } from 'react'
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
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useContext(UserContext);
  
    function addLocation(value) {
      form.setValue("adminId", user._id);
      setLocations((prev) => {
        const newLocations = [...prev, value];
        form.setValue(nameValue, newLocations);
        console.log(newLocations);
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
      try {
        const token = "673c3b0b-466c-40a6-b8f3-ec4fd640aa8c";
        console.log("value here", value);
        const res = await fetch(`https://atlas.mapmyindia.com/api/places/textsearch/json?query=${value}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res);
        if (!res.ok) {
          console.log(res.message);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const result = await res.json();
        console.log(result);
  
      } catch (error) {
        console.log(error);
      }
    }
  
    function handleChange(inputValue) { // Accept inputValue as a parameter
      setSearchTerm(inputValue); // Update searchTerm
      fetchLocation(inputValue);
    }
  
    return (
      <FormItem className="min-w flex items-center justify-center gap-4 ">
        <FormLabel className="text-nowrap text-sm lg:text-base">
          {label} :
        </FormLabel>
        <div className="flex w-full  flex-col">
          <div
            id="box"
            className=" 
              flex
              items-center gap-1   overflow-x-scroll rounded-md border  border-input px-3 py-0 text-sm  ring-offset-background active:outline-none  active:ring-2 
              active:ring-offset-1
            "
          >
            {Locations.map((location, i) => (
              <span
                key={i}
                className="flex h-8 items-center gap-1 rounded-lg  bg-blue-50 px-3 "
              >
                <pre>{location}</pre>
  
                <button
                  className="min-w bg-grey-100 h-full  rounded-full"
                  onClick={() => deleteLocation(i)}
                >
                  <GrClose />
                </button>
              </span>
            ))}
            <FormControl>
              <Input
                type="text"
                value={field.value}
                {...field}
                className="
                  h-8 border-none outline-none
                  ring-offset-white 
                  focus-visible:ring-0
                "
                // onChange={(e) => handleChange(e.target.value)}  
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
  
                    let inputValue = e.target.value.trim();
  
                    if (inputValue !== "") {
                      addLocation(inputValue);
                      form.setValue(nameValue, "");
                    }
                    e.target.value = "";
                  }
                }}
              />
            </FormControl>
          </div>
  
          <FormMessage />
        </div>
      </FormItem>
    );
  };
  
  export default LocationAdd;
  