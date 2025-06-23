import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { v4 as uuidv4 } from 'uuid';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import {
  addBun,
  addIngredient
} from '../../services/slices/burgerConstructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient as TIngredient));
      } else {
        const constructorIngredient: TConstructorIngredient = {
          ...ingredient,
          id: uuidv4()
        };
        dispatch(addIngredient(constructorIngredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
