"use client";

import ResponsivePagination from "react-responsive-pagination";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Pencil, Eye, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import DeleteProduct from "@/components/Btns/DeleteProduct";

export type Product = {
  id: number;
  price: number;
  title: string;
  email: string;
};

export function ProductsTable({ Products }: { Products: Array<Product> }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-start p-0"
          >
            Product name
            <ArrowUpDown />
          </Button>
        );
      },

      cell: ({ row }) => (
        <div className="capitalize text-nowrap">{row.getValue("title")}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-start p-0"
          >
            Description
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-ellipsis text-nowrap w-64 overflow-hidden">
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-start p-0"
          >
            Price
            <ArrowUpDown />
          </Button>
        );
      },

      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));

        // Format the price as a dollar price
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price);

        return <div className="text-start font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-start">Actions</div>,
      cell: ({ row }) => {
        const { id } = row.original;

        return (
          <div className="flex items-center gap-2">
            <button>
              <Eye size={18} />
            </button>
            <Link
              href={`${pathname}/edit/${id}?${createQueryString(
                "locale",
                searchParams.get("locale") || "en"
              )}`}
              className="text-blue-500 hover:text-blue-700"
            >
              <Pencil size={18} />
            </Link>
            <DeleteProduct id={id} />
          </div>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(1);

  const table = useReactTable({
    data: Products,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: 12,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex: currentPage - 1, pageSize: 10 });
        setCurrentPage(newState.pageIndex + 1);
      } else {
        setCurrentPage(updater.pageIndex + 1);
      }
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by product name..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && ""}
                  className={`hover:bg-slate-600 hover:text-white ${
                    row.getIsSelected() ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <ResponsivePagination
          current={currentPage}
          total={Math.ceil(table.getFilteredRowModel().rows.length / 12)}
          onPageChange={(page) => {
            setCurrentPage(page);
            table.setPageIndex(page - 1);
          }}
          className="flex w-fit list-none justify-center gap-2 p-0"
          pageItemClassName="flex items-center justify-center min-w-[32px] min-h-[32px] rounded-md text-[14px] font-normal text-[#212121] transition hover:bg-[#eee] hover:!text-white"
          pageLinkClassName="w-full h-full flex items-center justify-center"
          activeItemClassName="font-bold bg-[#f7f6f6] text-[#000]"
          disabledItemClassName="bg-[#ebf3fc] text-[#368bdc] pointer-events-none cursor-auto"
          previousClassName="px-2 py-1 text-[#368bdc] hover:bg-[#368bdc] hover:!text-white rounded-md transition border"
          nextClassName="px-2 py-1 text-[#368bdc] hover:bg-[#368bdc] hover:!text-white rounded-md transition border"
          maxWidth={100}
          previousLabel={"Previous"}
          nextLabel={"Next"}
        />
      </div>
    </div>
  );
}
