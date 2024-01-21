'use client'
import React, { useState } from 'react'
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



const FieldForm = ({ form, nameValue, label, type = 'text' , fileNumber = 1  }) => {
  const [fileCount, setFileCount] = useState(fileNumber);

  const onFileChange = async (event) => {
    const files = Array.from(event.target.files).slice(0, fileCount);
    const urls = await Promise.all(files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'bihar-transport');

      const response = await fetch('https://api.cloudinary.com/v1_1/dxuurzxsh/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data.secure_url;
    }));

    form.setValue(nameValue, urls);
  };

  return (
    <div>
      <FormField
        control={form.control}
        name={nameValue}
        render={({ field }) => (
          <FormItem className="flex items-center justify-center gap-4">
            <FormLabel className="text-nowrap text-sm lg:text-base">{label}:</FormLabel>
            <div className="flex flex-1 flex-col">
              <FormControl>
                {type === 'checkbox' ? (
                  <div className='h-10 flex items-center'>
                    <Checkbox {...field} checked={field.value} className='h-6 w-6' />
                  </div>
                ) : type === 'file' ? (
                  <>
                    <label className='text-[12px] -mb-1 flex text-slate-500'>
                     <pre> Select number of files to upload </pre>
                      <input type='number' min='1' value={fileCount} onChange={(e) => setFileCount(e.target.value)} />
                    </label>
                    <Input type='file' onChange={onFileChange} multiple />
                  </>
                ) : (
                  <Input type={type} {...field} />
                )}
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default FieldForm;

