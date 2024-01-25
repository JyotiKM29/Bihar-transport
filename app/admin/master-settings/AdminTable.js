"use client";
import React, { useContext, useEffect, useState } from "react";
import ColumnHeader from './ColumnHeader';
import { DataTable } from "./data-table";
import { UserContext } from "../../context/UserContextProvider";


const AdminTable = () => {
    const [loading , setLoading] = useState(true);

    const { user } = useContext(UserContext);
  
    const [data, setData] = useState(null);
    const columns = ColumnHeader();
    const userId = user?._id;

    useEffect(() => {
        const fetchData = async () => {
        
          try {
            if (userId) {
              const response = await fetch(`/api/getadmin/${userId}`, {
                method: "GET",
              });
              console.log(response)
      
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
      
              const data = await response.json();
    
              setLoading(false);
           
            
              setData(data);
              console.log(data)
            }
          } catch (error) {
            setLoading(false);
            console.error("Error:", error);
          }
        };
      
        fetchData();
      }, [userId ]);

      return (
        <div className="min-h h-[94vh] w-full space-y-6">
         
           {loading ? 'Loading.....' :'table'}
            {/* <DataTable columns={columns} data={data?.data} /> */}
            
           
        
        </div>
      )
}

export default AdminTable
