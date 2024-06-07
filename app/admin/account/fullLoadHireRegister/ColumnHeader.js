"use client";

import { Checkbox } from "../../../components/ui/checkbox";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import { Input } from "../../../components/ui/input";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ColumnHeader() {
  const { user } = useContext(UserContext);
  const [columns, setColumns] = useState([]);
  const router = useRouter();


 
  useEffect(() => {
    async function deleteData(id) {
      console.log(user);
      console.log("id:", id);
      try {
        const response = await fetch(`/api/deletebooking`, {
          method: "DELETE",
          body: JSON.stringify({ _id: id, adminId: user._id }),
        });
        console.log(response);

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
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "orderNumber",
        header: (
          <div className="text-center">
            <p>Booking Details</p>
            <p></p>
            <p></p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-blue-500 underline">
              {row.original.orderNumber}
            </p>
            <p>{new Date(row.original.date).toLocaleDateString()}</p>
            <p><b>Status:</b> {row.original.status} </p>
            <p><b>Delivery: </b>{row.original?.delivery?.delivery_details?.unloading_date ? new Date(row.original.delivery.delivery_details.unloading_date).toLocaleDateString() : ''}</p>
            <p>
              <b>POD: </b>
              {row.original.delivery?.consignment_info && row.original.delivery.consignment_info.length > 0
                ? new Date(row.original.delivery.consignment_info[0].delivery_date).toLocaleDateString()
                : ''}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "vehicleNo",
        header: (
          <div className="text-center">
            <p>Vehicle Details</p>
            <p></p>
            <p></p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-blue-500 underline">
              {row.original.vehicleData?.vehicleNo}
            </p>
            <p>
              <b> Driver Name:</b>
              {row.original.vehicleData?.driver?.name}
            </p>
            <p><b>RC:</b> {row.original?.vehicleData?.rcPhoto?.length > 0 ? "Yes" : "No"} </p>
            <p><b>License: </b>{row.original?.vehicleData?.driver?.licenseNo ? "Yes" : 'No'}</p>
          </div>
        ),
      },
      {
        accessorKey: "vehicleNo",
        header: (
          <div className="text-center">
            <p>LR Details</p>
            <p></p>
            <p></p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-blue-500 underline">
              {row.original.orderNumber}
            </p>
            <p>{new Date(row.original.date).toLocaleDateString()}</p>
            <p>
              <b>From: </b>
              {row.original.loadingPoints}
            </p>
            <p>
              <b>To: </b>
              {row.original.unloadingPoints}
            </p>
            <p>
              <b> Driver Name:</b>
              {row.original.vehicleData?.driver?.name}
            </p>
            <p><b>RC:</b> {row.original?.vehicleData?.rcPhoto?.length > 0 ? "Yes" : "No"} </p>
            <p><b>License: </b>{row.original?.vehicleData?.driver?.licenseNo ? "Yes" : 'No'}</p>
          </div>
        ),
      },
      {
        accessorKey: "vehicleNo",
        header: (
          <div className="text-center">
            <p>Charged Amount</p>
            <p></p>
            <p></p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-center text-blue-500 underline">
              {row.original.vehicleData?.bookedBy[0]?.netBhara}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "vehicleNo",
        header: (
          <div className="text-center">
            <p>Balance Amount</p>
            <p></p>
            <p></p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-center text-blue-500 underline">
              {row.original.vehicleData?.bookedBy[0]?.balanceAmount}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "vehicleNo",
        header: (
          <div className="text-center">
            <p>Advance Amount</p>
            <p></p>
            <p></p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-center text-blue-500 underline">
              {row.original.vehicleData?.bookedBy[0]?.advanceAmount ? row.original.vehicleData?.bookedBy[0]?.advanceAmount : 0}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "vehicleNo",
        header: (
          <div className="text-center">
            <p>Paid Amount</p>
            <p></p>
            <p></p>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-center text-blue-500 underline">
              {row.original.vehicleData?.bookedBy[0]?.totalPaidAmount ? row.original.vehicleData?.bookedBy[0]?.totalPaidAmount : row.original.vehicleData?.bookedBy[0]?.netBhara - row.original.vehicleData?.bookedBy[0]?.balanceAmount}
            </p>
          </div>
        ),
      },
      {
        header: "Pay / Expanse",
        cell: ({ row }) => {
          return (
            <Link
              className="rounded-2xl bg-green-300 px-4 py-4"
              href={`/admin/account/pendingPayment/${row.original._id}`}
            >
              {row.original.vehicleData.bookedBy[0].balanceAmount === 0 ? "Paid" : "+Expanse"}
            </Link>
          );
        },
      },
      {
        header: "Fuel",
        cell: ({ row }) => {
          return (
            <button
              className="inline-block flex items-center rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
              onClick={() => {
                const data = encodeURIComponent(JSON.stringify(row.original));
    router.push(`/admin/account/fullLoadHireRegister/fuel/${row.original._id}?data=${data}`);
              }}
            >
              <i className="fas fa-gas-pump mr-2"></i>
              Give Fuel
            </button>
          );
        },
      },
      {
        header: "Edit",
        cell: ({ row }) => (
          <Link href={`/admin/account/pendingPayment/view/${row.original._id}`}>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-yellow-400 p-1">
              <Pencil
                strokeWidth={1.5}
                className="h-5 w-5 fill-yellow-400 text-white"
              />
            </div>
          </Link>
        ),
      },
    ]);
  }, [user]);

  return columns;
}
