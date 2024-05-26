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
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);

  const [columns, setColumns] = useState([]);

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  useEffect(() => {
    async function handleDelete(unitId, e) {
      e.preventDefault(); // Prevent the default action of the click event

      const requestData = {
        adminId: user?._id,
        id: unitId,
      };

      try {
        console.log(requestData);

        const response = await fetch("/api/setting/additionalCharges/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
        console.log(response);

        const newResult = await response.json();

        if (response.ok) {
          setIsLoading(false);
          displayToast(`Successfully Deleted`, "✅");
          // setDataLoading(~dataLoading);
        } else {
          console.log(newResult, " ", response);
          console.error("Error:", newResult.message);
          displayToast("Error", "❌", newResult.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
        displayToast("Error while Deleting data", "❌", newResult.message);
        setIsLoading(false);
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

        header: (
          <div className="text-center">
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>Name</p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-blue-500 underline">
              {row.original.name}
            </p>

            {/* <p>{row.original.consignorMobileNumber}</p> */}
          </div>
        ),
      },
      {
        accessorKey: "totalBooking",

        header: (
          <div className="text-center">
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>Total Booking</p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-blue-500 underline">
              {row.original.totalBooking}
            </p>

            {/* <p>{row.original.consignorMobileNumber}</p> */}
          </div>
        ),
      },

      {
        accessorKey: "totalPaid",

        header: (
          <div className="text-center">
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>Total Paid ₹  </p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-blue-500 underline">
              {row.original.totalPaid} ₹ 
            </p>

            {/* <p>{row.original.consignorMobileNumber}</p> */}
          </div>
        ),
      },

      {
        accessorKey: "totalRemaining",

        header: (
          <div className="text-center">
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>Remaining Amount ₹ </p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-blue-500 underline">
              {row.original.totalRemaining} ₹ 
            </p>

            {/* <p>{row.original.consignorMobileNumber}</p> */}
          </div>
        ),
      },

      {
        accessorKey: "totalAmount",

        header: (
          <div className="text-center">
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>Total Amount ₹ </p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-blue-500 underline">
              {row.original.totalAmount} ₹ 
            </p>

            {/* <p>{row.original.consignorMobileNumber}</p> */}
          </div>
        ),
      },

     

      
      
    ]);
  }, [user]);

  return columns;
}
