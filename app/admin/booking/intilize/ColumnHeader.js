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
        header: "Order Id",
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
      },

      {
        accessorKey: "status",
        header: "status",
      },
      {
        accessorKey: "loadingPoints",

        header: "From",
      },
      {
        accessorKey: "unloadingPoints",

        header: "To",
      },

      {
        accessorKey: "actualWeight",
        header: "Weight",
      },
      {
        accessorKey: "createdBy.name",
        header: "Created By",
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
                  <Link href={`/admin/booking/intilize/${row.original._id}`}>
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
                  
<Link 
href={`/admin/booking/dispatedVehicle/${row.original._id}`}
>
   Dispatch Vehicle
  </Link> 
                </DropdownMenuItem>
                <DropdownMenuItem>
                <button onClick={()=>handleConfirm('Cancelled',`${row.original._id}` )}>Cancel Booking</button> 
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



