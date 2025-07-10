'use client';

import ItemTask from '@/components/ItemTask';
import LottieComponent from '@/components/lotties/lottie';
import { getItemLocalStore } from 'hooks/useLocalStore';
import { useEffect, useRef } from 'react';
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
    LoadAllTasks,
    handleSubmit,
    handleCompletedTask,
    handleDeleteTask,
  } = store;
  const inputRef = useRef(null);
  useEffect(() => {
    const localstore = getItemLocalStore('#todoList');
    localstore ? setTasks(localstore) : LoadAllTasks();

    if (inputRef) {
      inputRef.current.focus();
    }
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
