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
import { useToast } from "../../../components/ui/use-toast";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";


export default function ColumnHeader() {
  
  const { user } = useContext(UserContext);

  const [columns, setColumns] = useState([]);
 
  


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
        accessorKey: "orderNumber",
        header: (
          <div className="text-center">
            <p>Order No</p>
            <p>& </p>
            <p> Date</p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-blue-500 underline">
              {row.original.orderNumber}
            </p>
            &<p>{new Date(row.original.date).toLocaleDateString()}</p>
          </div>
        ),
      },

      {
        accessorKey: "vehicleRequiredDate",
        header: (
          <div className="text-center">
            <p>Date</p>
            <p> Vehicle</p>
            <p> Require</p>
          </div>
        ),
        cell: ({ row }) => {
          const date = new Date(row.original.vehicleRequiredDate);
          return date.toLocaleDateString();
        },
      },

      {
        accessorKey: "consignorName",

        header: (
          <div className="text-center">
          
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>CONSIGNOR</p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-blue-500 underline">
              {row.original.consignorName}
            </p>

            <p>{row.original.consignorMobileNumber}</p>
          </div>
        ),
      },

      {
        accessorKey: "consigneeName",

        header: (
          <div className="text-center">
         
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>CONSIGNEE</p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-blue-500 underline">
              {row.original.consigneeName}
            </p>

            <p>{row.original.consigneeMobileNumber}</p>
          </div>
        ),
      },
      {
        accessorKey: "loadingPoints",

        header: (
          <div className="text-center ">
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p className="w-[10rem]">From</p>
          </div>
        ),
      },
      {
        accessorKey: "unloadingPoints",

        header: (
          <div className="text-center  ">
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p className="w-[10rem]">To</p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p>{row.original.unloadingPoints}</p>
            <hr />
            <p>{row.original.way}</p>
          </div>
        ),
      },
      {
        accessorKey: "allotedVehicle[0].vehicleNo",

        header: (
          <div className="text-center">
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>Material Details</p>
         
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p>
              {row.original.itemsList[0]?.material}({" "}
              {row.original.itemsList[0]?.quantity}
              {row.original.itemsList[0]?.quantityUnit} )
            </p>

            <p>
              {row.original.itemsList[0]?.actualWeight}
              {row.original.itemsList[0]?.actualWeightUnit}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "allotedVehicle[0].vehicleNo",

        header: (
          <div className="text-center">
            <p>Vehicle Details</p>
            <p>& </p>
            <p> No of vehicle </p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p>{row.original.allotedVehicle[0]?.vehicleNo}</p>

            <p>{row.original.noOfVehicle}</p>
          </div>
        ),
      },
      {
        accessorKey: "actualWeight",

        header: (
          <div className="text-center">
            <p>Rate As per</p>
            <p>& </p>
            <p> Rate </p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p>{row.original.allotedVehicle[0]?.rateAsPer}</p>

            <p>
              {row.original.allotedVehicle[0]?.rate} Per
              {row.original.allotedVehicle[0]?.rateUnit}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "partyBhara",

        header: (
          <div className="text-center">
            <p>Party Bhara</p>
            <p>& </p>
            <p> Payment Term </p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p>{row.original.partyBhara}</p>
            <hr />
            <p>{row.original.paymentTerm}</p>
          </div>
        ),
      },
      {
        accessorKey: "totalBillingAmount",

        header: (
          <div className="text-center">
           <p>&nbsp;</p>
            <p>Total Billing</p>
         
            <p> Amount </p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p>{row.original.totalBillingAmount}</p>
         
          </div>
        ),
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
                  <Link href={`/admin/booking/delivered/${row.original._id}`}>
                    View Detail
                  </Link>
                </DropdownMenuItem>

               
                <DropdownMenuItem>
                <Link 
               href={`/admin/booking/sendInvoice/${row.original._id}`}
                >
                   Send Invoice
                  </Link>
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

