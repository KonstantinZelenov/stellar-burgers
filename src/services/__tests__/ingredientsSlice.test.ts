import ingredientsReducer, {
  fetchIngredients,
  selectIngredients,
  selectIsLoading,
  selectError,
  TIngredientsState
} from '../slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: '',
    image_mobile: '',
    image_large: ''
  },
  {
    _id: '2',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

describe('ingredientsSlice reducer', () => {
  const initialState: TIngredientsState = {
    items: [],
    isLoading: false,
    error: null
  };

  it('Редьюсер возвращает корректное начальное состояние при инициализации (когда state = undefined и приходит неизвестный экшн)', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('fetchIngredients actions', () => {
    it('Корректно обработать действие fetchIngredients.pending: установить isLoading в true и сбросить error успешно', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: null
      });
    });

    it('Корректно обработать успешную загрузку: сохранить данные, установить isLoading=false, error=null успешно', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        items: mockIngredients,
        isLoading: false,
        error: null
      });
    });

    it('Корректно обработать ошибку загрузки: установить error, isLoading=false успешно', () => {
      const errorMessage = 'Network error';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage
      });
    });
  });

  describe('selectors', () => {
    const testState = {
      ingredients: {
        items: mockIngredients,
        isLoading: true,
        error: 'Test error'
      }
    };

    it('Должен возвращать ингредиенты', () => {
      expect(selectIngredients(testState)).toEqual(mockIngredients);
    });

    it('Должен возвращать статус загрузки', () => {
      expect(selectIsLoading(testState)).toBe(true);
    });

    it('должен возвращать ошибку', () => {
      expect(selectError(testState)).toBe('Test error');
    });
  });
});
