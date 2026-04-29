import { FC, useEffect, useMemo } from 'react';
import { OrderInfoUI, Preloader } from '@ui';
import { TIngredient } from '@utils-types';
import { getIngredients } from '../../services/ingredients-slice';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import {
  getIsOrdersByNumberLoading,
  getOrderByNumber,
  getOrdersByNumber,
  getOrdersByNumberError
} from '../../services/order-by-number-slice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const orderNumber = Number(useParams<{ number: string }>());

  const orderData = useSelector(getOrdersByNumber);
  const isLoading = useSelector(getIsOrdersByNumberLoading);
  const error = useSelector(getOrdersByNumberError);
  const ingredients: TIngredient[] = useSelector(getIngredients);

  useEffect(() => {
    dispatch(getOrderByNumber(orderNumber));
  }, [dispatch]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading) return <Preloader />;
  if (error) return <div>Ошибка: {error}</div>;
  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
