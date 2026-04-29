import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { forgotPassword, getUserError } from '../../services/user-slice';

export const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(getUserError) as string;

  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(forgotPassword({ email })).then(() => {
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    });
  };

  return (
    <ForgotPasswordUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
