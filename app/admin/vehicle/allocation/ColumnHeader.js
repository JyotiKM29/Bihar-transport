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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "@/app/components/ui/use-toast";
import Toggle from "../../account/leadgerDetails/ToggleButton";

export default function ColumnHeader() {
  const { user } = useContext(UserContext);
  const [columns, setColumns] = useState([]);

  const { toast } = useToast();

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  const handleToggleChange = async (id, value, previousValue) => {
    try {
      console.log(`Toggle changed for ID: ${id}, New Value: ${value}`);
      const adminId = user._id;
      const fieldsToUpdate = {
        isActive: value,
      };

      const response = await fetch(`/api/vehicleupdation`, {
        method: "PUT",
        body: JSON.stringify({ _id: id, adminId, fieldsToUpdate }),
      });

      const result = await response.json();
      console.log("result: ", result);

      if (!response.ok) {
        displayToast("Update failed", "❌", result.message);
        // Revert the toggle back to its previous value
        setColumns((prevColumns) =>
          prevColumns.map((col) =>
            col.id === "isActive"
              ? {
                  ...col,
                  cell: (row) => (
                    <Toggle
                      id={row.original._id}
                      isActive={previousValue}
                      onToggleChange={handleToggleChange}
                    />
                  ),
                }
              : col,
          ),
        );
      } else {
        displayToast("Successfully Updated", "✅");
      }
    } catch (error) {
      console.log("There was a problem with the toggle change.", error);
      displayToast("Update failed", "❌", error.message);
      // Revert the toggle back to its previous value
      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.id === "isActive"
            ? {
                ...col,
                cell: (row) => (
                  <Toggle
                    id={row.original._id}
                    isActive={previousValue}
                    onToggleChange={handleToggleChange}
                  />
                ),
              }
            : col,
        ),
      );
    }
  };

  useEffect(() => {
    async function deleteData(id) {
      console.log(user);
      console.log("id:", id);
      try {
        const response = await fetch(`/api/vehicledeletion`, {
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
        accessorKey: "vehicleNo",
        header: "Vehicle No",
      },
      {
        accessorKey: "driver.name",
        header: "Driver Name",
      },
      {
        accessorKey: "allotmentStatus",
        header: "Allocation",
        cell: ({ row }) => {
          return row.original.allotmentStatus ? (
            <span className="rounded-2xl bg-green-600 p-1 px-4 text-white">
              Booked
            </span>
          ) : (
            <span className="rounded-2xl bg-orange-400 p-1 px-4 text-white">
              Unbooked
            </span>
          );
        },
      },
      {
        accessorKey: "vehicleType",
        header: "Vehicle Type",
      },
      {
        accessorKey: "filledWeight",
        header: "Booked (in KG) ",
      },
      {
        accessorKey: "maxCapacity",
        header: " Max Capacity (In Tons)",
      },
      {
        accessorKey: "registrationAuthority",
        header: " Registration Authority",
      },
      {
        accessorKey: "isActive",
        header: "Active Status",
        cell: ({ row }) => (
          <Toggle
            id={row.original._id}
            isActive={row.original.isActive}
            onToggleChange={(id, value) =>
              handleToggleChange(id, value, row.original.isActive)
            }
          />
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
                  <Link href={`/admin/vehicle/allocation/${row.original._id}`}>
                    View Detail
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Print Data</DropdownMenuItem>
                <DropdownMenuItem>
                  <Dialog>
                    <DialogTrigger onClick={(e) => e.stopPropagation()}>
                      Delete Data
                    </DialogTrigger>
                    <DialogContent className="flex flex-col justify-center">
                      <DialogHeader>
                        <DialogTitle>Confirm Delete ?</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        This data row will delete permanently from the database
                        and you cannot access it again.
                      </DialogDescription>
                      <DialogFooter>
                        <Button
                          type="submit"
                          onClick={() => {
                            deleteData(row.original._id, user);
                          }}
                        >
                          Confirm
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
