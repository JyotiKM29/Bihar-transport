'use client'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import ColumnHeader from './ColumnHeader';
import { DataTable } from './data-table';
import { Button } from '../../components/ui/button';
import { UserContext } from '../../context/UserContextProvider';
import AddNew from './AddNew'

const Quotation = () => {
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
            const response = await fetch(`/api/quote/get/${userId}`, {
              method: "GET",
            });
    
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
    
            setLoading(false);
    
       
            console.log('Quatation',result);
    
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
    <div className="min-h-[90vh] w-full rounded-2xl  bg-white p-8  shadow-sm "> 
   
    
     
      
      
        <div className="pt-4 lg:pt-0 flex gap-3 items-center justify-between">
        <h2 className="text-xl lg:text-3xl font-semibold text-cyan-800 ">
    Quotations  :
        </h2>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="lg:px-8 lg:py-2 rounded-lg shadow-md bg-cyan-200 hover:bg-cyan-300 text-black max-w-full ">
            {!showAddForm ? "New Quotations" : "Back"}
          </Button>
          
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
  )
}

export default Quotation
