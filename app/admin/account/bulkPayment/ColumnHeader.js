"use client";


import { Checkbox } from "../../../components/ui/checkbox";


import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";

import { Eye, Pencil, Trash2 } from "lucide-react";

export default function ColumnHeader() {
  const { user } = useContext(UserContext);
  const [columns, setColumns] = useState([]);
  

  useEffect(() => {
    async function deleteData(id) {
      // console.log(user);
      // console.log("id:", id);
      try {
        const response = await fetch(`/api/deletebooking`, {
          method: "DELETE",
          body: JSON.stringify({ _id: id, adminId: user._id }),
        });
        // console.log(response);

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
        // accessorKey: "",
        header: "S.No",
        cell: ({ row }) => (row.index + 1),
      },

      {
        accessorKey: "createdBy.date",
        header: "Received Date ",
        cell: ({ row }) => {
          const date = new Date(row.original.createdBy.date);
          return date.toLocaleDateString();
        },
      },

      {
        accessorKey: "recieveFrom",
        header: "Recieve From",
      },

      {
        accessorKey: "recieveAmount",
        header: "Recieve Amount",
      },
      {
        accessorKey: "paymentMode",

        header: "Payment Mode",
      },
      {
        accessorKey: "remarks",

        header: "Remarks",
      },
     
      {
  
        header: "View",
        cell: ({ row }) =><Link href={`/admin/account/bulkPayment/${row.original._id}`}  >
        <div className='bg-[#14A2B8] p-1 h-8 w-8 rounded flex items-center justify-center'>
        <Eye strokeWidth={1.5}   className='fill-[#14A2B8] text-white h-5 w-5'/>
        </div>
       
        </Link>,
      },
      {
  
        header: "Edit",
        cell: ({ row }) =><Link href={`/admin/account/bulkPayment/${row.original._id}`}  >
        <div className='bg-yellow-400 p-1 h-8 w-8 rounded flex items-center justify-center'>
        <Pencil strokeWidth={1.5}   className='fill-yellow-400 text-white h-5 w-5'/>
        </div>
       
        </Link>,
      },
      {
  
        header: "Delete",
        cell: ({ row }) =><button  onClick={() => {
                          deleteData(row.original._id);
                       }}  >
        <div className='bg-red-600 p-1 h-8 w-8 rounded flex items-center justify-center'>
        <Trash2 strokeWidth={1.5} className='fill-red-600 text-white h-5 w-5'/>
        </div>
       
        </button>,
      },
    ]);
  }, [user]);

  return columns;
}

