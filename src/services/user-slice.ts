import { TUser } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../utils/cookie';

type TUserState = {
  isAuthorized: boolean;
  data: TUser | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  isAuthorized: false,
  data: null,
  isLoading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData) => {
    const result = await loginUserApi(loginData);
    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);

    return result;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (registerData: TRegisterData) => {
    const result = await registerUserApi(registerData);
    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);

    return result;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const updateUser = createAsyncThunk(
  'user/update',
  (user: Partial<TRegisterData>) => updateUserApi(user)
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  (data: { email: string }) => forgotPasswordApi(data)
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  (data: { password: string; token: string }) => resetPasswordApi(data)
);

export const getUser = createAsyncThunk('user/get', getUserApi);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    getUserData: (state) => state.data,
    getIsAuthorized: (state) => state.isAuthorized,
    getIsUserLoading: (state) => state.isLoading,
    getUserError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isAuthorized = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message ?? 'Неизвестная ошибка';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isAuthorized = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message ?? 'Неизвестная ошибка';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.data = null;
        state.isAuthorized = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message ?? 'Неизвестная ошибка';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isAuthorized = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message ?? 'Неизвестная ошибка';
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message ?? 'Неизвестная ошибка';
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message ?? 'Неизвестная ошибка';
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isAuthorized = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message ?? 'Неизвестная ошибка';
      });
  }
});

export const { getUserData, getIsAuthorized, getIsUserLoading, getUserError } =
  userSlice.selectors;

export default userSlice.reducer;
