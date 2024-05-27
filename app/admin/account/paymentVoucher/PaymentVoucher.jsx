"use client";

import { Button } from "../../../components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import ColumnHeader from "./ColumnHeader";
import { DataTable } from "../data-table";
import SearchBooking from "./SearchStatement";
import { UserContext } from "../../../context/UserContextProvider";
import AddNew from "./AddNew";

const PaymentVoucher = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [statement, setStatement] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const columns = ColumnHeader();

  const { user } = useContext(UserContext);
  const [data, setData] = useState(null);
  const userId = user?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          setLoading(true);
          const response = await fetch(`/api/accounting/getVoucher/${userId}`, {
            method: "GET",
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();
          setData(result);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [userId, refresh]);

  return (
    <div className="max-w max-h mt-14 rounded-2xl bg-white px-4 py-4 shadow-lg md:px-10 lg:my-4 lg:p-8 lg:px-20">
      <div className="flex items-center justify-between">
        <h2 className="mb-8 text-3xl font-semibold text-orange-500">Payment Vouchers :</h2>
        <div className="flex gap-3">
          {!loading && !showAddForm && !statement && (
            <>
              <Button onClick={() => setRefresh(!refresh)}>Refresh</Button>
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                {!showAddForm ? "Add New Payment Voucher" : "Back"}
              </Button>
              <Button onClick={() => setStatement(!statement)}>Statements</Button>
            </>
          )}
        </div>
      </div>

      {statement ? (
        <div className="relative max-h flex w-full flex-col gap-3 space-y-2 rounded-2xl bg-white px-4 py-4 shadow-md md:p-6 xl:h-[95%]">
          <Button
            variant="secondary"
            className="absolute right-4 top-4 bg-violet-200 shadow-md hover:bg-violet-300"
            onClick={() => setStatement(false)}
          >
            Back
          </Button>
          <div className="flex pt-8 lg:pt-3">
            <h1 className="flex-1 text-center text-2xl text-violet-800 lg:block xl:text-3xl">
              Payment Voucher Statement
            </h1>
          </div>
          <SearchBooking />
        </div>
      ) : (
        <>
          {showAddForm ? (
            <div className="relative">
              <Button
                variant="secondary"
                className="absolute right-4 top-4 bg-violet-200 shadow-md hover:bg-violet-300"
                onClick={() => setShowAddForm(false)}
              >
                Back
              </Button>
              <div className="pt-12">
                <AddNew />
              </div>
            </div>
          ) : (
            <>
              {loading ? (
                <div className="max-w max-h bg-white">
                  <h2 className="text-xl">Loading...</h2>
                </div>
              ) : (
                <DataTable columns={columns} data={data} />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentVoucher;
