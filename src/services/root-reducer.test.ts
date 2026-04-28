import { rootReducer } from './store';

describe('Проверка rootReducer', () => {
  it('должен правильно инициализировать начальное состояние', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({
      ingredients: expect.any(Object),
      burgerConstructor: expect.any(Object),
      order: expect.any(Object),
      orderByNumber: expect.any(Object),
      orderHistory: expect.any(Object),
      user: expect.any(Object),
      userOrders: expect.any(Object),
    });
  });
});
