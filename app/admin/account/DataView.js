"use client";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/ui/use-toast";
import React, { useContext, useState } from "react";
import { MdEdit } from "react-icons/md";
import { UserContext } from "../../context/UserContextProvider";

const DataView = ({ label, value, show, identifier, tableId ,apiCall, type = 'text'}) => {

  const { toast } = useToast();
  const { user } = useContext(UserContext);
  const [isEdit, setIsEdit] = useState(false);
  const [newValue, setNewValue] = useState(value);
  function handleChangeInput(e) {
    setNewValue(e.target.value);
  }


  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  async function handleUpdate(e) {
    e.preventDefault();

    try {
      const response = await fetch(`/api/accounting/edit/${apiCall}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId:  user._id,
          _id: tableId,
          fieldsToUpdate: {
            [identifier]: newValue,
          },
        })
      });
      console.log('response', await response.json());

      if (response.ok) {
        displayToast("Successfully Updated", "✅");
        console.log("Updated successfully!");
        setIsEdit(false);
      } else {
       const Error = await response.json();
        displayToast("Update failed", "❌" , Error.message);
        console.error('Error' ,Error);
      }
    } catch (error) {
      console.log(error);
      displayToast("Error", "❌", error.message);
    }
  }

  return (
    <div className="flex w-full border-b" >
      {/* {console.log(identifier, newValue, tableId)} */}
      <label className="my-2 flex w-full items-center justify-between   ">
        <h2 className="mr-3 text-nowrap text-lg font-semibold ">{label} :</h2>
        <div className="flex items-center gap-3">
          <div>
            {isEdit ? (
              <Input
                
                type={type}
                value={newValue}
                onChange={handleChangeInput}
              />
            ) : (
              <h2>{newValue}</h2>
            )}
          </div>
          <div>
            {show ? (
              isEdit ? (
                <button
                   onClick={handleUpdate}
                  className="rounded-md bg-blue-500 p-2 text-white"
                >
                  Update
                </button>
              ) : (
                <button onClick={() => setIsEdit(!isEdit)}>
                  <MdEdit className="h-8 fill-blue-500" />
                </button>
              )
            ) : (
              ""
            )}
          </div>
        </div>
      </label>
    </div>
  )
}

export default DataView
