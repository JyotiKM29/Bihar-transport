"use client";
import { Input } from "../../../../components/ui/input";
import { useToast } from "../../../../components/ui/use-toast";
import React, { useContext, useState } from "react";
import { MdEdit } from "react-icons/md";
import { UserContext } from "../../../../context/UserContextProvider";
import Image from "next/image";

const FieldComponent = ({ label, value, show, identifier, tableId , type = 'text'}) => {
  const { toast } = useToast();
  const { user } = useContext(UserContext);
  const [isEdit, setIsEdit] = useState(false);
  const [newValue, setNewValue] = useState(value);
  function handleChangeInput(e) {
    setNewValue(e.target.value);
  }
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    const newValues = [...value];
    newValues[index] = fileUrl;
    setNewValue(newValues);
  };

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
      const response = await fetch("api/vehicleupdation", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: user._id,
          _id: tableId,
          fieldsToUpdate: {
            [identifier]: newValue,
          },
        })
      });
      // console.log(await response.json());

      if (response.ok) {
        displayToast("Successfully Updated", "✅");
        console.log("Booking updated successfully!");
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
    <div className="flex w-full border-b">
      <label className="my-2 flex w-full items-center justify-between">
        <h2 className="mr-3 text-nowrap text-lg font-semibold">{label}:</h2>
        <div className={`flex items-center gap-3 ${type === 'file' ? 'flex-col' : ''}`}>
          {type === 'file' && value ? (
            <div className="flex gap-4">
              {value.map((url, index) => (
                <div key={index}>
                  {isEdit ? (
                    <div>
                      <Input type="file" onChange={(e) => handleFileChange(e, index)} />
                    </div>
                  ) : (
                    <>
                      <Image src={url} height={20} width={20} className='h-20 w-20' alt='img' />
                      <a href={url} download>
                        <button>Download</button>
                      </a>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
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
              {show && (
                <div>
                  {isEdit && type !== 'file' ? ( // Conditionally render file input only when isEdit is true
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
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </label>
    </div>
  );
};

export default FieldComponent;
