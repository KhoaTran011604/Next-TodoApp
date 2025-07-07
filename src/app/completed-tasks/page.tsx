"use client"
import ItemTask from "@/components/ItemTask";
import LottieComponent from "@/components/lotties/lottie";
import { GetCompletedTodo } from "api/todoService";
import { MainContext } from "context/main";
import { useContext, useEffect, useState } from "react";
import { Filter, Task } from "types/MainType";
const filterInit = {
    keySearch: "",
    sort: {},
    page: 1,
    pageSize: 10,
}
const CompletedTasks = ()=>{
    const context = useContext(MainContext);
    const [tasks, setTasks] = useState<Task[]>([])
    const [filterPage, setFilterpage] = useState<Filter>(filterInit)
     const [isLoading,setIsLoading] =useState<Boolean>(false)
    

    const LoadData = ()=>{
        if(isLoading){
            return
        }
        setIsLoading(true)
        GetCompletedTodo(filterPage)
        .then(response =>{
            if(response.success){
                setTasks(response.data)
            }
        }).catch(err => console.log("err => ",err))
        .finally(()=>{
            setIsLoading(false)
        }) 
    }
    useEffect(()=>{
        
        LoadData()
    },[filterPage])

    
    return(
        <div className=" text-black dark:bg-black/90 dark:text-white/90 min-h-[calc(100vh-70px)]">
            <h2 className="text-center py-8 text-3xl font-bold">Completed Tasks</h2>
            {
                isLoading ? (<LottieComponent/>):(
                    <div className="w-full flex flex-col justify-center items-center p-4 gap-8">
                        {
                            tasks.length > 0 && tasks.map((task,index)=>(<div key={index} className="w-96 border border-gray-300 py-4 px-16 rounded-lg dark:border-gray-700">
                                <ItemTask isInPageGetAll={false} task={task} handleCompletedTask={()=>{}} handleDeleteTask={()=>{}}/>
                            </div>))
                        }
                    </div>
                )
            }
        </div>
    )
}

export default CompletedTasks