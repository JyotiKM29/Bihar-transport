"use client";
import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import AddNew from "./AddNew";

const MoneyReceipt = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="max-w max-h mt-14 rounded-md  bg-white px-4 py-4 shadow-md md:px-10 lg:my-4 lg:p-8 lg:px-20">
      <div className="flex items-center justify-between">
        <h2 className="mb-8  text-3xl font-semibold">Money Receipt :</h2>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {!showAddForm ? "Add New " : "Back"}
          </Button>
          <Button variant="secondary"> Statements</Button>
        </div>
      </div>

      {showAddForm && <AddNew />}
    </div>
  );
};

export default MoneyReceipt;
