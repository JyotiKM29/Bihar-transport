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
        accessorKey: "recieptNo",
        header: "Receipt No",
      },

      {
        accessorKey: "recieptDate",
        header: "Date ",
        cell: ({ row }) => {
          const date = new Date(row.original.recieptDate);
          return date.toLocaleDateString();
        },
      },

      {
        accessorKey: "receivedFrom",
        header: "Received From",
      },

      {
        accessorKey: "paidBy",
        header: "Paid By",
      },
      {
        accessorKey: "receivedAmount",

        header: "Cash",
      },
      {
        accessorKey: "TDS",

        header: "TDS",
      },

      {
        accessorKey: "discount",
        header: "Discount",
      },
      // {
      //   accessorKey: "createdBy.name",
      //   header: "Invoice",
      // },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          return (
            // <DropdownMenu>
            //   <DropdownMenuTrigger asChild>
            //     <Button variant="ghost" className="h-8 w-8 p-0">
            //       <span className="sr-only">Open menu</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
            //     </Button>
            //   </DropdownMenuTrigger>
            //   <DropdownMenuContent align="end">
            //     <DropdownMenuLabel>Actions</DropdownMenuLabel>
            //     <DropdownMenuSeparator />
            //     <DropdownMenuItem>
            //       <Link href={`/admin/booking/pending-booking/${row.original._id}`}>
            //         View Detail
            //       </Link>
            //     </DropdownMenuItem>

               
            //     <DropdownMenuItem>
            //     <Link 
            //    href={`/admin/booking/sendInvoice/${row.original._id}`}
            //     >
            //        Send Invoice
            //       </Link>
            //     </DropdownMenuItem>
            //     <DropdownMenuItem>
            //     <Link 
            //    href={`/admin/booking/${row.original.orderNumber}`}
            //     >
            //        Allocation Vehicle
            //       </Link>
            //     </DropdownMenuItem>
            //     <DropdownMenuItem>
            //       <Dialog>
            //         <DialogTrigger onClick={(e) => e.stopPropagation()}>
            //           Delete Data
            //         </DialogTrigger>
            //         <DialogContent className="flex flex-col justify-center">
            //           <DialogHeader>
            //             <DialogTitle>Confirm Delete ?</DialogTitle>
            //           </DialogHeader>
            //           <DialogDescription>
            //             This data row will delete permanently from the database
            //             and you cannot access it again.
            //           </DialogDescription>
            //           <DialogFooter>
            //             <Button
            //               type="submit"
            //               onClick={() => {
            //                 deleteData(row.original._id, user);
            //               }}
            //             >
            //               Confirm
            //             </Button>
            //           </DialogFooter>
            //         </DialogContent>
            //       </Dialog>
            //     </DropdownMenuItem>
            //   </DropdownMenuContent>
            // </DropdownMenu>
          );
        },
      },
    ]);
  }, [user]);

  return columns;
}

