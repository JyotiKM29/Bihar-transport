"use client";
import React, { useState } from "react";
import {
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormField,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";

const FieldForm = ({ form, name, label, type, options }) => {
  return (
    <div>

   
    <FormField
      control={form?.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="flex items-center justify-center gap-4">
            <FormLabel className="text-nowrap text-sm lg:text-base">
              {label}
            </FormLabel>
            <div className="flex flex-1 flex-col">
              <FormControl>
                <Input value={field?.value} type={type} placeholder={`Enter value of ${label}`} {...field} />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        );
      }}
    />
     </div>
  );
};

export default FieldForm;
