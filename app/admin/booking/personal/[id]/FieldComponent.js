"use client";
import { Input } from "../../../../components/ui/input";

import React, { useState } from "react";
import { MdEdit } from "react-icons/md";

const FieldComponent = ({ label, value }) => {
  const [isEdit, setIsEdit] = useState(false);
  return (
    <div className="flex ">
      <label className="my-2 flex items-center justify-center gap-3">
        <h2 className="mr-3 text-nowrap text-lg font-semibold ">{label}</h2>
        {isEdit ? <Input type="text" /> : <h2>{value}</h2>}

       
          {isEdit ? (
            <button onClick={() => setIsEdit(!isEdit)} className="rounded-md bg-blue-500 p-2 text-white">Update</button>
          ) : (
            <button onClick={() => setIsEdit(!isEdit)} >

            <MdEdit  className="fill-blue-500 h-8"/>
            </button>
          )}
       
      </label>
    </div>
  );
};

export default FieldComponent;
