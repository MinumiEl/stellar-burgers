import { FC, SyntheticEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  getIsUserLoading,
  getUserError,
  loginUser
} from '../../services/user-slice';
import { PATHS } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { Preloader } from '@ui';
import { unwrapResult } from '@reduxjs/toolkit';
import { useForm } from '../../hooks';
import { TLoginData } from '@api';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(getIsUserLoading);
  const error = useSelector(getUserError) as string;

  const { values, createSetter } = useForm<TLoginData>({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(values));
      unwrapResult(result);
      navigate(PATHS.PROFILE);
    } catch {}
  };

  if (isLoading) return <Preloader />;

  return (
    <LoginUI
      errorText={error}
      email={values.email}
      setEmail={createSetter('email')}
      password={values.password}
      setPassword={createSetter('password')}
      handleSubmit={handleSubmit}
    />
  );
};
