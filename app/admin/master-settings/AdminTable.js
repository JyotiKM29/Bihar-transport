"use client";
import React, {  useContext, useEffect, useState } from "react";
import ColumnHeader from './AdminColumn';
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


      const AdminData = data && data.users.filter((user)=>user.isAdmin === true && user.isOwner === false);

      return (
        <div className="min-h-[90vh] w-full space-y-6">
        <div className="h-8  w-full ">
          <h1 className="hidden text-4xl  lg:block ">Admins</h1>
        </div>
        <div
          className="min-h w-full 
        space-y-2 rounded-2xl  bg-white px-4 py-4 
       shadow-sm md:px-6 xl:h-[95%]"
        >
         
           {loading ? 'Loading.....' : <DataTable columns={columns} data={AdminData} />}
           
            
           
        
           </div>
    </div>
      )
}

export default AdminTable
