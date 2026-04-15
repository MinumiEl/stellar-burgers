import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getIsOrderLoading,
  getOrderHistory,
  getOrders
} from '../../services/order-history-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getOrders);
  const isLoading = useSelector(getIsOrderLoading);

  const handleGetFeeds = () => dispatch(getOrderHistory());

  useEffect(() => {
    dispatch(getOrderHistory());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />
    </>
  );
};
