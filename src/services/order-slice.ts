import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

type OrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const sendOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('constructor/sendOrder', async (ingredientIds, { rejectWithValue }) => {
  try {
    if (!ingredientIds.length) {
      return rejectWithValue('Список ингредиентов пуст');
    }

    const response = await orderBurgerApi(ingredientIds);

    return {
      ...response.order,
      ingredients: ingredientIds
    } as TOrder;
  } catch (error: any) {
    return rejectWithValue(
      String(error?.message || 'Ошибка оформления заказа')
    );
  }
});

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal(state) {
      state.error = null;
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  selectors: {
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData,
    getError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      });
  }
});

export const { clearOrderModal } = orderSlice.actions;
export const { getOrderRequest, getOrderModalData, getError } =
  orderSlice.selectors;

export default orderSlice.reducer;
