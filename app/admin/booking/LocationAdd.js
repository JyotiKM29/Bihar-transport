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
    const [inputValue, setInputValue] = useState('');
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
      console.log(user._id);
      try {
       
        console.log("value here", value);


        const response = await fetch(`/api/map/${user._id}/${value}`);
        console.log('response :',response);


        const result = await response.json();
        console.log('Result',result);
      
        if (!response.ok) {
          // console.log("error at: ",result.message);
          throw new Error(`HTTP error! status: ${res.status}`);
          
        }
  
      } catch (error) {
        console.log(error.message);
      }
    }

    function handleChange(e) {
      setInputValue(e.target.value);
      fetchLocation(e.target.value);
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
    //             onChange={(e) => {
    //   handleChange(e.target.value);
    // }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                   
                    let inputValue = e.target.value.trim();
  
                    if (inputValue !== "") {
                      // fetchLocation(inputValue);
                      addLocation(inputValue);
                      form.setValue(nameValue, "");
                      e.target.value = "";
                    }
                   
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
  