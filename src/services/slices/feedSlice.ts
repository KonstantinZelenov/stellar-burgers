import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getFeedsApi();
      return res;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    selectFeed: (state: TFeedState) => ({
      orders: state.orders,
      total: state.total,
      totalToday: state.totalToday,
      isLoading: state.isLoading,
      error: state.error
    }),
    selectFeedOrders: (state: TFeedState) => state.orders,
    selectFeedTotal: (state: TFeedState) => state.total,
    selectFeedTotalToday: (state: TFeedState) => state.totalToday,
    selectFeedLoading: (state: TFeedState) => state.isLoading,
    selectFeedError: (state: TFeedState) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  selectFeed,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedLoading,
  selectFeedError
} = feedSlice.selectors;

export default feedSlice.reducer;
