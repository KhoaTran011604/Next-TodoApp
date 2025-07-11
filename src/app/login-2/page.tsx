'use client';
import HD_Input from '@/components/common/HD_Input';
import HyperFormWrapper from '@/components/HyperFormWrapper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  GetAllTodo_WithoutPanigation,
  GetCompletedTodo_WithoutPanigation,
} from 'api/todoService';
import { useAuth } from 'context/auth';
import Link from 'next/link';

import { useState } from 'react';
import { loginSchema } from 'shemas/loginSchema';
import { LoginProps } from 'types/MainType';
const initData = {
  email: '',
  password: '',
};

const Login = () => {
  const auth = useAuth();
  const [data, setData] = useState(initData);

  const Login = async () => {
    const res = await auth.login(data);

    if (!res.success) {
      alert('Login fail!!!');
    } else {
      return res;
    }
  };
  const GetAllTodo = async () => {
    const response = await GetAllTodo_WithoutPanigation({
      sortField: 'createdAt',
      sortOrder: 'desc',
    });
    return response.data;
  };
  const GetCompletedTodo = async () => {
    const response = await GetCompletedTodo_WithoutPanigation({
      sortField: 'createdAt',
      sortOrder: 'desc',
    });
    return response.data;
  };
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => Login(),
    onSuccess: async (dataLogin) => {
      if (dataLogin.success) {
        console.log('dataLogin', dataLogin);

        const [todos, completed] = await Promise.all([
          GetAllTodo(),
          GetCompletedTodo(),
        ]);
        queryClient.setQueryData(['#user'], dataLogin.data);
        queryClient.setQueryData(['#todoList'], todos);
        queryClient.setQueryData(['#todoList_Completed'], completed);
      }
    },
  });
  const handleSubmit = () => {
    mutation.mutate();
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mt-16">
        <HyperFormWrapper
          schema={loginSchema}
          defaultValues={initData}
          onSubmit={() => {
            handleSubmit();
          }}
          className="max-w-md mx-auto"
        >
          <HD_Input
            title="Email"
            name="email"
            isItemForm={true}
            initValue={data.email}
            onChange={(value) =>
              setData({
                ...data,
                email: value,
              })
            }
          />
          <HD_Input
            title="Password"
            name="password"
            type="password"
            isItemForm={true}
            initValue={data.password}
            onChange={(value) =>
              setData({
                ...data,
                password: value,
              })
            }
          />

          <div className=" w-full flex justify-end">
            <Link href={'/register'} className=" text-blue-500 text-sm">
              Go to register
            </Link>
          </div>
          <button className="bg-black text-white w-full rounded-xl py-4 mt-8">
            Submit
          </button>
        </HyperFormWrapper>
      </div>
    </section>
  );
};

export default Login;
