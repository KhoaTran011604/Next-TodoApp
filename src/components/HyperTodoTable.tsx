import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../styles/components/ui/table';
import { Task } from 'types/MainType';
import DefaultHeader from './default-header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from './ui/button';
import { BadgeCheckIcon, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/styles/components/ui/badge';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDoubleClick: (data: any) => void;
}

const columnHelper = createColumnHelper<Task>();

export default function HyperTodoTable({
  tasks,
  handleCompletedTask,
  setOpen,
  setTask,
  setOpenAlert,
}) {
  const columns = [
    columnHelper.display({
      id: 'action',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
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
    }),
    columnHelper.accessor('title', {
      header: (info) => <DefaultHeader info={info} name="Title" />,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('completed', {
      header: (info) => <DefaultHeader info={info} name="Completed" />,
      cell: (info) => (
        <div>
          {info.row.original.completed && (
            <Badge
              variant="secondary"
              className="bg-blue-500 text-white dark:bg-blue-600"
            >
              <BadgeCheckIcon />
              Completed
            </Badge>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('actions', {
      header: (info) => <DefaultHeader info={info} name="Actions" />,
      cell: (info) => {
        return (
          <div className="flex gap-4">
            <button
              className="px-4 py-2 rounded-md dark:bg-gray-800 bg-black text-white"
              onClick={() => handleCompletedTask(info.row.original._id)}
              disabled={info.row.original.completed}
            >
              Complete
            </button>
            <button
              className="px-4 py-2 rounded-md dark:bg-gray-800 bg-black text-white"
              onClick={() => {
                setTask(info.row.original);
                setOpenAlert(true);
              }}
            >
              Delete
            </button>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'more',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'} className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className=""
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuLabel className="">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="">Copy</DropdownMenuItem>
              <DropdownMenuItem>Paste</DropdownMenuItem>
              <DropdownMenuItem>Cut</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    }),
  ];

  return (
    <DataTable<Task, any>
      columns={columns}
      data={tasks}
      onDoubleClick={(row) => {
        setTask(row.original);
        setOpen(true);
      }}
    />
  );
}

function DataTable<TData, TValue>({
  columns,
  data,
  onDoubleClick,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      rowSelection,
      sorting,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  return (
    <div className="w-full h-[800px] flex flex-col gap-4">
      <div className="rounded-md border flex flex-2/3 flex-col overflow-hidden">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background shadow-md">
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
          <TableBody className="flex-1 overflow-auto">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onDoubleClick={() => {
                    onDoubleClick(row);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      suppressHydrationWarning
                      className="min-w-[100px] text-left"
                    >
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

      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 bg-gray-200 dark:bg-transparent rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 bg-gray-200 dark:bg-transparent rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
