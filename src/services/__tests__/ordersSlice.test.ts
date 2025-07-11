import ordersReducer, {
  createOrder,
  fetchUserOrders,
  fetchOrderByNumber,
  saveBackgroundLocation,
  clearCurrentOrder,
  selectCurrentOrder,
  selectOrders,
  selectOrdersLoading,
  selectOrdersError,
  selectBackgroundLocation,
  TOrdersState
} from '../slices/orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '1',
  ingredients: ['ing1', 'ing2'],
  status: 'done',
  name: 'Test Order',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  number: 1
};

const mockOrders: TOrder[] = [
  mockOrder,
  {
    ...mockOrder,
    _id: '2',
    createdAt: '2023-01-02T00:00:00Z'
  }
];

const mockLocation = {
  pathname: '/test',
  search: '',
  hash: '',
  state: null,
  key: 'test'
};

const initialState: TOrdersState = {
  currentOrder: null,
  orders: [],
  isLoading: false,
  error: null,
  backgroundLocation: undefined
};

describe('ordersSlice reducer', () => {
  it('Редьюсер возвращает корректное начальное состояние при инициализации (когда state = undefined и приходит неизвестный экшн)', () => {
    expect(ordersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('sync actions', () => {
    it('Обрабатывает clearCurrentOrder успешно', () => {
      const stateWithOrder = { ...initialState, currentOrder: mockOrder };
      const state = ordersReducer(stateWithOrder, clearCurrentOrder());
      expect(state.currentOrder).toBeNull();
    });

    it('Cохраняет backgroundLocation успешно', () => {
      const action = saveBackgroundLocation(mockLocation);
      const state = ordersReducer(initialState, action);
      expect(state.backgroundLocation).toEqual(mockLocation);
    });
  });

  describe('async actions', () => {
    describe('createOrder', () => {
      it('Устанавливает isLoading=true при создании заказа успешно', () => {
        const action = { type: createOrder.pending.type };
        const state = ordersReducer(initialState, action);
        expect(state.isLoading).toBe(true);
      });

      it('Сохраняет текущий заказ при успешном создании успешно', () => {
        const action = {
          type: createOrder.fulfilled.type,
          payload: mockOrder
        };
        const state = ordersReducer(initialState, action);
        expect(state.currentOrder).toEqual(mockOrder);
      });
    });

    describe('fetchOrderByNumber', () => {
      it('Сохраняет заказ по номеру и сбрасывать загрузку успешно', () => {
        const action = {
          type: fetchOrderByNumber.fulfilled.type,
          payload: mockOrder
        };
        const state = ordersReducer(
          { ...initialState, isLoading: true },
          action
        );
        expect(state.currentOrder).toEqual(mockOrder);
        expect(state.isLoading).toBe(false);
      });
    });

    describe('fetchUserOrders', () => {
      it('Сортирует заказы по дате и сбрасывать загрузку успешно', () => {
        const action = {
          type: fetchUserOrders.fulfilled.type,
          payload: mockOrders
        };
        const state = ordersReducer(
          { ...initialState, isLoading: true },
          action
        );
        expect(state.orders[0]._id).toBe('2');
        expect(state.isLoading).toBe(false);
      });
    });

    it('Сохраняет ошибку при неудачном запросе успешно', () => {
      const errorMessage = 'Request failed';
      const action = {
        type: fetchUserOrders.rejected.type,
        payload: errorMessage
      };
      const state = ordersReducer({ ...initialState, isLoading: true }, action);
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('selectors', () => {
    const testState = {
      orders: {
        currentOrder: mockOrder,
        orders: mockOrders,
        isLoading: true,
        error: 'Test error',
        backgroundLocation: mockLocation
      }
    };

    it('selectCurrentOrder возвращает текущий заказ', () => {
      expect(selectCurrentOrder(testState)).toEqual(mockOrder);
    });

    it('selectOrders возвращает список заказов', () => {
      expect(selectOrders(testState)).toEqual(mockOrders);
    });

    it('selectOrdersLoading возвращает статус загрузки', () => {
      expect(selectOrdersLoading(testState)).toBe(true);
    });

    it('selectOrdersError возвращает ошибку', () => {
      expect(selectOrdersError(testState)).toBe('Test error');
    });

    it('selectBackgroundLocation возвращает location', () => {
      expect(selectBackgroundLocation(testState)).toEqual(mockLocation);
    });
  });
});
