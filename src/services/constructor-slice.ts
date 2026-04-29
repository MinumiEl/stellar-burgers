import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { sendOrder } from './order-slice';

type ConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
    },

    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) => {
      const { index, direction } = action.payload;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex >= 0 && targetIndex < state.ingredients.length) {
        [state.ingredients[index], state.ingredients[targetIndex]] = [
          state.ingredients[targetIndex],
          state.ingredients[index]
        ];
      }
    }
  },

  selectors: {
    getBun: (state) => state.bun,
    getSelectedIngredients: (state) => state.ingredients,
    getConstructor: (state) => state
  },

  extraReducers: (builder) => {
    builder.addCase(sendOrder.fulfilled, () => initialState);
  }
});

export const { setBun, addIngredient, removeIngredient, moveIngredient } =
  constructorSlice.actions;

export const { getBun, getSelectedIngredients, getConstructor } =
  constructorSlice.selectors;

export default constructorSlice.reducer;
