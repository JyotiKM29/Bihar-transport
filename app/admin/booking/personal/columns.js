"use client"

import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../../../components/ui/button"
import { Checkbox } from "../../../components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Input } from "../../../components/ui/input"



// type Booking = {
//     firstName: string;
//     lastName: string;
//     age: number;
//     visits: number;
//     progress: number;
//     status: 'relationship' | 'complicated' | 'single';
//     subRows?: Person[];
//   };


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
    accessorKey:'formModeTo',
    header:"From-Mode-To"
  },
 
  {
    accessorKey:"actualWeight",
    header: "Weight",
  },
  {
    accessorKey:"quantity",
    header: "quantity",
  },
//   {
//     accessorKey:"ContNo",
//     header: "ContNo",
//   },
  {
    accessorKey:"vehicleno",
    header:"Vehicle No",
  },
  {
    accessorKey:"status",
    header: "status",
    footer: props => props.column.id,
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
            {/* <DropdownMenuItem
            //   onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Detail</DropdownMenuItem>
            <DropdownMenuItem>Update Data</DropdownMenuItem>
            <DropdownMenuItem>Delete Data</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  
 
]
