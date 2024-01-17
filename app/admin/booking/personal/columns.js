"use client"

import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Button } from "../../../components/ui/button"
import { Checkbox } from "../../../components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import Link from "next/link"

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
//   {
//     accessorKey:"ContNo",
//     header: "ContNo",
//   },
  // {
  //   accessorKey:"vehicleno",
  //   header:"Vehicle No",
  // },
  // {
  //   accessorKey:"status",
  //   header: "status",
  //   footer: props => props.column.id,
  // },
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
            <DropdownMenuItem>
              <Link href={`/admin/booking/personal/id:${data._id}`}>
              View Detail
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Print Data</DropdownMenuItem>
            <DropdownMenuItem>Update Data</DropdownMenuItem>
            <DropdownMenuItem>Delete Data</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  
 
]
