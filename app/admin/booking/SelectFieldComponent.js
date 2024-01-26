'use client'
import { useToast } from "../../components/ui/use-toast";
import React, { useContext, useState } from "react";
import { MdEdit } from "react-icons/md";
import { UserContext } from "../../context/UserContextProvider";

const SelectFieldComponent = ({
  label,
  value,
  show,
  identifier,
  tableId,
  options,
}) => {
  const { toast } = useToast();
  const { user } = useContext(UserContext);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChangeSelect = (e) => {
    setSelectedValue(e.target.value);
  };

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      console.log(selectedValue)
      const response = await fetch("/api/updatebooking", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: user._id,
          _id: tableId,
          fieldsToUpdate: {
            [identifier]: selectedValue,
          },
        }),
      });

      if (response.ok) {
        displayToast("Successfully Updated", "✅");
        console.log("Booking updated successfully!");
        setIsEdit(false);
      } else {
        const Error = await response.json();
        displayToast("Update failed", "❌", Error.message);
        console.error("Error", Error);
      }
    } catch (error) {
      console.log(error);
      displayToast("Error", "❌", error.message);
    }
  };

  return (
    <div className="flex w-full border-b">
      <label className="my-2 flex w-full items-center justify-between">
        <h2 className="mr-3 text-nowrap text-lg font-semibold">{label} :</h2>
        <div className="flex items-center gap-3">
          <div>
            {isEdit ? (
              <select
                value={selectedValue}
                onChange={handleChangeSelect}
                className="h-10 bg-slate-50 border w-full"
              >
                {options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <h2>{selectedValue}</h2>
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
  );
};

export default SelectFieldComponent;

