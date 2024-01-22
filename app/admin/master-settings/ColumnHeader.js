"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Button } from "../../components/ui/button"
import { Checkbox } from "../../components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,

} from "../../components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"

import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../context/UserContextProvider"







export default function ColumnHeader() {
  const { user } = useContext(UserContext);
  const [columns, setColumns] = useState([]);

  
  

  useEffect(() => {
    async function deleteData(id) {
      console.log(user);
       console.log("id:", id);
       try {
         const response = await fetch(`/api/vehicledeletion`, {
           method: "DELETE",
           body: JSON.stringify({ _id: id, adminId: user._id }),
         });
         console.log(response)
   
         if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
         }
       } catch (error) {
         console.error("There was a problem with the delete request.", error);
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
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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

      // Booking Id , Consignee NAme , Status (payment)
      // Due ammount , paid Account , Total , invoice , Mobile
    {
        accessorKey: "orderNumber",
        header: "Booking ID",
    },
    {
        accessorKey: "consigneeName",
        header: "Consignee Name",
    },
    {
        accessorKey: "consigneeMobileNumber",
        header: "consignee Mobile No",
    },
    {
        accessorKey: "paymentclear",
        header: "Payment Status",
    },

    {
        accessorKey: "advanceAmount",
        header: "Paid Amount",
    },
    {
        accessorKey: "balanceAmount",
        header: " Due Amount",
    },
    {
        accessorKey: "partyBhara",
        header: "Total Amount",
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
                <Link href={`/admin/booking/personal/${row.original._id}`}>
                    View Detail
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Print Data</DropdownMenuItem>
               
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ]);
  }, [user]);

  return columns;
}



