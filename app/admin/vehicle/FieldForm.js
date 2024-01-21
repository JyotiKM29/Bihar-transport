import React from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "../../components/ui/form";

import { Input } from "../../components/ui/input";

import { Checkbox } from "../../components/ui/checkbox";

const FieldForm = ({ form , nameValue ,label , type='text'}) => {
  return (
    <div>
      <FormField
                control={form.control}
                name={nameValue}
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4  ">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                       {label}:
                      </FormLabel>
                      <div className="flex flex-1 flex-col ">
                        <FormControl >
                        {type === 'checkbox' ? (
                            <div className='h-10 flex items-center '>

    <Checkbox   {...field}  className='h-6 w-6' />
                            </div>
  ) : (
    <Input type={type} {...field} />
  )}
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
    </div>
  )
}

export default FieldForm
