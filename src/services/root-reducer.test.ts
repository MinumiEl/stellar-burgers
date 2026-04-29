import { rootReducer } from './store';
import ingredientsReducer from './ingredients-slice';
import constructorReducer from './constructor-slice';
import orderReducer from './order-slice';
import orderByNumberReducer from './order-by-number-slice';
import orderHistoryReducer from './order-history-slice';
import userReducer from './user-slice';
import userOrdersReducer from './user-orders-slice';

describe('Проверка rootReducer', () => {
  it('должен возвращать корректное начальное состояние при экшене @@INIT', () => {
    const action = { type: '@@INIT' };
    const state = rootReducer(undefined, action);
    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, action),
      burgerConstructor: constructorReducer(undefined, action),
      order: orderReducer(undefined, action),
      orderByNumber: orderByNumberReducer(undefined, action),
      orderHistory: orderHistoryReducer(undefined, action),
      user: userReducer(undefined, action),
      userOrders: userOrdersReducer(undefined, action)
    });
  });
});
