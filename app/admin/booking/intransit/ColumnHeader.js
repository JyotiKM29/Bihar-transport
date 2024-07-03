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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import CancellationPop from "../CancellationPop";
import UpdateLocationPop from "../updateLocationPop";
import LocationTable from "../locationTable"


export default function ColumnHeader() {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);
  const router = useRouter();

  const [columns, setColumns] = useState([]);
 
  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };


  useEffect(() => {
    async function handleConfirm(status , bookingId){
      const requestData = {
        "adminId": user?._id,
        "status": status,
        "bookingId": bookingId
      };

      try {

        const response = await fetch("/api/bookingstatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
        console.log(response);
      
        const newResult = await response.json();
      
        if (response.ok) {
          setIsLoading(false);
          displayToast(`Successfully ${status}`, "✅");
         
        } else {
          console.error("Error:", newResult.message);
          displayToast("Error", "❌", newResult.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
        displayToast("Error while sending data", "❌", newResult.message);
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
            <p>LR No.</p>
            <p> &</p>
            <p> Date of Disp</p>
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
            <p>CONSINGOR</p>
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
        accessorKey: "allotedVehicle[0].vehicleNo",

        header: (
          <div className="text-center">
            <p>&nbsp;</p>
            <p>&nbsp;</p>

            <p>Vehicle Details</p>
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
        accessorKey: "currentLocation",

        header: (
          <div className="text-center  ">
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p className="w-[10rem]">Current Location</p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p>
              {
                row.original.location?.[row.original.location?.length - 1]
                  ?.location
              }
            </p>
            <hr />
            {/* <p>{row.original.way}</p> */}
          </div>
        ),
      },
      // {
      //   accessorKey: "updatedLocation",

      //   header: (
      //     <div className="text-center  ">
      //       <p>&nbsp;</p>
      //       <p>&nbsp;</p>
      //       <p className="w-[10rem]">Updated Location</p>
      //     </div>
      //   ),
      //   cell: ({ row }) => (
      //     <div>
      //       <p>{row.original.unloadingPoints}</p>
      //       <hr />
      //       <p>{row.original.way}</p>
      //     </div>
      //   ),
      // },

      {
        id: "actions",
        enableHiding: false,
        header: (
          <div className="text-center">
            <p>&nbsp;</p>
            <p>Update</p>
            <p> Booking location </p>
          </div>
        ),
        cell: ({ row }) => {
          return <UpdateLocationPop bookingId={row.original._id} />;
        },
      },

      // {
      //   accessorKey: "viewLocation",

      //   header: (
      //     <div className="text-center  ">
      //       <p>&nbsp;</p>
      //       <p>&nbsp;</p>
      //       <p className="w-[10rem]">View Location</p>
      //     </div>
      //   ),
      //   cell: ({ row }) => (
      //     <div>
      //       <p>{row.original.locations}</p>
      //       <hr />
      //       <p>{row.original.way}</p>
      //     </div>
      //   ),
      // },

      {
        id: "actions",
        enableHiding: false,
        header: (
          <div className="text-center">
            <p>&nbsp;</p>
            <p>Update</p>
            <p> Booking location </p>
          </div>
        ),
        cell: ({ row }) => {
          return <LocationTable locations={row.original.location} />;
        },
      },

      {
        id: "actions",
        enableHiding: false,
        header: (
          <div className="text-center">
            <p>&nbsp;</p>
            <p>Deliver </p>
            <p>Material</p>
          </div>
        ),
        cell: ({ row }) => (
          <div
            className="inline-block cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 active:bg-red-900"
            onClick={(e) =>
              router.push(
                `/admin/booking/delivered/deliveredDetail/${row.original._id}`,
              )
            }
          >
            <p>Deliver Material</p>
          </div>
        ),
      },

      {
        id: "actions",
        enableHiding: false,
        header: (
          <div className="text-center">
            <p>&nbsp;</p>
            <p>Cancel</p>
            <p> Booking </p>
          </div>
        ),
        cell: ({ row }) => {
          return <CancellationPop bookingId={row.original._id} />;
        },
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
                  <Link href={`/admin/booking/intransit/${row.original._id}`}>
                    View Detail
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link href={`/admin/booking/sendInvoice/${row.original._id}`}>
                    Send Invoice
                  </Link>
                </DropdownMenuItem>
                {/* 
                
                because client wanted to remove
                
                
                <DropdownMenuItem>
                  <button
                    onClick={() =>
                      handleConfirm("Delivered", `${row.original._id}`)
                    }
                  >
                    Delivered Booking
                  </button>
                </DropdownMenuItem> */}
                {/* <DropdownMenuItem>
                <Link 
href={`/admin/booking/cancel/${row.original._id}`}
 >
    Cancel Booking
   </Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem>
                  <Link
                    href={`/admin/booking/delivered/deliveredDetail/${row.original._id}`}
                  >
                    Deliver Material
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

