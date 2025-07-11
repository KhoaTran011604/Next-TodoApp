'use client';

import ItemTask from '@/components/ItemTask';
import LottieComponent from '@/components/lotties/lottie';
import { useQueryClient } from '@tanstack/react-query';
import {
  CompletedTodo,
  CreateTodo,
  DeleteTodo,
  GetAllTodo_WithoutPanigation,
  UpdateTodo,
} from 'api/todoService';
import { getItemLocalStore } from 'hooks/useLocalStore';
import { useEffect, useRef } from 'react';
import { Task } from 'types/MainType';
import useStore from 'zustand/store';

const taskInit = { _id: '', title: '', completed: false };

const AllTasks = () => {
  const store = useStore();
  const {
    tasks,
    setTasks,
    task,
    setTask,
    filterPage,
    isLoading,
    setIsLoading,
    open,
    setOpen,
    error,
    setError,
  } = store;
  const inputRef = useRef(null);
  const queryClient = useQueryClient();

  const cachedStore = queryClient.getQueryData(['#todoList']);

  const handleCreateTask = async (data: Task) => {
    const { _id, ...rest } = data;
    const response = await CreateTodo(rest);
    if (response.success) {
      LoadAllTasks();
    }
  };
  const handleUpdateTask = async (data: Task) => {
    const { _id, ...rest } = data;
    const response = await UpdateTodo(_id, rest);
    if (response.success) {
      LoadAllTasks();
    }
  };

  const handleCompletedTask = async (id: string) => {
    const response = await CompletedTodo(id);
    if (response.success) {
      LoadAllTasks();
    }
  };
  const handleDeleteTask = async (id: string) => {
    const response = await DeleteTodo(id);
    if (response.success) {
      LoadAllTasks();
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
  const LoadAllTasks = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    GetAllTodo_WithoutPanigation(filterPage)
      .then((response) => {
        if (response.success) {
          setTasks(response.data);
          //setItemLocalStore('#todoList', response.data);
          queryClient.setQueryData(['#todoList'], () => {
            return response.data; // thêm mới
          });
        }
      })
      .catch((err) => console.log('err => ', err))
      .finally(() => {
        setIsLoading(false);
      });
  };
  const isFirstLoad = useRef(true); // 👈 đánh dấu lần render đầu tiên
  useEffect(() => {
    setTask(taskInit);
    cachedStore ? setTasks(cachedStore as Task[]) : LoadAllTasks();
  }, [filterPage]);

  return (
    <div className=" text-black dark:bg-black/90 dark:text-white/90 min-h-[calc(100vh-70px)]">
      <h2 className="text-center py-8 text-3xl font-bold animate-up-down">
        All Tasks
      </h2>
      <div className="w-full flex flex-col justify-center items-center p-16 gap-8">
        <div className="flex items-center gap-4">
          <input
            className="border border-gray-400 px-4 py-2 rounded-md flex-1 dark:border-gray-700"
            value={task.title}
            onChange={(e) =>
              setTask({
                ...task,
                title: e.target.value,
              })
            }
            ref={inputRef}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSubmit(task);
              }
            }}
          />
          <button
            onClick={() => {
              handleSubmit(task);
            }}
          >
            {task._id.length > 0 ? 'Update' : 'Add'}
          </button>
          {task._id.length > 0 && (
            <button onClick={() => setTask(taskInit)}>Close</button>
          )}
        </div>
        {isLoading ? (
          <LottieComponent />
        ) : (
          <>
            {tasks.length > 0 &&
              tasks.map((task, index) => (
                <div
                  key={index}
                  className="w-96 border border-gray-300 p-4 rounded-lg dark:border-gray-700"
                  onDoubleClick={() => setTask(task)}
                >
                  <ItemTask
                    isInPageGetAll={true}
                    task={task}
                    handleCompletedTask={handleCompletedTask}
                    handleDeleteTask={handleDeleteTask}
                  />
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default AllTasks;
