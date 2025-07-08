
import { CompletedTodo, CreateTodo, DeleteTodo, GetAllTodo, GetCompletedTodo, UpdateTodo } from "api/todoService"
import { Filter, Task } from "types/MainType";
import { create } from "zustand";


interface StoreState {
    tasks: Task[];
    task: Task;
    open: boolean,
    error: boolean,
    filterPage: Filter;
    isLoading: boolean;
    totalRecords: number;
    setTask: (data: Task) => void;
    setOpen: (status: boolean) => void;
    setError: (status: boolean) => void;
    LoadAllTasks: () => Promise<void>;
    LoadCompletedTasks: () => Promise<void>;
    handleCreateTask: (data: Task) => Promise<void>;
    handleUpdateTask: (data: Task) => Promise<void>;
    handleSubmit: (data: Task) => void;
    handleCompletedTask: (id: string) => Promise<void>;
    handleDeleteTask: (id: string) => Promise<void>;


}
const taskInit = { _id: "", title: "", completed: false };
const filterInit = {
    keySearch: "",
    sort: {},
    page: 1,
    pageSize: 100,
}
const useStore = create<StoreState>((set, get) => ({
    tasks: [],
    task: { _id: "", title: "", completed: false },
    open: false,
    error: false,
    filterPage: filterInit,
    isLoading: false,
    totalRecords: 0,
    setTask: (data: Task) => {
        set({ task: data })
    },
    setOpen: (status: boolean) => {
        set({ open: status })
    },
    setError: (status: boolean) => {
        set({ error: status })
    },
    LoadAllTasks: async () => {
        if (get().isLoading) {
            return
        }
        set({ isLoading: false })
        GetAllTodo(get().filterPage)
            .then(response => {

                if (response.success) {
                    set({ tasks: response.data })
                    set({ totalRecords: response.metaData.totalRecords })
                }
            })
            .catch(err => console.log("err => ", err))
            .finally(() => {
                set({ isLoading: false })
            })

    },
    LoadCompletedTasks: async () => {
        if (get().isLoading) {
            return
        }
        set({ isLoading: false })
        GetCompletedTodo(get().filterPage)
            .then(response => {

                if (response.success) {
                    set({ tasks: response.data })
                    set({ totalRecords: response.metaData.totalRecords })
                }
            })
            .catch(err => console.log("err => ", err))
            .finally(() => {
                set({ isLoading: false })
            })

    },
    handleCreateTask: async (data: Task) => {
        const { _id, ...rest } = data
        const response = await CreateTodo(rest)
        if (response.success) {
            get().LoadAllTasks()
        }

    },
    handleUpdateTask: async (data: Task) => {
        const { _id, ...rest } = data
        const response = await UpdateTodo(_id, rest)
        if (response.success) {
            get().LoadAllTasks()
        }
    },
    handleSubmit: (data: Task) => {
        set({ task: taskInit })
        get().task._id.length > 0 ? get().handleUpdateTask(data) : get().handleCreateTask(data)
    },
    handleCompletedTask: async (id: string) => {
        const response = await CompletedTodo(id)
        if (response.success) {
            get().LoadAllTasks()
        }
    },
    handleDeleteTask: async (id: string) => {
        const response = await DeleteTodo(id)
        if (response.success) {
            get().LoadAllTasks()
        }
    }
}))

export default useStore