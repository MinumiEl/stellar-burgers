import type { ProtectedRouteProps } from './type';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIsAuthorized } from '../../services/user-slice';
import { PATHS } from '../../utils/constants';

export const ProtectedRoute = ({
  forAuthorized = false
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthorized = useSelector(getIsAuthorized);
  const from = location.state?.from || PATHS.HOME;

  if (isAuthorized && !forAuthorized) {
    return <Navigate to={from} />;
  }

  if (!isAuthorized && forAuthorized) {
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} />;
  }

  return <Outlet />;
};
