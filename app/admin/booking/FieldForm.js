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
}) => {
 
  
  return (
  
    <FormField
      control={form.control}
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
                ) : (
                  <Input type={type} 
                  
                  {...field} />
                )}
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        );
      }}
    />
   
  );
};

export default FieldForm;
