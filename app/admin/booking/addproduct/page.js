"use client";
import React, { useContext, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [hsnNo, setHsnNo] = useState("");
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
    console.log(userId, productName, hsnNo);

    try {
      setLoading(true);
      console.log(
        JSON.stringify({
          adminId: userId,
          productName,
          hsnNo,
        }),
      );

      const response = await fetch("/api/addProduct", {
        method: "POST",
        body: JSON.stringify({
          adminId: userId,
          productName,
          hsnNo,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        displayToast("Product Added Successfully", "✅");
      } else {
        console.error("Error:", result.message);
        displayToast("Failed to add product", "❌", result.message);
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
        Add a New Product:
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex w-full flex-col items-start justify-between self-end rounded-xl border px-6 py-4 shadow-md"
      >
        <label className="w-full items-center gap-4 md:flex">
          <Input
            label="Product Name"
            placeholder="Enter product name"
            id="productName"
            type="text"
            required
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full"
          />
        </label>
        <label className="w-full items-center gap-4 md:flex">
          <Input
            label="HSN No"
            placeholder="Enter HSN No"
            id="hsnNo"
            type="text"
            required
            value={hsnNo}
            onChange={(e) => setHsnNo(e.target.value)}
            className="w-full"
          />
        </label>
        <Button type="submit">{loading ? "Adding..." : "Add Product"}</Button>
      </form>
    </div>
  );
};

export default AddProduct;
