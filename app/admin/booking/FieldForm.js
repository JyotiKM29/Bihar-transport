'use client'
import React, { useState } from "react";
import {
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,

 
  FormField,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";


const FieldForm = ({
  form,
  name,
  label,
  type,
  options,
  addLocation,
  deleteLocation,
}) => {
  const [Locations, setLocations] = useState([]);
  const { control } = useForm();
  return (
    <div>
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="flex items-center justify-center gap-4">
            <FormLabel className="text-nowrap text-sm lg:text-base">
              {label}:
            </FormLabel>
            <div className="flex flex-1 flex-col">
              <FormControl>
                {type === "select" ? (
                  <select
                    {...field}
                    className="h-10 rounded-md border bg-slate-50"
                  >
                    {options.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : type === "location" ? 
                (
                    <div className="flex w-full flex-col">
                     
                      {Locations.map((location, i) => (
                        <span
                          key={i}
                          className="flex h-8 items-center gap-1 rounded-lg bg-blue-50 px-3"
                          style={{
                            maxWidth: "100px",
                          }}
                        >
                          <pre>{location}</pre>
                          <Button
                            variant="ghost"
                            onClick={() => deleteLocation(i)}
                            className="min-w bg-grey-100 h-full rounded-full"
                          >
                            Remove
                          </Button>
                        </span>
                      ))}
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          className="h-8 border-none outline-none ring-offset-white focus-visible:ring-0"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const inputValue = e.target.value.trim();
                              if (inputValue !== "") {
                                addLocation(inputValue);
                              }
                              e.target.value = "";
                            }
                          }}
                        />
                      </FormControl>
                    </div>
                  ) : (
                  <Input type={type} {...field} />
                )}
              </FormControl>
            </div>
          </FormItem>
        );
      }}
    />
    </div>
  );
};

export default FieldForm;
