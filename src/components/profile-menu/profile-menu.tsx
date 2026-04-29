import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Preloader, ProfileMenuUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { getIsUserLoading, logoutUser } from '../../services/user-slice';
import { unwrapResult } from '@reduxjs/toolkit';
import { PATHS } from '../../utils/constants';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsUserLoading);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    try {
      const result = await dispatch(logoutUser());
      unwrapResult(result);
      navigate(PATHS.LOGIN);
    } catch {}
  };

  if (isLoading) return <Preloader />;

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
