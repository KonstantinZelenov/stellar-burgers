import authReducer, {
  loginUser,
  registerUser,
  checkUserAuth,
  logoutUser,
  setUser,
  selectUser,
  selectAuthLoading,
  selectAuthError,
  TAuthState
} from '../slices/authSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const initialState: TAuthState = {
  user: null,
  isLoading: false,
  error: null
};

describe('authSlice reducer', () => {
  it('Редьюсер возвращает корректное начальное состояние при инициализации (когда state = undefined и приходит неизвестный экшн)', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('sync actions', () => {
    it('Корректно сохранить данные пользователя успешно', () => {
      const action = setUser(mockUser);
      const state = authReducer(initialState, action);
      expect(state.user).toEqual(mockUser);
    });
  });

  describe('async actions', () => {
    describe('loginUser', () => {
      it('Установить состояние загрузки при входе успешно', () => {
        const action = { type: loginUser.pending.type };
        const state = authReducer(initialState, action);
        expect(state).toEqual({
          user: null,
          isLoading: true,
          error: null
        });
      });

      it('Сохранение данных пользователя при успешном входе успешно', () => {
        const action = {
          type: loginUser.fulfilled.type,
          payload: mockUser
        };
        const state = authReducer(initialState, action);
        expect(state).toEqual({
          user: mockUser,
          isLoading: false,
          error: null
        });
      });

      it('Вывести ошибку при неудачном входе успешно', () => {
        const errorMessage = 'Login failed';
        const action = {
          type: loginUser.rejected.type,
          payload: errorMessage
        };
        const state = authReducer(initialState, action);
        expect(state).toEqual({
          user: null,
          isLoading: false,
          error: errorMessage
        });
      });
    });

    describe('registerUser', () => {
      it('Установить состояние загрузки при начале регистрации успешно', () => {
        const action = { type: registerUser.pending.type };
        const state = authReducer(initialState, action);
        expect(state.isLoading).toBe(true);
      });

      it('Сохранить данные пользователя после успешной регистрации успешно', () => {
        const action = {
          type: registerUser.fulfilled.type,
          payload: mockUser
        };
        const state = authReducer(initialState, action);
        expect(state.user).toEqual(mockUser);
        expect(state.isLoading).toBe(false);
      });
    });

    describe('checkUserAuth', () => {
      it('Ошибка при неудачной проверке авторизации успешно', () => {
        const errorMessage = 'Auth check failed';
        const action = {
          type: checkUserAuth.rejected.type,
          payload: errorMessage
        };
        const state = authReducer(initialState, action);
        expect(state.error).toBe(errorMessage);
      });
    });

    describe('logoutUser', () => {
      it('Сбрасывать данные пользователя после выхода успешно', () => {
        const action = { type: logoutUser.fulfilled.type };
        const state = authReducer({ ...initialState, user: mockUser }, action);
        expect(state.user).toBeNull();
        expect(state.error).toBeNull();
      });
    });
  });

  describe('selectors', () => {
    const testState = {
      auth: {
        user: mockUser,
        isLoading: true,
        error: 'Test error'
      }
    };

    it('Возвращает объект пользователя', () => {
      expect(selectUser(testState)).toEqual(mockUser);
    });

    it('Возвращает true когда идёт загрузка', () => {
      expect(selectAuthLoading(testState)).toBe(true);
    });

    it('Возвращает сообщение об ошибке', () => {
      expect(selectAuthError(testState)).toBe('Test error');
    });
  });
});
