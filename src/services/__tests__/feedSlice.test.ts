import feedReducer, {
  fetchFeeds,
  selectFeed,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedLoading,
  selectFeedError,
  TFeedState
} from '../slices/feedSlice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: '1',
    ingredients: ['ing1', 'ing2'],
    status: 'done',
    name: 'Order 1',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    number: 1
  }
];

const mockApiResponse = {
  orders: mockOrders,
  total: 100,
  totalToday: 10
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

describe('feedSlice reducer', () => {
  it('Редьюсер возвращает корректное начальное состояние при инициализации (когда state = undefined и приходит неизвестный экшн)', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchFeeds actions', () => {
    it('Устанавливает isLoading=true при начале загрузки успешно', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = feedReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('Сохраняет данные ленты и сбрасывать загрузку при успешном ответе успешно', () => {
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: mockApiResponse
      };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        orders: mockOrders,
        total: 100,
        totalToday: 10,
        isLoading: false,
        error: null
      });
    });

    it('Сохраняет ошибку и сбрасывает загрузку при неудачном запросе успешно', () => {
      const errorMessage = 'Network error';
      const action = {
        type: fetchFeeds.rejected.type,
        payload: errorMessage
      };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage
      });
    });
  });

  describe('selectors', () => {
    const testState = {
      feed: {
        orders: mockOrders,
        total: 100,
        totalToday: 10,
        isLoading: true,
        error: 'Test error'
      }
    };

    it('Возвращакет полное состояние ленты', () => {
      expect(selectFeed(testState)).toEqual(testState.feed);
    });

    it('Возвращает список заказов', () => {
      expect(selectFeedOrders(testState)).toEqual(mockOrders);
    });

    it('Возвращает общее количество заказов', () => {
      expect(selectFeedTotal(testState)).toBe(100);
    });

    it('Возвращает количество заказов за сегодня', () => {
      expect(selectFeedTotalToday(testState)).toBe(10);
    });

    it('Возвращает статус загрузки', () => {
      expect(selectFeedLoading(testState)).toBe(true);
    });

    it('Возвращает ошибку', () => {
      expect(selectFeedError(testState)).toBe('Test error');
    });
  });
});
