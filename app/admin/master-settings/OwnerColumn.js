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
  const {toast} = useToast();

  

  async function handleRevokeAdmin(userID) {
    

    try {
     
      const  response = await fetch(`/api/revokeadmin`, {
          method: "POST",
          body: JSON.stringify({ ownerId: user._id, adminId: userID }),
        });


      
        displayToast("Successfully Removed ", "✅");
      console.log(response); 
      if (!response.ok) {
        displayToast("Error", "❌", error.message);
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      displayToast("Error", "❌", error);
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
    async function deleteData(id) {
      console.log(user);
      console.log("id:", id);
      try {
        const response = await fetch(`/api/vehicledeletion`, {
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

     
    ]);
  }, [user]);

  return columns;
}
