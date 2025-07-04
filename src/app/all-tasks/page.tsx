"use client"

import { MainContext } from "context/main";
import { useContext, useEffect, useRef, useState } from "react";
import { Task } from "types/MainType";

const taskInit = {id:"",title:"",completed:false}
const AllTasks = ()=>{
    const context = useContext(MainContext);
    const inputRef = useRef(null)
    
    const [tasks, setTasks] = useState<Task[]>([])
    const [task, setTask] = useState<Task>(taskInit)
    useEffect(()=>{
        setTasks(context.tasks)
        if(inputRef){
            inputRef.current.focus()
        }
    },[context.tasks])

    return(
        <div className=" text-black dark:bg-black/90 dark:text-white/90 min-h-[calc(100vh-70px)]">
            <h2 className="text-center py-8 text-3xl font-bold animate-up-down">All Tasks</h2>
            <div className="w-full flex flex-col justify-center items-center p-16 gap-8">
                <div className="flex items-center gap-4">
                    <input className="border border-gray-400 px-4 py-2 rounded-md flex-1 dark:border-gray-700" value={task.title} onChange={(e)=>setTask({
                        ...task,
                        title: e.target.value})}
                        ref={inputRef}
                    />
                    <button onClick={()=>{
                        setTask(taskInit);
                        task.id.length > 0 ? context.handleUpdateTask(task) :   context.handleAddTask(task)
                    }}>{task.id.length > 0 ? "Update" : "Add"}</button>
                    {task.id.length > 0 && <button onClick={()=>setTask(taskInit)}>Close</button>}
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
                                    context.handleCompletedTask(index)
                                }}>complete</button>
                                <button onClick={()=>{
                                    context.handleDeleteTask(task)
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