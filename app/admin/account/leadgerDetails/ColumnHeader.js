"use client";

import { Checkbox } from "../../../components/ui/checkbox";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import { Input } from "../../../components/ui/input";
import { Pencil } from "lucide-react";
import Toggle from "./ToggleButton";

export default function ColumnHeader() {
  const { user } = useContext(UserContext);
  const [columns, setColumns] = useState([]);

   const handleToggleChange = (id, value) => {
     console.log(`Toggle changed for ID: ${id}, New Value: ${value}`);
     // Perform your API call or other logic here
   };

  useEffect(() => {
    async function deleteData(id) {
      // console.log(user);
      // console.log("id:", id);
      try {
        const response = await fetch(`/api/deletebooking`, {
          method: "DELETE",
          body: JSON.stringify({ _id: id, adminId: user._id }),
        });
        // console.log(response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        // console.error("There was a problem with the delete request.", error);
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
        accessorKey: "isActive",
        header: "Active Status",
        cell: ({ row }) => (
          <Toggle
            id={row.original._id}
            isActive={row.original.isActive}
            onToggleChange={handleToggleChange}
          />
        ),
      },
      {
        header: "Edit",
        cell: ({ row }) => (
          <Link href={`/admin/account/leadgerDetails/${row.original._id}`}>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-yellow-400 p-1">
              <Pencil
                strokeWidth={1.5}
                className="h-5 w-5 fill-yellow-400 text-white"
              />
            </div>
          </Link>
        ),
      },
    ]);
  }, [user]);

  return columns;
}

