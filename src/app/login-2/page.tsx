"use client"
import FormWrapper from "@/components/FormWrapper";
import { useAuth } from "context/auth";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { loginSchema } from "shemas/loginSchema";


const Login = ()=>{
    const auth = useAuth()
    
    const [data,setData] = useState({
        email:"khoa@gmail.com",
        password:"13224325"
    })

    const InputField = ({ name, type = "text" }: { name: string; type?: string}) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

      return (
        <div className="mb-4">
          <input
            type={type}
            {...register(name)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={name}
          />
          {errors[name] && (
            <p className="text-red-500 text-sm">{errors[name]?.message as string}</p>
          )}
        </div>
          
      );
    };
    return (

        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="mt-16">
               <FormWrapper schema={loginSchema} onSubmit={()=>{auth.login()}} className="max-w-md mx-auto">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>  
                  <InputField name="email" />
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                  <InputField name="password" type="password" />
                  <button className="bg-black text-white w-full rounded-xl py-4 mt-8" 
                  >Submit</button>
                </FormWrapper> 
                 
            </div>
        </section>
    );
}

export default Login