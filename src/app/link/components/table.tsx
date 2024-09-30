"use client";
import React, { useState } from "react";
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
import { formatDate, formatStatusPath, formatType } from "@/utils";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { FaCopy, FaTrash } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import { deletePath, fakePath, offPath } from "@/services/path-service";
import { GiClick } from "react-icons/gi";
import { Loader2 } from "lucide-react";
import { SiAdguard } from "react-icons/si";
import { TbShieldCheck, TbShieldX } from "react-icons/tb";
import { BiSolidShieldPlus, BiSolidShieldX } from "react-icons/bi";

type Path = {
  id: number;
  domainId: number;
  userId: number;
  path: string;
  click: number;
  createdAt: string;
  fake: boolean;
  status: boolean;
  updatedAt: string;
  content: Content;
  domain: Domain;
};

type Content = {
  id: number;
  pathId: number;
  type: string;
  content: null;
  image: null;
  video: null;
  link: string;
  meta: string;
  autoOff: boolean;
  delay: number;
  createdAt: string;
  updatedAt: string;
};

type Domain = {
  name: string;
};

const columnHelper = createColumnHelper<Path>();

const Pathtable = ({ paths }: { paths: Path[] }) => {
  const [data, _setData] = React.useState(() => [...paths]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  React.useEffect(() => {
    _setData([...paths]);
  }, [paths]);

  const deleteP = (id: number) => {
    Swal.fire({
      title: "Xóa Link?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const respone = await deletePath(id);
        if (respone.status) {
          toast.success(respone.message);
          router.refresh();
        } else {
          toast.error(respone.message);
        }
      }
    });
  };

  const offLink = async (id: number, link: string) => {
    setIsLoading(true);
    const respone = await offPath(id, link);
    if (respone.status) {
      toast.success(respone.message);
      router.refresh();
    } else {
      toast.error(respone.message);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const fakeLink = async (id: number, link: string) => {
    setIsLoading(true);
    const respone = await fakePath(id, link);
    if (respone.status) {
      toast.success(respone.message);
      router.refresh();
    } else {
      toast.error(respone.message);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const columns = [
    columnHelper.accessor("id", {
      header: () => <p className="min-w-[50px]">ID</p>,
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("content", {
      header: () => <p className="min-w-[200px]">Tên Bài</p>,
      cell: (info) => info.getValue().meta,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("path", {
      header: () => <p className="min-w-[200px]">Link Rút Gọn</p>,
      cell: (info) =>
        `${info.row.original.domain.name}/post/${info.getValue()}`,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("click", {
      header: () => <p className="min-w-[50px]">Clicks</p>,
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("content", {
      header: () => <p className="min-w-[75px]">Type</p>,
      cell: (info) => formatType(info.getValue().type),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("content.image", {
      header: () => <p className="min-w-[100px]">Image</p>,
      cell: (info) =>
        info.getValue() != null ? (
          <img
            src={`${info.getValue()}`}
            alt=""
            className="w-16 h-16 object-cover"
          />
        ) : null,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("status", {
      header: () => <p className="min-w-[60px]">Status</p>,
      cell: (info) => formatStatusPath(info.getValue()),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("fake", {
      header: () => <p className="min-w-[60px]">Fake</p>,
      cell: (info) => (
        <div className="flex justify-center">
          {info.getValue() ? (
            <BiSolidShieldPlus
              size={30}
              className="text-green-600 hover:text-green-800 cursor-pointer duration-300 hover:scale-110"
              onClick={() => {
                fakeLink(info.row.original.id, info.row.original.content.link);
              }}
            />
          ) : (
            <BiSolidShieldX
              size={30}
              className="text-yellow-600 hover:text-yellow-800 cursor-pointer duration-300 hover:scale-110"
              onClick={() => {
                fakeLink(info.row.original.id, info.row.original.content.link);
              }}
            />
          )}
        </div>
      ),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("createdAt", {
      header: () => <p className="min-w-[180px]">Ngày Tạo</p>,
      cell: (info) => formatDate(info.getValue()),
      footer: (info) => info.column.id,
    }),
    columnHelper.display({
      id: "actions",
      header: () => "Thao Tác",
      cell: (info) => (
        <div className="flex space-x-1">
          <Button
            variant="destructive"
            size={"sm"}
            className="px-2"
            onClick={() => {
              deleteP(info.row.original.id);
            }}
          >
            <FaTrash />
          </Button>
          {/* //button off link */}
          <Button
            variant="outline"
            className="bg-slate-300 px-2 bg-primary text-white dark:text-black"
            size={"sm"}
            onClick={() => {
              offLink(info.row.original.id, info.row.original.content.link);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GiClick />
            )}
          </Button>
          {/* //button copy link */}
          <Button
            variant="outline"
            className="bg-slate-300 px-2"
            size={"sm"}
            onClick={() => {
              navigator.clipboard.writeText(
                `${info.row.original.domain.name}/post/${info.row.original.path}`
              );
              toast.success("Copied to clipboard!");
            }}
          >
            <FaCopy />
          </Button>
          {/* button debug link */}
          <Button
            variant="outline"
            className="bg-blue-600 text-white px-2"
            size={"sm"}
            onClick={() => {
              window.open(
                `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(
                  `${info.row.original.domain.name}/post/${info.row.original.path}`
                )}`,
                "_blank"
              );
            }}
          >
            <FaSquareFacebook />
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
      <h1 className="font-bold text-xl">Danh Sách Liên Kết</h1>
      <input
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Tìm kiếm"
        className="border p-1 rounded max-w-[320px]"
      />
      <div className="overflow-x-auto">
        <table className="w-full border table-auto">
          <thead className="bg-secondary">
            {table.getHeaderGroups().map((headerGroup, index) => (
              <tr key={index}>
                {headerGroup.headers.map((header, index) => (
                  <th key={index} className="border py-2">
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
            {table.getRowModel().rows.map((row, index) => (
              <tr key={index}>
                {row.getVisibleCells().map((cell, index) => (
                  <td key={index} className="text-center p-2 border">
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

export default Pathtable;
