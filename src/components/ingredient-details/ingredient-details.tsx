import { FC, useMemo } from 'react';
import { IngredientDetailsUI, Preloader } from '@ui';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIngredients, getIsLoading } from '../../services/ingredients-slice';
import { getError } from '../../services/order-slice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(getIngredients);
  const isLoading = useSelector(getIsLoading);
  const error = useSelector(getError);

  const ingredientData = useMemo(
    () => ingredients.find((ingredient) => ingredient._id === id) ?? null,
    [id, ingredients]
  );

  if (!ingredientData || isLoading) {
    return <Preloader />;
  }
  if (error) return <>error</>;

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
