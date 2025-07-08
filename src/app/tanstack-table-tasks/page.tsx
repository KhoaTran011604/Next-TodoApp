"use client"

import LottieComponent from "@/components/lotties/lottie";
import { CompletedTodo, CreateTodo, DeleteTodo, GetAllTodo, UpdateTodo } from "api/todoService";
import {  useCallback, useEffect, useRef, useState } from "react";
import { Filter, Task } from "types/MainType";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../styles/components/ui/table"
import MyPagination from "@/components/ui/panigation/MyPagination";
import { Badge } from "@/styles/components/ui/badge";
import { BadgeCheckIcon } from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/styles/components/ui/dialog";
import { Label } from "@/styles/components/ui/label";
import { Input } from "@/styles/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/styles/components/ui/button";

import { debounce } from "lodash";
import useStore from "zustand/store";
import TodoTable from "@/components/TodoTable";


const taskInit = {_id:"",title:"",completed:false};

const AllTasks = ()=>{
    const store = useStore();
    const {setOpen,isLoading} = store
    return(
        <div className=" text-black dark:bg-black/90 dark:text-white/90 min-h-[calc(100vh-70px)]">
            <h2 className="text-center py-8 text-3xl font-bold animate-up-down">All Tasks</h2>

            <div className="w-full flex flex-col justify-center items-center p-16 gap-8">
                
                {
                    isLoading ? (<LottieComponent/>):(
                        <div>
                            <TodoTable/>
                        </div>

                    )
                }
                
                
            </div>
        </div>
    )
}

export default AllTasks