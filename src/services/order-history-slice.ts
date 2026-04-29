import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

export type OrderHistoryState = {
  orders: TOrder[];
  feed: {
    total: number;
    totalToday: number;
  };
  isLoading: boolean;
  error: string | null;
};

export const initialState: OrderHistoryState = {
  orders: [],
  feed: {
    total: 0,
    totalToday: 0
  },
  isLoading: false,
  error: null
};

export const getOrderHistory = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('orderHistory/getOrderHistory', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (error: any) {
    return rejectWithValue(
      String(error?.message || 'Ошибка при получении списка заказов')
    );
  }
});

export const orderHistorySlice = createSlice({
  name: 'orderHistory',
  initialState,
  reducers: {},
  selectors: {
    getOrders: (state) => state.orders,
    getFeed: (state) => state.feed,
    getIsOrderLoading: (state) => state.isLoading,
    getError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      })
      .addCase(getOrderHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.feed = {
          total: action.payload.total,
          totalToday: action.payload.totalToday
        };
      });
  }
});

export const { getOrders, getFeed, getIsOrderLoading, getError } =
  orderHistorySlice.selectors;

export default orderHistorySlice.reducer;
