import { FC, SyntheticEvent } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { getUserError, registerUser } from '../../services/user-slice';
import { useForm } from '../../hooks';
import { TRegisterData } from '@api';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(getUserError) as string;

  const { values, createSetter } = useForm<TRegisterData>({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser(values));
  };

  return (
    <RegisterUI
      errorText={error}
      email={values.email}
      userName={values.name}
      password={values.password}
      setEmail={createSetter('email')}
      setPassword={createSetter('password')}
      setUserName={createSetter('name')}
      handleSubmit={handleSubmit}
    />
  );
};
