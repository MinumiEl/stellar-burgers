import reducer, { fetchIngredients } from './ingredients-slice';

describe('ingredients slice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  it('должен ставить isLoading: true, когда запрос ушел (pending)', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранять ингредиенты, когда запрос успешен (fulfilled)', () => {
    const mockPayload = [{ name: 'Булка', type: 'bun' }];

    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockPayload
    };

    const state = reducer({ ...initialState, isLoading: true }, action);

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockPayload); // Тоже заменили на ingredients
  });

  it('должен записывать ошибку, когда запрос отклонен (rejected)', () => {
    const errorMessage = 'Ошибка сервера';
    const action = {
      type: fetchIngredients.rejected.type,
      payload: errorMessage
    };

    const state = reducer({ ...initialState, isLoading: true }, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
