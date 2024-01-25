"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContextProvider";
import { useToast } from "../../components/ui/use-toast";

export default function ColumnHeader() {
  const { user } = useContext(UserContext);
  const [columns, setColumns] = useState([]);
  const { toast } = useToast();

  async function handleRevokeAdmin(userID) {
    try {
      const response = await fetch(`/api/revokeadmin`, {
        method: "POST",
        body: JSON.stringify({ ownerId: user._id, adminId: userID }),
      });

      displayToast("Successfully Removed ", "✅");
      console.log(response);
      if (!response.ok) {
        displayToast("Failed to remove", "❌");
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      displayToast("Error", "❌");
      console.error(`An error occurred: ${error}`);
    }
  }

  async function handleMakeOwner(userID){
    try {
      const response = await fetch(`/api/promoteadmin`, {
        method: "POST",
        body: JSON.stringify({ _id: user._id, id: userID }),
      });

      displayToast("Assign Owner Role ", "✅");
      console.log(response);
      if (!response.ok) {
        displayToast("Failed to Make Owner", "❌");
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      displayToast("Error", "❌");
      console.error(`An error occurred: ${error}`);
    }

  }

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  useEffect(() => {
    

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
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "isemailVerified",
        header: "Email Verified",
      },
      {
        accessorKey: "phone",
        header: "Phone No",
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
                <DropdownMenuItem>
                  <button onClick={() => handleMakeOwner(row.original._id)}>
                    Make Owner
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={() => handleRevokeAdmin(row.original._id)}>
                    Revoke Admin
                  </button>
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
