'use client';

import LottieComponent from '@/components/lotties/lottie';
import {
  CompletedTodo,
  CreateTodo,
  DeleteTodo,
  GetAllTodo,
  GetAllTodo_WithoutPanigation,
  UpdateTodo,
} from 'api/todoService';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Filter, Task } from 'types/MainType';
import { Modal } from '@/components/common/Modal';
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/styles/components/ui/dialog';
import { Label } from '@/styles/components/ui/label';
import { Input } from '@/styles/components/ui/input';
import { DialogClose } from '@radix-ui/react-dialog';
import { Button } from '@/styles/components/ui/button';
import { AlertModal } from '@/components/common/AlertModal';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/styles/components/ui/alert-dialog';
import { debounce } from 'lodash';
import { getItemLocalStore, setItemLocalStore } from 'hooks/useLocalStore';
import isEqual from 'lodash/isEqual';
import TodoTable2 from '@/components/HyperTodoTable';
import { useQueryClient } from '@tanstack/react-query';

const taskInit = { _id: '', title: '', completed: false };
const filterInit = {
  keySearch: '',
  sort: {},
  page: 1,
  pageSize: 10,
  sessionCode: Math.random().toString(),
};
const AllTasks = () => {
  const inputRef = useRef(null);
  const queryClient = useQueryClient();
  const cachedStore = queryClient.getQueryData(['#todoList']);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<Task>(taskInit);
  const [filterPage, setFilterPage] = useState<Filter>(filterInit);
  const [keySearch, setKeySearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [error, setError] = useState(false);

  const LoadData = () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    GetAllTodo_WithoutPanigation(filterPage)
      .then((response) => {
        if (response.success) {
          setTasks(response.data);

          queryClient.setQueryData(['#todoList'], () => {
            return response.data; // thêm mới
          });
          setTotalRecords(response.metaData.totalRecords);
        }
      })
      .catch((err) => console.log('err => ', err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCreateTask = async (data: Task) => {
    const { _id, ...rest } = data;
    const response = await CreateTodo(rest);
    if (response.success) {
      LoadData();
    }
  };
  const handleUpdateTask = async (data: Task) => {
    const { _id, ...rest } = data;
    const response = await UpdateTodo(_id, rest);
    if (response.success) {
      LoadData();
    }
  };
  const handleSubmit = (data: Task) => {
    if (task.title.length === 0) {
      setError(true);
      return;
    }
    setOpen(false);
    task._id.length > 0 ? handleUpdateTask(data) : handleCreateTask(data);
  };
  const handleCompletedTask = async (id: string) => {
    const response = await CompletedTodo(id);
    if (response.success) {
      LoadData();
    }
  };

  const handleDeleteTask = async (id: string) => {
    const response = await DeleteTodo(id);

    if (response.success) {
      LoadData();
    }
  };
  const onDebounce = useCallback(
    debounce((term) => {
      setFilterPage({
        ...filterPage,
        keySearch: term.trim(),
        page: 1,
        sessionCode: Math.random().toString(),
      });
    }, 700),
    []
  );

  const isFirstLoad = useRef(true); // 👈 đánh dấu lần render đầu tiên
  useEffect(() => {
    if (!isFirstLoad.current && !isEqual(filterPage, filterInit)) {
      LoadData();
    } else {
      cachedStore ? setTasks(cachedStore as Task[]) : LoadData();
      isFirstLoad.current = false;
      return;
    }
    // Sau lần đầu tiên render
  }, [filterPage]);

  return (
    <div className=" text-black dark:bg-black/90 dark:text-white/90 min-h-[calc(100vh-70px)]">
      <h2 className="text-center py-8 text-3xl font-bold animate-up-down">
        All Tasks
      </h2>

      <div className="w-full flex flex-col justify-center items-center p-16 gap-8">
        <div className="flex gap-4 justify-between w-128">
          <Input
            id="search"
            name="search"
            placeholder="Search"
            className="flex-1"
            value={keySearch}
            onChange={(e) => {
              setKeySearch(e.target.value);
              onDebounce(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              setOpen(true);
              setTask(taskInit);
              setError(false);
            }}
          >
            New Task
          </Button>
        </div>

        {isLoading ? (
          <LottieComponent />
        ) : (
          <div>
            {/* <Table>
                                <TableCaption>A list of todos.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead className="w-[100px]" onClick={()=>handleSort("title")}>Title</TableHead>
                                    <TableHead onClick={()=>handleSort("title")}>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tasks.length > 0 && tasks.map((task) => (
                                    <TableRow key={task._id} onDoubleClick={()=>{setTask(task);setOpen(true)}}>
                                        <TableCell className="font-medium min-w-[300px]">{task.title}</TableCell>
                                        <TableCell className="min-w-[100px]">{task.completed  ? (
                                            <Badge
                                                variant="secondary"
                                                className="bg-blue-500 text-white dark:bg-blue-600"
                                            >
                                                <BadgeCheckIcon />
                                                Completed
                                            </Badge>
                                        ):"_"}</TableCell>
                                        <TableCell className="font-medium">
                                            <button className="px-4 py-2 rounded-md dark:bg-gray-800 bg-black text-white" onClick={() => handleCompletedTask(task._id)} disabled={task.completed}>Complete</button>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <button className="px-4 py-2 rounded-md dark:bg-gray-800 bg-black text-white" onClick={() => {
                                                setTask(task)
                                                setOpenAlert(true)
                                            }} >Delete</button>
                                        </TableCell>

                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <MyPagination 
                                filterPage={filterPage} 
                                setFilterPage={(data)=>{
                                    setFilterPage({
                                        ...filterPage,
                                        ...data
                                    })
                                }} 
                                totalRecords={totalRecords}
                            /> */}
            <TodoTable2
              tasks={tasks}
              setOpen={setOpen}
              handleCompletedTask={handleCompletedTask}
              setTask={setTask}
              setOpenAlert={setOpenAlert}
            />
          </div>
        )}
        <Modal open={open} setOpen={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {task._id.length > 0 ? 'Update Task' : 'Add Task'}
              </DialogTitle>
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
                  onChange={(e) => setTask({ ...task, title: e.target.value })}
                  ref={inputRef}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleSubmit(task);
                    }
                  }}
                />
                {error && (
                  <label className="text-red-500 text-sm dark:text-gray-300">
                    [Trường bắt buộc]
                  </label>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setTask(taskInit);
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={() => handleSubmit(task)}>
                {task._id.length > 0 ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Modal>
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
              <AlertDialogAction onClick={() => handleDeleteTask(task._id)}>
                Yes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertModal>
      </div>
    </div>
  );
};

export default AllTasks;
