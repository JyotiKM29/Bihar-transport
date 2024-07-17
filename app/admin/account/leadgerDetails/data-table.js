"use client";
import * as XLSX from "xlsx";
import {
  Column,
  Table as ReactTable,
  PaginationState,
  getFilteredRowModel,
  ColumnDef,
  OnChangeFn,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useState } from "react";

export function DataTable({ columns, data }) {
  function getExportFileBlob({ columns, data, fileType, fileName }) {
    if (fileType === "xlsx") {
      const header = columns.map((c) => ({
        header: c.header,
        accessorKey: c.accessorKey,
      }));
      const filteredHeader = header.filter(
        (item) => typeof item.header !== "function",
      );

      // console.log('header', filteredHeader);

      const compatibleData = data.map((row) => {
        const obj = {};
        filteredHeader.forEach((col) => {
          let accessorKey = col.accessorKey;
          obj[col.header] = accessNestedProperty(row, accessorKey);
        });
        return obj;
      });

      // Log processed data for debugging:
      // console.log("Compatible data after processing:", compatibleData);

      let wb = XLSX.utils.book_new();
      let ws1 = XLSX.utils.json_to_sheet(compatibleData, {
        filteredHeader,
      });
      const headerRow = ws1["!ref"]?.split(":")[0]; // Get the header row reference, use optional chaining
      if (headerRow) {
        // Check if headerRow is defined
        ws1[headerRow].s = {
          // Set style for the header row
          fill: {
            fgColor: { rgb: "#C6EFCE" }, // Light green color (can be adjusted)
          },
        };
      }

      XLSX.utils.book_append_sheet(wb, ws1, "mySheet");
      XLSX.writeFile(wb, `${fileName}.xlsx`);

      return false;
    }
  }

  function accessNestedProperty(obj, key) {
    if (typeof key !== "string") {
      // If key is not a string, return undefined
      return undefined;
    }

    const keys = key?.split("."); // Use optional chaining
    let result = obj;
    for (const k of keys) {
      result = result?.[k]; // Use optional chaining
      if (result === undefined) {
        return undefined;
      }
    }
    return result;
  }

  function handleToggleChange(id, value) {
    console.log(`Toggle changed for ID: ${id}, New Value: ${value}`);
    // Perform your API call or other logic here
  }

  const table = useReactTable({
    data,
    columns,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    //
    debugTable: true,
  });

  return (
    <div className="max-w max-h  bg-white">
      <div className="mt-8 w-full rounded-md  border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="border bg-blue-50">
                      <div className="-space-y-1 ">
                        <div className="mt-2  text-nowrap text-base text-slate-700">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </div>

                        <div>
                          {header.column.getCanFilter() ? (
                            <Filter column={header.column} table={table} />
                          ) : null}
                        </div>
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="bg-grey-50">
            {table.getRowModel() && table.getRowModel().rows ? (
              table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="border">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                    {/* <TableCell>
                      <Toggle
                        id={row.original._id}
                        isActive={row.original.isActive}
                        onToggleChange={handleToggleChange}
                      />
                    </TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col items-center  justify-end gap-3 py-4 md:flex-row">
        <div className="flex flex-1 items-center gap-4 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
          <span className="flex items-center gap-1">
            <span className="text-nowrap">| Go to page:</span>
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-16 rounded border p-1"
            />
          </span>
        </div>

        <div className="flex flex-col items-center gap-4  space-x-2 text-sm md:flex-row">
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>

          <div className="flex gap-4 ">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              getExportFileBlob({
                columns,
                data,
                fileType: "xlsx",
                fileName: "mySheet",
              });
            }}
          >
            Export to ExcelSheet
          </Button>
        </div>
      </div>
    </div>
  );
}

function Filter({ column, table }) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);
  const columnFilterValue = column.getFilterValue();

  if (typeof firstValue === "number") {
    return (
      <Input
        type="number"
        value={columnFilterValue?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old) => [e.target.value, old?.[1]])
        }
        placeholder="min"
        className="h-8 w-full rounded border shadow"
      />
    );
  } else {
    return (
      <Input
        type="text"
        value={columnFilterValue ?? ""}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder="search..."
        className="h-8 w-full rounded border shadow"
      />
    );
  }
}

function Toggle({ id, isActive, onToggleChange }) {
  const [isChecked, setIsChecked] = useState(isActive);

  const handleChange = () => {
    setIsChecked(!isChecked);
    onToggleChange(id, !isChecked);
  };

  return (
    <label className="switch">
      <input type="checkbox" checked={isChecked} onChange={handleChange} />
      <span className="slider round"></span>
    </label>
  );
}
