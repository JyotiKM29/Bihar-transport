"use client";

import { Button } from "../../../components/ui/button";

import React, { useContext, useEffect, useState } from "react";
import ColumnHeader from './ColumnHeader';
import { DataTable } from '../data-table';

import { UserContext } from "../../../context/UserContextProvider";
import AddNew from "./AddNew";

const PaymentVoucher = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading , setLoading] = useState(true);
  const columns = ColumnHeader();

  const { user } = useContext(UserContext);

  const [data, setData] = useState(null);

  const userId = user?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const response = await fetch(`/api/accounting/pendingPayments/${userId}`, {
            method: "GET",
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const result = await response.json();
  
          setLoading(false);
  
          console.log('pending payment ',result);
  
          setData(result.data);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };
  
    fetchData();
  }, [userId]);

  return (
    <div className="max-w max-h mt-14 rounded-md  bg-white px-4 py-4 shadow-md md:px-10 lg:my-4 lg:p-8 lg:px-20">
      <div className="flex items-center justify-between">
        <h2 className="mb-8  text-3xl font-semibold">Pending Payment  :</h2>
       
      </div>

      {showAddForm ? <AddNew />:
<>
     { loading ?
       (<div className="max-w max-h  bg-white"><h2
       className="text-xl"
       >Loading...</h2></div>) :  
       ( <DataTable columns={columns} data={data} />)}
       </>
       }
    </div>
  );
};

export default PaymentVoucher;
