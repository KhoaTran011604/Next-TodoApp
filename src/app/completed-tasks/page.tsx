'use client';
import ItemTask from '@/components/ItemTask';
import LottieComponent from '@/components/lotties/lottie';
import { useQueryClient } from '@tanstack/react-query';
import {
  GetCompletedTodo,
  GetCompletedTodo_WithoutPanigation,
} from 'api/todoService';
import { getItemLocalStore } from 'hooks/useLocalStore';
import { useEffect, useRef, useState } from 'react';
import { Filter, Task } from 'types/MainType';
import isEqual from 'lodash/isEqual';
import useStore from 'zustand/store';
const filterInit = {
  keySearch: '',
  sort: {},
  page: 1,
  pageSize: 10,
  sessionCode: Math.random().toString(),
};
const CompletedTasks = () => {
  const store = useStore();
  const {
    tasks,
    setTasks,
    filterPage,
    isLoading,
    setIsLoading,
    setTotalRecords,
  } = store;
  const queryClient = useQueryClient();
  // Truy cập dữ liệu đã cache
  const cachedStore = queryClient.getQueryData(['#todoList_Completed']);

  const LoadCompletedTasks = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(false);
    GetCompletedTodo_WithoutPanigation(filterPage)
      .then((response) => {
        if (response.success) {
          setTasks(response.data);
          queryClient.setQueryData(['#todoList_Completed'], () => {
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

  const isFirstLoad = useRef(true); // 👈 đánh dấu lần render đầu tiên
  useEffect(() => {
    cachedStore ? setTasks(cachedStore as Task[]) : LoadCompletedTasks();
  }, [filterPage]);

  return (
    <div className=" text-black dark:bg-black/90 dark:text-white/90 min-h-[calc(100vh-70px)]">
      <h2 className="text-center py-8 text-3xl font-bold">Completed Tasks</h2>
      {isLoading ? (
        <LottieComponent />
      ) : (
        <div className="w-full flex flex-col justify-center items-center p-4 gap-8">
          {tasks.length > 0 &&
            tasks.map((task, index) => (
              <div
                key={index}
                className="w-96 border border-gray-300 py-4 px-16 rounded-lg dark:border-gray-700"
              >
                <ItemTask
                  isInPageGetAll={false}
                  task={task}
                  handleCompletedTask={() => {}}
                  handleDeleteTask={() => {}}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CompletedTasks;
