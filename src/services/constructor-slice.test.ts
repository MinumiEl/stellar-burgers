import { TIngredient } from '@utils-types';
import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  initialState
} from './constructor-slice';
import { sendOrder } from './order-slice';

describe('Тестирование редьюсера burgerConstructor', () => {
  const mockMainIngredient: TIngredient = {
    _id: '1',
    name: 'Биокотлета',
    type: 'main',
    price: 100,
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  const mockBunIngredient: TIngredient = {
    _id: '2',
    name: 'Краторная булка N-200i',
    type: 'bun',
    price: 1255,
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  it('должен добавлять ингредиент (не булку) и генерировать уникальный id (nanoid)', () => {
    const newState = reducer(initialState, addIngredient(mockMainIngredient));
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toEqual(
      expect.objectContaining({
        ...mockMainIngredient,
        id: expect.any(String)
      })
    );
    expect(newState.bun).toBeNull();
  });

  it('должен добавлять булку в state.bun и не добавлять в массив ingredients', () => {
    const newState = reducer(initialState, addIngredient(mockBunIngredient));

    expect(newState.bun).toEqual(
      expect.objectContaining({
        ...mockBunIngredient,
        id: expect.any(String)
      })
    );
    expect(newState.ingredients).toHaveLength(0);
  });

  it('должен удалять ингредиент из списка по его id', () => {
    const stateWithItem = {
      bun: null,
      ingredients: [{ ...mockMainIngredient, id: 'unique-id' }]
    };

    const newState = reducer(stateWithItem, removeIngredient('unique-id'));
    expect(newState.ingredients).toHaveLength(0);
  });

  describe('изменение порядка ингредиентов (moveIngredient)', () => {
    const stateWithMultiple = {
      bun: null,
      ingredients: [
        { ...mockMainIngredient, id: 'id-1', name: 'Первый' },
        { ...mockMainIngredient, id: 'id-2', name: 'Второй' }
      ]
    };

    it('должен переместить ингредиент вверх', () => {
      const action = moveIngredient({ index: 1, direction: 'up' });
      const newState = reducer(stateWithMultiple, action);
      expect(newState.ingredients[0].id).toBe('id-2');
      expect(newState.ingredients[1].id).toBe('id-1');
    });

    it('должен переместить ингредиент вниз', () => {
      const action = moveIngredient({ index: 0, direction: 'down' });
      const newState = reducer(stateWithMultiple, action);
      expect(newState.ingredients[0].id).toBe('id-2');
      expect(newState.ingredients[1].id).toBe('id-1');
    });
  });

  it('должен очищать конструктор при успешном оформлении заказа (extraReducers)', () => {
    const dirtyState = {
      bun: mockBunIngredient,
      ingredients: [{ ...mockMainIngredient, id: '123' }]
    };
    const action = { type: sendOrder.fulfilled.type };
    const newState = reducer(dirtyState, action as any);

    expect(newState).toEqual(initialState);
  });
});
