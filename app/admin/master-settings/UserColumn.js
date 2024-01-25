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
import { useToast } from "../../components/ui/use-toast"







export default function ColumnHeader() {
  const { user } = useContext(UserContext);
  const [columns, setColumns] = useState([]);
  const {toast} = useToast();
  
   async function handleAuthorize(userID){
    try {
      const response =await fetch('/api/authorize',{
        method: "POST",
          body: JSON.stringify({ _id: user._id, id: userID }),
      })
      displayToast(" Assigned Admin Role", "✅");
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
               <button onClick={()=>handleAuthorize(row.original._id)}>
               Make Admin
               </button>
              
               </DropdownMenuItem>
              
             
              <DropdownMenuItem>
                <Dialog>
                  <DialogTrigger onClick={(e) => e.stopPropagation()}>
                    Delete Data
                  </DialogTrigger>
                  <DialogContent className="flex flex-col justify-center">
                    <DialogHeader>
                      <DialogTitle>Confirm Delete ?</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      This data row will delete permanently from the database
                      and you cannot access it again.
                    </DialogDescription>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={() => {
                          deleteData(row.original._id, user);
                        }}
                      >
                        Confirm
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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



