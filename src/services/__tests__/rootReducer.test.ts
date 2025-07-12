import { rootReducer } from '../store';
import { initialState as ingredientsInitialState } from '../slices/ingredientsSlice';
import { initialState as burgerConstructorInitialState } from '../slices/burgerConstructorSlice';
import { initialState as feedInitialState } from '../slices/feedSlice';
import { initialState as authInitialState } from '../slices/authSlice';
import { initialState as ordersInitialState } from '../slices/orderSlice';
import { expect } from '@jest/globals';

describe('rootReducer initialization', () => {
  test('Должен возвращать корректное начальное состояние хранилища', () => {
    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    const expected = {
      ingredients: ingredientsInitialState,
      burgerConstructor: burgerConstructorInitialState,
      feed: feedInitialState,
      auth: authInitialState,
      orders: ordersInitialState
    };

    expect(result).toEqual(expected);
  });
});
