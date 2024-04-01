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
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";




export function DataTable({ columns, data  }) {

  function getExportFileBlob({ columns, data, fileType, fileName }) {
    if (fileType === "xlsx") {
     
      const header = columns.map((c) => ({ header: c.header, accessorKey: c.accessorKey }));

     
    const filteredHeader = header.filter((item) => typeof item.header !== 'function');
      
      console.log('header' ,filteredHeader)
      const compatibleData = data.map((row) => {

        
        
        const obj = {};
        filteredHeader.forEach((col, index) => {
            let accessorKey = col.accessorKey;
            obj[col.header] = accessNestedProperty(row, accessorKey);
           
           
        });
        return obj;
    });
      // Log processed data for debugging:
      console.log("Compatible data after processing:", compatibleData);

      let wb = XLSX.utils.book_new();
      let ws1 = XLSX.utils.json_to_sheet(compatibleData, {
        filteredHeader,
      });
      const headerRow = ws1["!ref"].split(":")[0]; // Get the header row reference
      ws1[headerRow].s = { // Set style for the header row
        fill: {
          fgColor: { rgb: "#C6EFCE" }, // Light green color (can be adjusted)
        },
      };



      XLSX.utils.book_append_sheet(wb, ws1, "mySheet");
      XLSX.writeFile(wb, `${fileName}.xlsx`);

     
      return false;
    }
  }

  function accessNestedProperty(obj, key) {
    if (typeof key !== 'string') {
      // If key is not a string, return undefined
      return undefined;
  }

    const keys = key?.split('.');
    let result = obj;
    for (const k of keys) {
        result = result[k];
        if (result === undefined) {
            return undefined;
        }
    }
    return result;
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
    <div className="max-w max-h  bg-white" >
 
     

      <div className="rounded-md border w-full  mt-8">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className='bg-blue-50'>
                    <div className="-space-y-1 ">
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
         
          <TableBody className='bg-grey-50'>
          {table && table.getRowModel() && table.getRowModel().rows && table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex text-sm flex-col lg:flex-row   items-center justify-end gap-3 py-4">
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

        <div className="text-sm flex flex-col md:flex-row  items-center gap-4 space-x-2">
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
<div className="flex gap-4">


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
      <div className="flex space-x-2">
        <Input
          type="number"
          value={columnFilterValue?.[0] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old) => [e.target.value, old?.[1]])
          }
          placeholder="min"
          className="h-8 w-14 rounded border shadow"
        />
       
      </div>
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
