"use client"

import { CompletedTodo, CreateTodo, DeleteTodo, GetAllTodo, UpdateTodo } from "api/todoService";
import {  useEffect, useRef, useState } from "react";
import { Filter, Task } from "types/MainType";


const taskInit = {_id:"",title:"",completed:false};
const filterInit = {
    keySearch: "",
    sort: {},
    page: 1,
    pageSize: 10,
}
const AllTasks = ()=>{
    //const context = useContext(MainContext);
    const inputRef = useRef(null)
    
    const [tasks, setTasks] = useState<Task[]>([])
    const [task, setTask] = useState<Task>(taskInit)
    const [filterPage, setFilterpage] = useState<Filter>(filterInit)

    const LoadData = async()=>{
        const response = await GetAllTodo(filterPage)
        console.log(response);       
        if(response.success){
            setTasks(response.data)
        }
        
    }

    const handleCreateTask = async (data:Task)=>{
        const {_id,...rest} = data
        const response = await CreateTodo(rest)
        if(response.success){
            LoadData()
        }   
    }
    const handleUpdateTask = async (data:Task)=>{
        const {_id,...rest} = data
        const response = await UpdateTodo(_id,rest)
        if(response.success){
            LoadData()
        } 
    }
    const handleSubmit = (data :Task)=>{
        setTask(taskInit);
        task._id.length > 0 ? handleUpdateTask(data) :   handleCreateTask(data)
    }
    const handleCompletedTask = async (id:string)=>{
        const response = await CompletedTodo(id)
        if(response.success){
            LoadData()
        } 
    }
    const handleDeleteTask = async (id:string)=>{
        const response = await DeleteTodo(id)
        if(response.success){
            LoadData()
        } 
    }
    useEffect(()=>{
        LoadData()
        if(inputRef){
            inputRef.current.focus()
        }
    },[filterPage])

    return(
        <div className=" text-black dark:bg-black/90 dark:text-white/90 min-h-[calc(100vh-70px)]">
            <h2 className="text-center py-8 text-3xl font-bold animate-up-down">All Tasks</h2>
            <div className="w-full flex flex-col justify-center items-center p-16 gap-8">
                <div className="flex items-center gap-4">
                    <input className="border border-gray-400 px-4 py-2 rounded-md flex-1 dark:border-gray-700" value={task.title} onChange={(e)=>setTask({
                        ...task,
                        title: e.target.value})}
                        ref={inputRef}
                        onKeyDown={event =>{
                            if (event.key === 'Enter') {
                                handleSubmit(task)
                            }
                        }}  
                    />
                    <button 
                        onClick={()=>{
                            handleSubmit(task)
                        }}
                            
                    >{task._id.length > 0 ? "Update" : "Add"}</button>
                    {task._id.length > 0 && <button onClick={()=>setTask(taskInit)}>Close</button>}
                </div>
                {
                    tasks.length > 0 && tasks.map((task,index)=>(<div key={index} className="w-96 border border-gray-300 py-4 px-16 rounded-lg dark:border-gray-700"
                    onDoubleClick={()=>setTask(task)}
                    >
                        <h2 className={`text-2xl font-medium text-blue-500 ${task.completed ? "line-through":""} `}>{task.title}</h2>
                        <div className="flex justify-between">
                            <h2>{"_"}</h2>
                            <div className="flex gap-4">
                                <button onClick={()=>{
                                    handleCompletedTask(task._id)
                                }}>complete</button>
                                <button onClick={()=>{
                                    handleDeleteTask(task._id)
                                }}>delete</button>
                            </div>
                        </div>
                    </div>))
                }
            </div>
        </div>
    )
}

export default AllTasks