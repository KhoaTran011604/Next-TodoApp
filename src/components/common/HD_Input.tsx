import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { HD_InputProps, InputFieldProps } from 'types/MainType';
import { bool, boolean } from 'yup';

const HD_Input = ({
  title,
  isItemForm = false,
  name,
  type = 'text',
  initValue,
  onChange,
}: HD_InputProps) => {
  const [value, setValue] = useState(initValue);
  const formContext = isItemForm ? useFormContext() : null;
  const errors = formContext?.formState.errors;
  const handleChange = (e) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };
  useEffect(() => {
    initValue && setValue(initValue);
  }, [initValue]);

  return (
    <>
      {title && (
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {title}
        </label>
      )}
      <div className="mb-4">
        <input
          type={type}
          {...(isItemForm ? formContext.register(name) : {})}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={name}
          value={value}
          onChange={handleChange}
        />
        {isItemForm && errors[name] && (
          <p className="text-red-500 text-sm">
            {errors[name]?.message as string}
          </p>
        )}
      </div>
    </>
  );
};

export default HD_Input;
