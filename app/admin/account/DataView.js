"use client";
import * as XLSX from "xlsx";
import {
  Table as ReactTable,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";


export default function DataTable({ columns, data }) {
  function getExportFileBlob({ columns, data, fileType, fileName }) {
    if (fileType === "xlsx") {
      const header = columns.map((c) => ({ header: c.header, accessorKey: c.accessorKey }));
      const filteredHeader = header.filter((item) => typeof item.header !== 'function');

      const compatibleData = data.map((row) => {
        const obj = {};
        filteredHeader.forEach((col) => {
          let accessorKey = col.accessorKey;
          obj[col.header] = accessNestedProperty(row, accessorKey);
        });
        return obj;
      });

      let wb = XLSX.utils.book_new();
      let ws1 = XLSX.utils.json_to_sheet(compatibleData, {
        filteredHeader,
      });
      const headerRow = ws1["!ref"]?.split(":")[0];
      if (headerRow) {
        ws1[headerRow].s = {
          fill: {
            fgColor: { rgb: "#C6EFCE" },
          },
        };
      }

      XLSX.utils.book_append_sheet(wb, ws1, "mySheet");
      XLSX.writeFile(wb, `${fileName}.xlsx`);

      return false;
    }
  }

  function accessNestedProperty(obj, key) {
    if (typeof key !== 'string') {
      return undefined;
    }

    const keys = key?.split('.');
    let result = obj;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        return undefined;
      }
    }
    return result;
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  return (
    <div className="max-w max-h  bg-white">
      <div className="rounded-md border w-full mt-8">
        <Table>
          <TableHeader>
            {table && table.getHeaderGroups && table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className='bg-blue-50 border'>
                    <div className="-space-y-1">
                      <div className="text-nowrap text-base text-slate-700 mt-2">
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
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className='bg-grey-50'>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='border'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-end gap-3 py-4">
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
        <div className="text-sm flex flex-col md:flex-row items-center gap-4 space-x-2">
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <div className="gap-4 flex">
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
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
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