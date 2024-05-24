"use client";

import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../../../components/ui/dropdown-menu";
import Link from "next/link";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";
import { useRouter } from "next/navigation";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

export default function ColumnHeaderPending() {
  const { user } = useContext(UserContext);
  const [columns, setColumns] = useState([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function GenerateInvoice(id) {

       router.push(`/admin/account/invoice/${id}`);
       
    }

    const displayToast = (title, action, description = "") => {
      toast({
        title,
        action,
        description,
      });
    };

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
      {
        accessorKey: "vehicleRequiredDate",
        header: "Date Req",
        cell: ({ row }) => {
          const date = new Date(row.original.vehicleRequiredDate);
          return date.toLocaleDateString();
        },
      },
      {
        accessorKey: "consignorName",
        header: "Consignor",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "itemsList.totalActualWeight",
        header: "Charged Weight (in KG) ",
      },
      {
        accessorKey: "totalBillingAmount",
        header: "Total Billing Amount",
      },
      {
        header: "Invoice",
        cell: ({ row }) => (
          <Button
            className="rounded-3xl bg-green-300 px-4 text-sm text-black hover:bg-green-500"
            onClick={() => GenerateInvoice(row.original._id)}
          >
            Download
          </Button>
        ),
      },
    ]);
  }, [user]);

  return columns;
}
