'use client'
import React, { useEffect, useState } from 'react'
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
  
  const [isChecked, setIsChecked] = useState(false);


  const onFileChange = async (event) => {
    const files = Array.from(event.target.files).slice(0, fileNumber);
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

  useEffect(() => {
    // Update isChecked state when form value changes
    setIsChecked(form.watch(nameValue));
}, [form, nameValue]);

const handleCheckboxChange = (e) => {
  setIsChecked(e.target.checked); // Update isChecked state when checkbox is clicked
  form.setValue(nameValue, e.target.checked); // Update form value with checkbox state
};




  return (
    <div >
      <FormField
     
        control={form.control}
        name={nameValue}
        render={({ field }) => (
          <FormItem className="flex items-center justify-center gap-4 ">
            <FormLabel className="text-nowrap text-sm lg:text-base">{label} </FormLabel>
            <div className="flex flex-1 flex-col ">
              <FormControl>
                {type === 'checkbox' ? (
                  <div className='h-10 flex items-center'>
                    <Checkbox {...field} checked={isChecked} 
                                            onChange={handleCheckboxChange} 
                                            className='h-6 w-6'/>
                  </div>
                ) : type === 'file' ? (
                  <div >
                    <label className='text-[12px] -mb-1 flex text-slate-500'>
                     <p> Select number of files to upload  {fileNumber}</p>
                    
                    </label>
                    <Input  type='file' onChange={onFileChange} multiple />
                  </div>
                ) : (
                  <Input type={type} {...field} placeholder={`Enter value of ${label}`} />
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

