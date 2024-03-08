"use client";

import { Button } from "../../../components/ui/button";

import React, { useContext, useEffect, useState } from "react";
import ColumnHeader from "./ColumnHeader";
import ColumnHeaderPending from "./ColumnHeaderPending";
import { DataTable } from "../data-table";

import { UserContext } from "../../../context/UserContextProvider";
import AddNew from "./AddNew";

const Invoices = () => {
 
  const [showPendingForm, setShowPendingForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const columns = ColumnHeader();
  const columnsPending = ColumnHeaderPending();

  const { user } = useContext(UserContext);

  const [invoicePending, setInvoicePending] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);

  const userId = user?._id;

  useEffect(() => {
    const fetchData = async () => {
      const requestData = {
        adminId: user?._id,
      };

      try {
        setLoading(true);
        if (userId) {
          const response = await fetch(`/api/accounting/invoice/pending`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();

          

          console.log("Pending Invoice Result ", result);

          setInvoicePending(result.booking);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const response = await fetch(`/api/accounting/invoice/${userId}`, {
            method: "GET",
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();

          

          console.log("Invoice Generated", result);

          setInvoiceData(result.booking);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="max-w max-h mt-14 rounded-2xl  bg-white px-4 py-4 shadow-lg md:px-10 lg:my-4 lg:p-8 lg:px-20">
      <div className="flex items-center justify-between">
        <h2 className="mb-8  text-3xl font-semibold text-orange-500">
          Invoice Details :
        </h2>
        <div className="flex gap-3">
          <Button onClick={() => setShowPendingForm(!showPendingForm)}>
        
            {showPendingForm ?  "Generated Invoice": "Pending Invoice" }
          </Button>
        </div>
      </div>

    
          {loading ? (
            <div className="max-w max-h  bg-white">
              <h2 className="text-xl">Loading...</h2>
            </div>
          ) : (
            showPendingForm? 
          
            <DataTable columns={columnsPending} data={invoicePending} />:   <DataTable columns={columns} data={invoiceData} />
          )}
       
    </div>
  );
};

export default Invoices;
