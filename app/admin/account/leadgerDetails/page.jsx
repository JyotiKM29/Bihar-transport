"use client";
import LedgerForm from "./LedgerForm";
import { Button } from "../../../components/ui/button";

import React, { useContext, useEffect, useState } from "react";
import ColumnHeader from "./ColumnHeader";
import { DataTable } from "../data-table";
import * as XLSX from "xlsx";


import { UserContext } from "../../../context/UserContextProvider";

const LedgerRegistration = () => {
  const [showAddForm, setShowAddForm] = useState(true);
  const [loading, setLoading] = useState(true);
  const columns = ColumnHeader();

  const { user } = useContext(UserContext);

  const [data, setData] = useState(null);

  const userId = user?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const response = await fetch(`/api/accounting/getledger/${userId}`, {
            method: "GET",
          });

          // console.log("response", response);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();

          setLoading(false);
          // console.log(result);

          setData(result.data);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [userId]);

  function handleExport() {
    if (data) {
      var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
      XLSX.writeFile(wb, "MyExcel.xlsx");
    } else {
      console.error("No data available for export");
    }
  }
  
  return (
    <div className="max-w max-h mt-14 rounded-2xl  bg-white px-4 py-4 shadow-lg md:px-10 lg:my-4 lg:p-8 lg:px-20">
      <div className="flex items-center justify-between">
        <h2 className="mb-8  text-3xl font-semibold text-orange-500">
          Ledger Details :
        </h2>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {!showAddForm ? "Add New ledger " : "Ledger detail"}
          </Button>
        </div>
      </div>

      {showAddForm ? (
        <LedgerForm />
      ) : (
        <>
          {loading ? (
            <div className="max-w max-h  bg-white">
              <h2 className="text-xl">Loading...</h2>
            </div>
          ) : (
            <>
             
              <DataTable columns={columns} data={data} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default LedgerRegistration;
