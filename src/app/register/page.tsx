'use client';
import FormWrapper from '@/components/FormWrapper';
import { useAuth } from 'context/auth';
import Link from 'next/link';
import { ChangeEventHandler, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { registerSchema } from 'shemas/registerSchema';

type InputFieldProps = {
  name: string;
  type?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const Register = () => {
  const auth = useAuth();

  const [data, setData] = useState({
    fullName: '',
    email: '',
    password: '',
    password_again: '',
  });

  const InputField = ({
    name,
    type = 'text',
    value = '',
    onChange,
  }: InputFieldProps) => {
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
          defaultValue={value}
          onBlur={onChange}
        />
        {errors[name] && (
          <p className="text-red-500 text-sm">
            {errors[name]?.message as string}
          </p>
        )}
      </div>
    );
  };
  const handleSubmit = async () => {
    if (data.password === data.password_again) {
      const res = await auth.register(data);
      alert(res ? 'Register success!!' : 'Register fail!!!!');
    } else {
      alert('Mật khẩu không khớp!!');
    }
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mt-16">
        <FormWrapper
          schema={registerSchema}
          onSubmit={handleSubmit}
          className="max-w-md mx-auto"
        >
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your name
          </label>
          <InputField
            name="name"
            value={data.name}
            onChange={(e) => {
              setData({
                ...data,
                email: e.target.value,
              });
            }}
          />
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <InputField
            name="email"
            value={data.email}
            onChange={(e) => {
              setData({
                ...data,
                email: e.target.value,
              });
            }}
          />
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <InputField
            name="password"
            type="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />

          <label
            htmlFor="password_again"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password again
          </label>
          <InputField
            name="password_again"
            type="password"
            value={data.password_again}
            onChange={(e) =>
              setData({ ...data, password_again: e.target.value })
            }
          />
          <div className=" w-full flex justify-end">
            <Link href={'/login-2'} className=" text-blue-500 text-sm">
              Go to login
            </Link>
          </div>
          <button className="bg-black text-white w-full rounded-xl py-4 mt-8">
            Submit
          </button>
        </FormWrapper>
      </div>
    </section>
  );
};

export default Register;
