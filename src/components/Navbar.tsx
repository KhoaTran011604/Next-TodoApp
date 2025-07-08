"use client"
import Link from "next/link"
import { useAuth } from "../context/auth"
import ThemeToggleButton from './common/ThemeToggleButton'
export const Navbar = ()=>{
    const auth = useAuth()
    return (
    <nav className="bg-blue-400 border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <div className="flex gap-4 items-center">

                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">TASK</span>
                     
                </a>
                <ThemeToggleButton/>    
            </div>
            <button data-collapse-toggle="navbar-multi-level" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-multi-level" aria-expanded="false" aria-label="toggle-theme-button">
                <span className="sr-only">Open main menu</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
            </button>
            
             
            <div className="hidden w-full md:block md:w-auto dark:text-white/90" id="navbar-multi-level">
                
                {
                    auth.isAuthenticated || true &&(
                        <div className="flex gap-4 items-center">
                            <Link href="/table-tasks" >Shadcn table</Link>
                            <Link href="/tanstack-table-tasks" >TanStack Table</Link>
                            <Link href="/all-tasks" >All</Link>
                            <Link href="/completed-tasks" >Completed</Link>
                            
                            <h2 onClick={()=>auth.logout()}>Đăng xuất</h2>
                        </div>
                    )
                }
                
            </div>
            
        </div>
    </nav>
    )
}