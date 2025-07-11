import { rootReducer } from '../store';
import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/ingredientsSlice';
import burgerConstructorReducer from '../slices/burgerConstructorSlice';
import feedReducer from '../slices/feedSlice';
import authReducer from '../slices/authSlice';
import ordersReducer from '../slices/orderSlice';

describe('rootReducer initialization', () => {
  test('Корневой редьюсер правильно инициализирует состояние хранилища при старте приложения. Должен возвращать корректное начальное состояние даже для неизвестного действия', () => {
    const testReducer = combineReducers({
      ingredients: ingredientsReducer,
      burgerConstructor: burgerConstructorReducer,
      feed: feedReducer,
      auth: authReducer,
      orders: ordersReducer
    });

    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    const expected = testReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(result).toEqual(expected);
  });
});

/*
it('Корневой редьюсер правильно инициализирует состояние хранилища при старте приложения. Должен возвращать корректное начальное состояние даже для неизвестного действия', () => {
  const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
  expect(result).toEqual({
    ingredients: ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' }),
    burgerConstructor: burgerConstructorReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    }),
    feed: feedReducer(undefined, { type: 'UNKNOWN_ACTION' }),
    auth: authReducer(undefined, { type: 'UNKNOWN_ACTION' }),
    orders: ordersReducer(undefined, { type: 'UNKNOWN_ACTION' })
  });
});
*/
