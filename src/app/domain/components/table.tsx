"use client";
import React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, formatStatus } from "@/utils";
import { deleteDomain } from "@/services/domain-service";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
type Domain = {
  id: number;
  name: string;
  status: string;
  createdAt: string;
};

const columnHelper = createColumnHelper<Domain>();

const DomainTable = ({ domains }: { domains: Domain[] }) => {
  const [data, _setData] = React.useState(() => [...domains]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const router = useRouter();
  React.useEffect(() => {
    _setData([...domains]);
  }, [domains]);
  const deleteDm = (id: number) => {
    Swal.fire({
      title: "Xóa Tên Miền?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const respone = await deleteDomain(id);
        if (respone.status) {
          toast.success(respone.message);
          router.refresh();
        } else {
          toast.error(respone.message);
        }
      }
    });
  };
  const columns = [
    columnHelper.accessor("id", {
      header: () => <p className="min-w-[50px]">ID</p>,
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),

    columnHelper.accessor("name", {
      header: () => <p className="min-w-[200px]">Tên Miền</p>,
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("status", {
      header: () => <p className="min-w-[200px]">Trạng Thái</p>,
      cell: (info) => formatStatus(info.getValue()),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("createdAt", {
      header: () => <p className="min-w-[250px]">Ngày Tạo</p>,
      cell: (info) => formatDate(info.getValue()),
      footer: (info) => info.column.id,
    }),
    columnHelper.display({
      id: "actions",
      header: () => "Thao Tác",
      cell: (info) => (
        <div>
          <Button
            variant="destructive"
            onClick={() => {
              deleteDm(info.row.original.id);
            }}
          >
            Xóa
          </Button>
        </div>
      ),
    }),
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true, //enable row selection for all rows
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  return (
    <div className="mt-2 flex flex-col gap-y-2">
      <h1 className="font-bold text-xl">Danh Sách Tên Miền Của Bạn</h1>
      <input
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Tìm kiếm"
        className="border p-1 rounded max-w-[320px]"
      />
      <div className="overflow-x-auto">
        <table className="w-full border table-auto">
          <thead className="bg-secondary">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border py-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="min-h-[400px]">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="text-center p-2 border">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 mt-2 text-sm font-medium justify-between">
        <div className="flex space-x-2">
          <span className="flex items-center gap-1">
            Tới trang:
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16 text-center"
            />
          </span>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[100px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  Show {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <span className="flex items-center gap-1 text-sm font-medium">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DomainTable;
