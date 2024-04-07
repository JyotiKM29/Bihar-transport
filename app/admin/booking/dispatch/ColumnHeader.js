"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useToast } from "../../../components/ui/use-toast";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";


export default function ColumnHeader() {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);

  const [columns, setColumns] = useState([]);
 
  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };


  useEffect(() => {
    async function handleConfirm(status , bookingId){
      const requestData = {
        "adminId": user?._id,
        "status": status,
        "bookingId": bookingId
      };

      try {

        const response = await fetch("/api/bookingstatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
        console.log(response);
      
        const newResult = await response.json();
      
        if (response.ok) {
          setIsLoading(false);
          displayToast(`Successfully ${status}`, "✅");
         
        } else {
          console.error("Error:", newResult.message);
          displayToast("Error", "❌", newResult.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
        displayToast("Error while sending data", "❌", newResult.message);
        setIsLoading(false);
      }

    }

    setColumns([
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "orderNumber",
        header: "Order No & Date",
        cell: ({ row }) =>
        <div >
      <p className="text-blue-500 underline font-medium">

      
        {row.original.orderNumber}
        </p>
        & 
        <p>

        
        {
          new Date(row.original.date).toLocaleDateString()
        }</p>
        </div>
       
        
      },

      {
        accessorKey: "vehicleRequiredDate",
        header: "Date Req",
        cell: ({ row }) => {
          const date = new Date(row.original.vehicleRequiredDate);
          return date.toLocaleDateString();
        },
      },

      {
        accessorKey: "consignorName",
        header: "Consignor",
        cell: ({ row }) =>
        <div >
      <p className="text-blue-500 underline font-medium">

      
        {row.original.consignorName}
        </p>
        
        <p>
        {row.original.consignorMobileNumber}
        
        </p>
        </div>
       
      },

      {
        accessorKey: "consigneeName",
        header: "consigneeName",
        cell: ({ row }) =>
        <div >
      <p className="text-blue-500 underline font-medium">

      
        {row.original.consigneeName}
        </p>
        
        <p>
        {row.original.consigneeMobileNumber}
        
        </p>
        </div>
      },
      {
        accessorKey: "loadingPoints",

        header: "From",
      },
      {
        accessorKey: "unloadingPoints",

        header: "To",
        cell: ({ row }) =>
        <div >
      <p >

      
        {row.original.unloadingPoints}
        </p>
        <hr/>
        <p>
        {row.original.way}
        
        </p>
        </div>
      },

      {
        accessorKey: "actualWeight",
        header: "Weight",
      },
      {
        accessorKey: "partyBhara",
        header: "Party Bhara ",
        cell: ({ row }) =>
        <div >
      <p >

      
        {row.original.partyBhara}
        </p>
        <hr/>
        <p>
        {row.original.paymentTerm}
        
        </p>
        </div>
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={`/admin/booking/dispatch/${row.original._id}`}>
                    View Detail
                  </Link>
                </DropdownMenuItem>

               
                <DropdownMenuItem>
                <Link 
               href={`/admin/booking/sendInvoice/${row.original._id}`}
                >
                   Send Invoice
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                   <button onClick={()=>handleConfirm('In Transit',`${row.original._id}` )}>InTransit Booking</button> 
                </DropdownMenuItem>
                 <DropdownMenuItem>
                <Link 
href={`/admin/booking/cancel/${row.original._id}`}
 >
     Cancel Booking
   </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ]);
  }, [user]);

  return columns;
}

