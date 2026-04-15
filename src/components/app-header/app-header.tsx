import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserData } from '../../services/user-slice';

export const AppHeader: FC = () => {
  const userName = useSelector(getUserData)?.name;
  return <AppHeaderUI userName={userName} />;
};
