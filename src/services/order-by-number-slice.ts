import { TOrder } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';

type OrderByNumberState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

export const initialState: OrderByNumberState = {
  order: null,
  isLoading: false,
  error: null
};

export const getOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orderInfo/getOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const result = await getOrderByNumberApi(number);
    return result.orders?.[0];
  } catch (error: any) {
    return rejectWithValue(
      String(error?.message || 'Ошибка при получении списка заказов')
    );
  }
});

export const orderHistorySlice = createSlice({
  name: 'orderByNumber',
  initialState,
  reducers: {},
  selectors: {
    getOrdersByNumber: (state) => state.order,
    getIsOrdersByNumberLoading: (state) => state.isLoading,
    getOrdersByNumberError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.payload ?? 'Неизвестная ошибка';
        state.isLoading = false;
      });
  }
});

export const {
  getOrdersByNumber,
  getIsOrdersByNumberLoading,
  getOrdersByNumberError
} = orderHistorySlice.selectors;

export default orderHistorySlice.reducer;
