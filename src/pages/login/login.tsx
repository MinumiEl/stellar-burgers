import { FC, SyntheticEvent, useState } from 'react';
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

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(getIsUserLoading);
  const error = useSelector(getUserError) as string;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ email, password }));
      unwrapResult(result);
      navigate(PATHS.PROFILE);
    } catch {}
  };

  if (isLoading) return <Preloader />;

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
