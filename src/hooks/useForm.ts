import { ChangeEvent, useState } from 'react';

export const useForm = <T>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const createSetter =
    (key: keyof T) => (value: string | ((prev: string) => string)) => {
      setValues((prev) => ({
        ...prev,
        [key]: typeof value === 'function' ? value((prev as any)[key]) : value
      }));
    };

  return { values, handleChange, setValues, createSetter };
};
