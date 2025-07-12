import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '../../utils/burger-api';
import { createAction } from '@reduxjs/toolkit';

export type TOrdersState = {
  currentOrder: TOrder | null;
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  backgroundLocation?: {
    pathname: string;
    search: string;
    hash: string;
    state: unknown;
    key: string;
  };
};

export const initialState: TOrdersState = {
  currentOrder: null,
  orders: [],
  isLoading: false,
  error: null,
  backgroundLocation: undefined
};

export const saveBackgroundLocation = createAction<
  | {
      pathname: string;
      search: string;
      hash: string;
      state: unknown;
      key: string;
    }
  | undefined
>('orders/saveBackgroundLocation');

export const createOrder = createAsyncThunk(
  'orders/create',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const res = await orderBurgerApi(ingredients);
      return res.order;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const res = await getOrderByNumberApi(number);
      return res.orders[0];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  selectors: {
    selectCurrentOrder: (state) => state.currentOrder,
    selectOrders: (state) => state.orders,
    selectOrdersLoading: (state) => state.isLoading,
    selectOrdersError: (state) => state.error,
    selectBackgroundLocation: (state) => state.backgroundLocation
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveBackgroundLocation, (state, action) => {
        state.backgroundLocation = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.orders = action.payload.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          state.isLoading = false;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentOrder } = ordersSlice.actions;
export const {
  selectCurrentOrder,
  selectOrders,
  selectOrdersLoading,
  selectOrdersError,
  selectBackgroundLocation
} = ordersSlice.selectors;
export default ordersSlice.reducer;
