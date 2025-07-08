import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Modal } from "@/components/common/Modal";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/styles/components/ui/dialog";
import { AlertModal } from "@/components/common/AlertModal";
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/styles/components/ui/alert-dialog";
import { useEffect, useState } from 'react';
import { Task } from 'types/MainType'
import useStore from 'zustand/store';
import { Label } from '@/styles/components/ui/label';
import { Input } from '@/styles/components/ui/input';
import { Button } from '@/styles/components/ui/button';

const taskInit = { _id: "", title: "", completed: false };
export default function TodoTable(){
    const store = useStore();
    const {tasks,task,setTask,filterPage,open,setOpen,error,setError,handleUpdateTask,handleCreateTask,LoadAllTasks,handleCompletedTask,handleDeleteTask} = store
    const [globalFilter, setGlobalFilter] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const columns: ColumnDef<Task>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const todo = row.original
        return (
          <span
            //onClick={() => toggleTodo(todo.id)}
            className={`cursor-pointer ${todo.completed ? 'line-through text-gray-400' : ''}`}
          >
            {todo.title}
          </span>
        )
      },
    },
    {
      accessorKey: 'completed',
      header: 'Status',
      cell: ({ row }) => (row.original.completed ? '✅ Done' : '❌ Active'),
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-4">
            <button
            onClick={() => handleCompletedTask(row.original._id)}
            className="px-4 py-2 rounded-md dark:bg-gray-800 bg-black text-white"
            >
                Completed
            </button>
            <button
            onClick={() => {
                setTask(row.original)
                setOpenAlert(true)
            }}
            className="px-4 py-2 rounded-md dark:bg-gray-800 bg-black text-white"
            >
                Delete
            </button>
        </div>
      ),
    },
  ]

    const table = useReactTable({
        data: tasks,
        columns,
        state: {
        globalFilter,
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onGlobalFilterChange: setGlobalFilter,
    })

    const handleSubmit = (data :Task)=>{
        if(task.title.length ===0){
            setError(true)
            return
        }
        setOpen(false)
        task._id.length > 0 ? handleUpdateTask(data) :   handleCreateTask(data)
    }
    useEffect(()=>{
        LoadAllTasks()
        
    },[filterPage])
    return(
        <div className="space-y-4">
            <div className="flex gap-4 justify-end w-full">
                    
                    <Button onClick={() => setOpen(true)}>New Task</Button>
                </div>
            <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search todo..."
            className="w-full border px-3 py-2 rounded"
            />

            <table className="w-full">
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gray-100 dark:bg-gray-700">
                    {headerGroup.headers.map((header) => (
                    <th key={header.id} className="p-4 px-8 border text-left min-w-[200px]">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                    ))}
                </tr>
                ))}
            </thead>

            <tbody>
                {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50 dark:bg-gray-800  dark:hover:bg-gray-700"
                    onDoubleClick={()=>{
                        setTask(row.original)
                        setOpen(true)
                    }}
                >
                    {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 px-8">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
            </table>

            <div className="flex justify-between items-center pt-2">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1 bg-gray-200 dark:bg-transparent rounded disabled:opacity-50"
                >
                    Previous
                </button>

                <span>
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>

                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1 bg-gray-200 dark:bg-transparent rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            <AlertModal openAlert={openAlert} setOpenAlert={setOpenAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{`Are you absolutely sure to delete ?`}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {`Delete ${task?.title}`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>No</AlertDialogCancel>
                    <AlertDialogAction onClick={()=>handleDeleteTask(task._id)}>
                        Yes
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertModal>
            <Modal open={open} setOpen={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{task._id.length > 0 ? "Update Task" : "Add Task"}</DialogTitle>
                        {/* <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re
                            done.
                        </DialogDescription> */}
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Title</Label>
                            <Input 
                                id="name-1" 
                                name="title" 
                                value={task.title} 
                                onChange={e=>setTask({...task,title:e.target.value})} 
                                //ref={inputRef}
                                onKeyDown={event =>{
                                    if (event.key === 'Enter') {
                                        handleSubmit(task)
                                    }
                                }}  
                            />
                            {error && <label  className="text-red-500 text-sm dark:text-gray-300">[Trường bắt buộc]</label>}
                        </div>
                        
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={()=>{
                                setTask(taskInit)
                                setOpen(false)
                            }}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={()=>{handleSubmit(task)}}>{task._id.length > 0 ? "Update" : "Add"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Modal>
        </div>
    )
}