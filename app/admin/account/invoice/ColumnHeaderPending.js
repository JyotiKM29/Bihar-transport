"use client";

import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";


import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";
import { useRouter } from "next/navigation";


export default function ColumnHeaderPending() {
  const { user } = useContext(UserContext);
  const [columns, setColumns] = useState([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function GenerateInvoice(id) {
   
      try {
        const response = await fetch(`/api/accounting/invoice`, {
          method: "POST",
          body: JSON.stringify({ bookingId: id, adminId: user?._id }),
        });
        // console.log(response);

        if (!response.ok) {
       const  result = await response.json();
         displayToast(result.message, "✅");
        }else{
          displayToast("Successfully generated Invoice", "✅");
          router.push(`/admin/account/invoice/${id}`)
        }

        

      } catch (error) {
        console.error("Error", error);
        displayToast("Error", "❌ ", newResult.message);
      }
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
        header: "Generate",
        cell: ({ row }) => {
        return ( 
          <>

        
        
          <Button className="bg-green-300 text-sm  px-4 text-black  rounded-3xl hover:bg-green-500"
           onClick ={()=>GenerateInvoice(row.original._id)}
          >Invoice</Button>
            </>
        );
          },
      

      }
    ]);
  }, [user]);

  return columns;
}

