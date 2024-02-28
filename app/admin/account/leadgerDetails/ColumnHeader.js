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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import { Input } from "../../../components/ui/input";
import { Pencil } from "lucide-react";

export default function ColumnHeader() {
  const { user } = useContext(UserContext);
  const [columns, setColumns] = useState([]);
  


  useEffect(() => {
    async function deleteData(id) {
      console.log(user);
      console.log("id:", id);
      try {
        const response = await fetch(`/api/deletebooking`, {
          method: "DELETE",
          body: JSON.stringify({ _id: id, adminId: user._id }),
        });
        console.log(response);

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
        accessorKey: "basicInfo.accountName",
        header: "Account Name",
      },

      {
        accessorKey: "basicInfo.officeAddress",
        header: "Address",
      },

      
      {
        accessorKey: "basicInfo.contactNo",

        header: "Phone No",
      },

      {
        accessorKey: "basicInfo.taxInfo.GSTIN",
        header: "GST No",
      },
      {
        accessorKey: "accountDetails.accountGroup",
        header: "Account Group",
      },
      {
  
        header: "Edit",
        cell: ({ row }) =><Link href={`/admin/account/leadgerDetails/${row.original._id}`}  >
        <div className='bg-yellow-400 p-1 h-8 w-8 rounded flex items-center justify-center'>
        <Pencil strokeWidth={1.5}   className='fill-yellow-400 text-white h-5 w-5'/>
        </div>
       
        </Link>,
      },
    ]);
  }, [user]);

  return columns;
}


