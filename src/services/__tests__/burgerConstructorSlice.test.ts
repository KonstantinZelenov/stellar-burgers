import burgerConstructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  TBurgerConstructorState
} from '../slices/burgerConstructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

describe('burgerConstructorSlice reducer', () => {
  const initialState: TBurgerConstructorState = {
    bun: null,
    ingredients: []
  };

  const mockBun: TIngredient = {
    _id: 'bun1',
    name: 'Test Bun',
    type: 'bun',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 100,
    image: '',
    image_mobile: '',
    image_large: ''
  };

  const mockIngredient: TConstructorIngredient = {
    id: 'ing1',
    _id: 'ing1',
    name: 'Test Ingredient',
    type: 'main',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 50,
    image: '',
    image_mobile: '',
    image_large: ''
  };

  it('Редьюсер возвращает корректное начальное состояние при инициализации (когда state = undefined и приходит неизвестный экшн', () => {
    expect(burgerConstructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('addBun action', () => {
    it('Добавление булки в пустой конструктор успешно', () => {
      const state = burgerConstructorReducer(initialState, addBun(mockBun));
      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toEqual([]);
    });

    it('Замена существующей булки новой успешно', () => {
      const newBun = { ...mockBun, _id: 'bun2', name: 'New Bun' };
      const stateWithBun = { ...initialState, bun: mockBun };
      const state = burgerConstructorReducer(stateWithBun, addBun(newBun));
      expect(state.bun).toEqual(newBun);
    });
  });

  describe('addIngredient action', () => {
    it('Добавление первого ингредиента успешно', () => {
      const state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockIngredient);
    });

    it('Добавление нескольких ингредиентов успешно', () => {
      const secondIngredient = { ...mockIngredient, id: 'ing2', _id: 'ing2' };
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = burgerConstructorReducer(state, addIngredient(secondIngredient));
      expect(state.ingredients).toHaveLength(2);
    });
  });

  describe('removeIngredient action', () => {
    it('Удаление ингредиента по корректному id успешно', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredient]
      };
      const state = burgerConstructorReducer(
        stateWithIngredients,
        removeIngredient(mockIngredient.id)
      );
      expect(state.ingredients).toHaveLength(0);
    });

    it('Игнорирование некорректного id', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredient]
      };
      const state = burgerConstructorReducer(
        stateWithIngredients,
        removeIngredient('wrong-id')
      );
      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('moveIngredient action', () => {
    it('Перемещение ингредиента успешно', () => {
      const secondIngredient = { ...mockIngredient, id: 'ing2', _id: 'ing2' };
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredient, secondIngredient]
      };

      const state = burgerConstructorReducer(
        stateWithIngredients,
        moveIngredient({ dragIndex: 0, hoverIndex: 1 })
      );

      expect(state.ingredients[0].id).toBe('ing2');
      expect(state.ingredients[1].id).toBe('ing1');
    });

    it('Сохранение порядка при некорректном перемещении', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredient]
      };
      const state = burgerConstructorReducer(
        stateWithIngredients,
        moveIngredient({ dragIndex: 0, hoverIndex: 0 })
      );
      expect(state.ingredients[0].id).toBe('ing1');
    });
  });

  describe('clearConstructor action', () => {
    it('Сброс состояния конструктора успешно', () => {
      const stateWithData = {
        bun: mockBun,
        ingredients: [mockIngredient]
      };
      const state = burgerConstructorReducer(stateWithData, clearConstructor());
      expect(state).toEqual(initialState);
    });
  });
});
