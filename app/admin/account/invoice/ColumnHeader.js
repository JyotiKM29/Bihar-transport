"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import { Input } from "../../../components/ui/input";

export default function ColumnHeader() {
  const { user } = useContext(UserContext);
  const [columns, setColumns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [vehicleIds, setVehicleIds] = useState([]);
  const [vehicleData, setVehicleData] = useState();

  const [searchInput, setSearchInput] = useState("");

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  useEffect(() => {
    async function deleteData(id) {
     
      try {
        const response = await fetch(`/api/deletebooking`, {
          method: "DELETE",
          body: JSON.stringify({ _id: id, adminId: user._id }),
        });
        // console.log(response);

        if (!response.ok) {
         console.log('error ', response.statusText)
          displayToast("Update deleted", "❌" );
        }else{
          displayToast("Successfully deleted", "✅");
          // window.location.reload();
        }
      } catch (error) {
        console.error("There was a problem with the delete request.", error);
        displayToast("Error", "❌", error.message);
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
        accessorKey: "orderNumber",
        header: "Order Id",
      },

      // {
      //   accessorKey: "vehicleRequiredDate",
      //   header: "Date Req",
      //   cell: ({ row }) => {
      //     const date = new Date(row.original.vehicleRequiredDate);
      //     return date.toLocaleDateString();
      //   },
      // },

      {
        accessorKey: "consignorName",
        header: "Consignor",
      },

      {
        accessorKey: "status",
        header: "status",
      },
     

      {
        accessorKey: "partyBhara",
        header: "party Bhara",
      },
      {
        accessorKey: "generatedInvoice.invoiceNumber",
        header: "Invoice No",
      },
      {
        accessorKey: "generatedInvoice.invoiceDate",
        header: "Invoice Date",
        cell: ({ row }) => {
          const date = new Date(row.original.generatedInvoice.invoiceDate);
          return date.toLocaleDateString();
        },
      },
      {
        accessorKey: "generatedInvoice.invoiceAmount",
        header: "Invoice Amount",
      },
      {
        accessorKey: "generatedInvoice.invoiceRemarks",
        header: "Invoice Remark",
      },
      
    ]);
  }, [user]);

  return columns;
}

