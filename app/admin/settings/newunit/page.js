"use client";
import React, { useContext, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";

const AddUnit = () => {
  const [unitName, setUnitName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useContext(UserContext);

  const userId = user?._id;

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/addunit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          adminId: userId,
          unitName
        }),
      });

      const result = await response.json();

      if (response.ok) {
        displayToast("Unit Added Successfully", "✅");
        setUnitName("");
      } else {
        console.error("Error:", result.message);
        displayToast("Failed to add unit", "❌", result.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
      displayToast("Server Error", "❌", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full w-full rounded-3xl bg-white px-6 py-4 shadow-sm">
      <h2 className="font-semiBold mt-12 text-3xl lg:mt-0">
        Add a New Unit:
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex w-full flex-col items-start justify-between self-end rounded-xl border px-6 py-4 shadow-md"
      >
        <label className="w-full items-center gap-4 md:flex">
          <Input
            label="Unit Name"
            placeholder="Enter unit name"
            id="unitName"
            type="text"
            required
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
            className="w-full"
          />
        </label>
        <Button type="submit">{loading ? "Adding..." : "Add Unit"}</Button>
      </form>
    </div>
  );
};

export default AddUnit;
