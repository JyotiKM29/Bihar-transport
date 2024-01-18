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


async function deleteData(id) {
  try {
    const response = await fetch(`/api/deletebooking/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

  } catch (error) {
    console.error('There was a problem with the delete request.', error);
  }
}

export const columns = [

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
        accessorKey: "orderNumber",
        header: "Order Id",
    },

  {
    accessorKey:"vehicleRequiredDate",
    header: "Date Req",
  },
  {
    accessorKey:"consignorName",
    header: "Consignor",
  },

  {
    accessorKey:"consigneeName",
    header: "Consignee",
  },
  {
    accessorKey:'loadingPoints',

    header: "From"
  },
  {
    accessorKey:'unloadingPoints',

    header: "To"
  },
  
 
  {
    accessorKey:"actualWeight",
    header: "Weight",
  },
  {
    accessorKey:"createdBy.name",
    header: "Created By",
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original
     
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
            <DropdownMenuItem>
            
            <Dialog>
    <DialogTrigger onClick={(e) => e.stopPropagation()}>Delete Data</DialogTrigger>
    <DialogContent className='flex flex-col justify-center'>
      <DialogHeader>
        <DialogTitle>Confirm Delete ?</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        This data row will delete parmantly from database and you can not access it again 
      </DialogDescription>
      <DialogFooter>
        <Button  type='submit'  onClick={() => deleteData(row.original._id)}>Confirm</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  
 
]
