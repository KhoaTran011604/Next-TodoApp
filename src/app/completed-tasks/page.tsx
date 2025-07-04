"use client"
import { MainContext } from "context/main";
import { useContext, useEffect, useState } from "react";
import { Task } from "types/MainType";

const CompletedTasks = ()=>{
    const context = useContext(MainContext);
    const [tasks, setTasks] = useState<Task[]>([])
    const [task, setTask] = useState<Task>({id:Math.random().toString(),title:"",completed:false})
    useEffect(()=>{
        const data = context.getCompletedTasks()
        if(data){
            setTasks(data)
        }
        
    },[context.tasks])

    
    return(
        <div className=" text-black dark:bg-black/90 dark:text-white/90 min-h-[calc(100vh-70px)]">
            <h2 className="text-center py-8 text-3xl font-bold">Completed Tasks</h2>
            <div className="w-full flex flex-col justify-center items-center p-16 gap-8">
                {
                    tasks.length > 0 && tasks.map((task,index)=>(<div key={index} className="w-96 border border-gray-300 py-4 px-16 rounded-lg dark:border-gray-700">
                        <h2 className="text-2xl font-medium text-blue-500">{task.title}</h2>
                        <div className="flex justify-between">
                            <h2>{"completed"}</h2>
                            
                        </div>
                    </div>))
                }
            </div>
        </div>
    )
}

export default CompletedTasks