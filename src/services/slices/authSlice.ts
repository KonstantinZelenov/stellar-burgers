import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi
} from '../../utils/burger-api';
import { TUser } from '@utils-types';
import { getUserApi } from '../../utils/burger-api';
import { setCookie } from '../../utils/cookie';
import { deleteCookie } from '../../utils/cookie';

type TAuthState = {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TAuthState = {
  user: null,
  isLoading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(data);
      if (!res.success) {
        return rejectWithValue('Ошибка авторизации');
      }
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Неверный email или пароль');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    data: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await registerUserApi(data);
      if (!res.success) {
        return rejectWithValue('Ошибка регистрации');
      }
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res.user;
    } catch (err: any) {
      return rejectWithValue(
        err.message === 'User already exists'
          ? 'Пользователь с таким email уже существует'
          : 'Ошибка регистрации'
      );
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return rejectWithValue('No refresh token');

    try {
      const res = await getUserApi();
      return res.user;
    } catch (error) {
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
      return rejectWithValue((error as Error).message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
      return null;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    selectAuthLoading: (state) => state.isLoading,
    selectAuthError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.user = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        checkUserAuth.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.user = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setUser } = authSlice.actions;
export const { selectUser, selectAuthLoading, selectAuthError } =
  authSlice.selectors;
export default authSlice.reducer;
