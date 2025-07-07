"use client"

import ItemTask from "@/components/ItemTask";
import LottieComponent from "@/components/lotties/lottie";
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
    const [isLoading,setIsLoading] =useState<Boolean>(false)

    const LoadData = ()=>{
        if(isLoading){
            return
        }
        setIsLoading(true)
        GetAllTodo(filterPage)
        .then(response =>{
            if(response.success){
                setTasks(response.data)
            }
        }).catch(err => console.log("err => ",err))
        .finally(()=>{
            setIsLoading(false)
        })
              
        
        
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
                    isLoading ? (<LottieComponent/>):(
                        <>

                            {
                                tasks.length > 0 && tasks.map((task,index)=>(<div key={index} className="w-96 border border-gray-300 p-4 rounded-lg dark:border-gray-700"
                                onDoubleClick={()=>setTask(task)}
                                >
                                    <ItemTask isInPageGetAll={true} task={task} handleCompletedTask={handleCompletedTask} handleDeleteTask={handleDeleteTask}/>
                                </div>))
                            }
                        </>

                    )
                }
            </div>
        </div>
    )
}

export default AllTasks