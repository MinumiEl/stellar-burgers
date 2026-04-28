import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from './ingredients-slice';
import constructorReducer from './constructor-slice';
import orderReducer from './order-slice';
import orderByNumberReducer from './order-by-number-slice';
import orderHistoryReducer from './order-history-slice';
import userReducer from './user-slice';
import userOrdersReducer from './user-orders-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  orderByNumber: orderByNumberReducer,
  orderHistory: orderHistoryReducer,
  user: userReducer,
  userOrders: userOrdersReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
