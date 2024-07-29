"use client";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/ui/use-toast";
import React, { useContext, useState } from "react";
import { MdEdit } from "react-icons/md";
import { UserContext } from "../../context/UserContextProvider";

const FieldComponent = ({
  label,
  value,
  show,
  identifier,
  tableId,
  type = "text",
}) => {
  const { toast } = useToast();
  const { user } = useContext(UserContext);
  const [isEdit, setIsEdit] = useState(false);
  const [newValue, setNewValue] = useState(value);

  const handleChangeInput = (e) => {
    setNewValue(e.target.value);
  };

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  const onFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "bihar-transport");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dxuurzxsh/image/upload",
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await response.json();
        const fileUrl = data.secure_url;

        setNewValue(fileUrl);
        await handleUpdate(fileUrl); // Call handleUpdate with the file URL after successful upload
        displayToast("File uploaded and updated successfully", "✅");
      } catch (error) {
        console.error("Error uploading file:", error);
        displayToast("File upload failed", "❌", error.message);
      }
    }
  };

  const handleUpdate = async (updatedValue) => {
    try {
      const response = await fetch("/api/updatebooking", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: user._id,
          _id: tableId,
          fieldsToUpdate: {
            [identifier]: updatedValue || newValue, // Use updatedValue if provided, otherwise use newValue
          },
        }),
      });

      if (response.ok) {
        displayToast("Successfully Updated", "✅");
        setIsEdit(false);
      } else {
        const error = await response.json();
        displayToast("Update failed", "❌", error.message);
        console.error("Error", error);
      }
    } catch (error) {
      console.error(error);
      displayToast("Error", "❌", error.message);
    }
  };

  return (
    <div className="flex w-full">
      <label className="my-2 flex w-full items-center justify-between">
        <h2 className="mr-3 text-nowrap text-lg font-semibold text-cyan-800">
          {label}
        </h2>
        <div className="flex items-center gap-3">
          <div>
            {isEdit ? (
              type === "file" ? (
                <Input
                  type="file"
                  onChange={onFileChange}
                  className="w-4/5 border text-cyan-800"
                />
              ) : (
                <Input
                  type={type}
                  value={newValue}
                  onChange={handleChangeInput}
                  className="w-4/5 border text-cyan-800"
                />
              )
            ) : (
              <h2 className="text-cyan-800">{newValue}</h2>
            )}
          </div>
          <div>
            {show ? (
              isEdit ? (
                <button
                  onClick={() => handleUpdate()}
                  className="rounded-md bg-cyan-600 p-2 text-white hover:bg-cyan-700"
                >
                  Update
                </button>
              ) : (
                <button onClick={() => setIsEdit(!isEdit)}>
                  <MdEdit className="h-8 fill-cyan-600" />
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

export default FieldComponent;
